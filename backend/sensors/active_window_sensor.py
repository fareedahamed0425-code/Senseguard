"""
Active Window Sensor — Windows only.
Polls the foreground window every N seconds and fires a callback with:
  {
    "type": "active_window",
    "window_title": str,
    "process_name": str,
    "pid": int,
    "is_game": bool,
    "timestamp": float
  }
Uses ctypes + win32 APIs (no extra packages beyond pywin32 or pure ctypes).
"""
import ctypes
import ctypes.wintypes
import threading
import time
import psutil
import os

user32 = ctypes.windll.user32
kernel32 = ctypes.windll.kernel32

# Known game/app keywords for quick detection
GAME_KEYWORDS = {
    "valorant", "csgo", "cs2", "fortnite", "apex", "overwatch",
    "roblox", "minecraft", "leagueoflegends", "league of legends",
    "dota", "pubg", "warzone", "battlefield", "rainbow six",
    "r6siege", "rl", "rocketleague", "gta", "cyberpunk",
    "elden ring", "destiny", "halo", "splitgate", "the finals",
}

APP_ICONS = {
    "valorant": "🎯",
    "csgo": "💥",
    "cs2": "💥",
    "fortnite": "🏗️",
    "apex": "🔫",
    "overwatch": "🦸",
    "chrome": "🌐",
    "firefox": "🦊",
    "code": "📝",
    "cursor": "📝",
    "notepad": "📄",
    "discord": "💬",
    "spotify": "🎵",
    "steam": "🕹️",
    "explorer": "📁",
    "powershell": "⚡",
    "cmd": "⚡",
    "python": "🐍",
    "node": "💚",
    "vite": "⚡",
}


def _get_foreground_info():
    """Returns (window_title, process_name, pid) for the current foreground window."""
    hwnd = user32.GetForegroundWindow()
    if not hwnd:
        return "Desktop", "explorer.exe", 0

    # Get window title
    length = user32.GetWindowTextLengthW(hwnd)
    title_buf = ctypes.create_unicode_buffer(length + 1)
    user32.GetWindowTextW(hwnd, title_buf, length + 1)
    title = title_buf.value or "Unknown"

    # Get PID from window handle
    pid = ctypes.wintypes.DWORD()
    user32.GetWindowThreadProcessId(hwnd, ctypes.byref(pid))
    pid_val = pid.value

    # Get process name from PID
    process_name = "unknown.exe"
    try:
        proc = psutil.Process(pid_val)
        process_name = proc.name()
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        pass

    return title, process_name, pid_val


def _classify(process_name: str, title: str):
    """Returns (display_name, is_game, icon) for a process."""
    proc_lower = process_name.lower().replace(".exe", "").replace("-", "").replace("_", "")
    title_lower = title.lower()

    is_game = any(kw in proc_lower or kw in title_lower for kw in GAME_KEYWORDS)

    # Friendly display name: strip .exe, title-case
    display_name = os.path.splitext(process_name)[0]
    if len(title) > 0 and len(title) < 60:
        display_name = title  # prefer the window title if it's short and meaningful

    # Pick an icon
    icon = "🖥️"
    for key, emoji in APP_ICONS.items():
        if key in proc_lower or key in title_lower:
            icon = emoji
            break
    if is_game:
        icon = "🎮"

    return display_name, is_game, icon


class ActiveWindowSensor:
    def __init__(self, callback=None, interval: float = 1.0):
        self.callback = callback
        self.interval = interval
        self.running = False
        self.thread = None
        self._last_pid = -1
        self._last_title = ""

    def _poll(self):
        while self.running:
            try:
                title, process_name, pid = _get_foreground_info()
                # Only fire callback on change to reduce noise
                if pid != self._last_pid or title != self._last_title:
                    self._last_pid = pid
                    self._last_title = title
                    display_name, is_game, icon = _classify(process_name, title)
                    if self.callback:
                        self.callback({
                            "type": "active_window",
                            "window_title": title,
                            "process_name": process_name,
                            "display_name": display_name,
                            "icon": icon,
                            "pid": pid,
                            "is_game": is_game,
                            "timestamp": time.time(),
                        })
            except Exception:
                pass
            time.sleep(self.interval)

    def start(self):
        self.running = True
        self.thread = threading.Thread(target=self._poll, daemon=True)
        self.thread.start()

    def stop(self):
        self.running = False
        if self.thread:
            self.thread.join(timeout=2)


if __name__ == "__main__":
    def on_change(data):
        print(f"[{data['process_name']}] {data['display_name']} (game={data['is_game']})")

    sensor = ActiveWindowSensor(callback=on_change, interval=0.5)
    sensor.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        sensor.stop()
