import psutil
import time
import logging

logger = logging.getLogger("SenseGuard.Performance")

class PerformanceAgent:
    def __init__(self):
        self.last_cpu_percent = psutil.cpu_percent(interval=None)
        self.last_time = time.time()

    def analyze_system_latency(self):
        """
        Estimates system responsiveness using CPU % spikes.
        Works cross-platform (Windows & Linux).
        """
        cpu_percent = psutil.cpu_percent(interval=None)
        current_time = time.time()
        dt = current_time - self.last_time

        if dt <= 0:
            return {"status": "optimal", "score": 100}

        # Use CPU% variance from baseline as a latency indicator
        spike = max(0, cpu_percent - 50)  # spikes above 50% indicate load pressure
        score = max(0, min(100, 100 - spike))

        self.last_cpu_percent = cpu_percent
        self.last_time = current_time

        status = "optimal"
        if score < 70:
            status = "lag_spike_detected"
        elif score < 90:
            status = "minor_jitter"

        return {
            "status": status,
            "score": score,
            "cpu_percent": cpu_percent,
        }

    def detect_thermal_throttling(self, gpu_list):
        """
        Check if any GPU is nearing thermal limits (>85°C).
        gpu_list: list of dicts with 'id', 'name', 'temperature' keys
        """
        for gpu in gpu_list:
            temp = gpu.get('temperature', 0)
            if temp > 85:
                return True, f"GPU {gpu.get('id', '?')} ({gpu.get('name', 'GPU')}) thermal throttling at {temp:.0f}°C"
        return False, "Thermals optimal"
