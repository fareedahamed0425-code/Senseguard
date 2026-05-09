const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const isDev = require('electron-is-dev');

let mainWindow;
let overlayWindow;
let pythonProcess;
let tray;

function startBackend() {
  // Use the python executable from the virtual environment
  const pythonPath = path.join(__dirname, '../../venv/Scripts/python.exe');
  const scriptPath = path.join(__dirname, '../../backend/main.py');
  
  pythonProcess = spawn(pythonPath, [scriptPath]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });
}

function createWindows() {
  // Main Dashboard Window
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#0D2137',
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    frame: false, // Futuristic look
    titleBarStyle: 'hidden',
  });

  let port = 5173;
  try {
    const portFile = path.join(__dirname, '../dev-port.txt');
    if (fs.existsSync(portFile)) {
      port = fs.readFileSync(portFile, 'utf8').trim();
    }
  } catch (err) {
    console.error('Failed to read dev-port.txt:', err);
  }

  // Read Backend Port
  let backendPort = 8000;
  try {
    const bPortFile = path.join(__dirname, '../../backend/backend-port.txt');
    // Simple sync wait for up to 5 seconds
    let attempts = 0;
    while (!fs.existsSync(bPortFile) && attempts < 50) {
      const waitTill = new Date(new Date().getTime() + 100);
      while (waitTill > new Date()) {}
      attempts++;
    }
    if (fs.existsSync(bPortFile)) {
      backendPort = fs.readFileSync(bPortFile, 'utf8').trim();
    }
  } catch (err) {}

  const startURL = isDev 
    ? `http://localhost:${port}?backendPort=${backendPort}` 
    : `file://${path.join(__dirname, '../dist/index.html')}?backendPort=${backendPort}`;

  mainWindow.loadURL(startURL);
  mainWindow.once('ready-to-show', () => mainWindow.show());

  // Overlay Window
  overlayWindow = new BrowserWindow({
    width: 400,
    height: 200,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  overlayWindow.setIgnoreMouseEvents(true, { forward: true }); // Allows interactive elements
  overlayWindow.loadURL(`${startURL}&overlay=true`);

  overlayWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      overlayWindow.hide();
    }
  });

  // IPC to handle mouse pass-through toggle if needed
  const { ipcMain } = require('electron');
  ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win.setIgnoreMouseEvents(ignore, options);
  });

  // Window controls
  ipcMain.on('window-minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.minimize();
  });

  ipcMain.on('window-maximize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    }
  });

  ipcMain.on('window-close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.close();
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, '../public/logo.svg')); // Use logo.svg instead of missing vite.svg
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Dashboard', click: () => {
      mainWindow.show();
      mainWindow.focus();
    }},
    { label: 'Show HUD Overlay', click: () => {
      if (overlayWindow) {
        overlayWindow.show();
        overlayWindow.focus();
      }
    }},
    { type: 'separator' },
    { label: 'Optimize Now', click: () => {/* Trigger via IPC or WebRequest */} },
    { type: 'separator' },
    { label: 'Exit SenseGuard', click: () => app.quit() }
  ]);
  tray.setToolTip('SenseGuard AI');
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  startBackend();
  createWindows();
  createTray();
});

app.on('before-quit', () => {
  app.isQuitting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  if (pythonProcess) pythonProcess.kill();
});
