const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = require('electron-is-dev');

let mainWindow;
let overlayWindow;
let pythonProcess;
let tray;

function startBackend() {
  // Path to python executable (assumes python is in PATH)
  const pythonPath = 'python';
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

  const startURL = isDev 
    ? 'http://localhost:5174' 
    : `file://${path.join(__dirname, '../dist/index.html')}`;

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
  overlayWindow.loadURL(`${startURL}?overlay=true`);

  // IPC to handle mouse pass-through toggle if needed
  const { ipcMain } = require('electron');
  ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win.setIgnoreMouseEvents(ignore, options);
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, '../public/vite.svg')); // Placeholder icon
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Dashboard', click: () => mainWindow.show() },
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  if (pythonProcess) pythonProcess.kill();
});
