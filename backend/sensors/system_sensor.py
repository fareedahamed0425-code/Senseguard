import psutil
import time
import GPUtil
import threading

class SystemSensor:
    def __init__(self, callback=None, interval=1.0):
        self.callback = callback
        self.interval = interval
        self.running = False
        self.thread = None

    def collect_metrics(self):
        while self.running:
            cpu_usage = psutil.cpu_percent(interval=None)
            memory = psutil.virtual_memory()
            
            gpu_data = []
            try:
                gpus = GPUtil.getGPUs()
                for gpu in gpus:
                    gpu_data.append({
                        "id": gpu.id,
                        "name": gpu.name,
                        "load": gpu.load * 100,
                        "memory_used": gpu.memoryUsed,
                        "memory_total": gpu.memoryTotal,
                        "temperature": gpu.temperature
                    })
            except Exception as e:
                # Handle cases where no GPU is found or driver issues
                pass

            data = {
                "type": "system_metrics",
                "cpu_usage": cpu_usage,
                "ram_usage": memory.percent,
                "ram_used_gb": memory.used / (1024**3),
                "ram_total_gb": memory.total / (1024**3),
                "gpus": gpu_data,
                "timestamp": time.time()
            }

            if self.callback:
                self.callback(data)
            
            time.sleep(self.interval)

    def start(self):
        self.running = True
        self.thread = threading.Thread(target=self.collect_metrics, daemon=True)
        self.thread.start()

    def stop(self):
        self.running = False
        if self.thread:
            self.thread.join()

if __name__ == "__main__":
    def print_data(data):
        print(f"CPU: {data['cpu_usage']}% | RAM: {data['ram_usage']}% | GPUs: {len(data['gpus'])}")

    sensor = SystemSensor(callback=print_data)
    sensor.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        sensor.stop()
