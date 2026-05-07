import time
import threading
from pynput import mouse
import numpy as np

class MouseSensor:
    def __init__(self, callback=None):
        self.callback = callback
        self.last_pos = (0, 0)
        self.last_time = time.time()
        self.listener = None
        self.running = False
        self._lock = threading.Lock()
        
    def on_move(self, x, y):
        with self._lock:
            current_time = time.time()
            dt = current_time - self.last_time
            
            if dt > 0:
                dx = x - self.last_pos[0]
                dy = y - self.last_pos[1]
                velocity = np.sqrt(dx**2 + dy**2) / dt
                
                data = {
                    "type": "mouse_move",
                    "x": x,
                    "y": y,
                    "dx": dx,
                    "dy": dy,
                    "velocity": velocity,
                    "timestamp": current_time
                }
                
                if self.callback:
                    self.callback(data)
                
                self.last_pos = (x, y)
                self.last_time = current_time

    def start(self):
        self.running = True
        self.listener = mouse.Listener(on_move=self.on_move)
        self.listener.start()

    def stop(self):
        self.running = False
        if self.listener:
            self.listener.stop()

if __name__ == "__main__":
    def print_data(data):
        if data['velocity'] > 1000: # Only print high speed moves for testing
            print(f"High speed move: {data['velocity']:.2f} px/s")

    sensor = MouseSensor(callback=print_data)
    sensor.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        sensor.stop()
