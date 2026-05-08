import asyncio
import json
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from sensors.mouse_sensor import MouseSensor
from sensors.system_sensor import SystemSensor
from sensors.active_window_sensor import ActiveWindowSensor
from agents.sensitivity_agent import SensitivityAgent
from agents.system_agent import SystemAgent
from agents.performance_agent import PerformanceAgent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SenseGuard")

app = FastAPI(title="SenseGuard AI Core")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# State Management
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def introduce(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        dead_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                dead_connections.append(connection)
        for conn in dead_connections:
            self.disconnect(conn)

manager = ConnectionManager()
sensitivity_agent = SensitivityAgent()
system_agent = SystemAgent()
performance_agent = PerformanceAgent()

# Track current active window for REST polling
_current_active_window = {
    "type": "active_window",
    "window_title": "Desktop",
    "process_name": "explorer.exe",
    "display_name": "Desktop",
    "icon": "🖥️",
    "pid": 0,
    "is_game": False,
}

# Sensor Callbacks
def on_mouse_data(data):
    api_score = sensitivity_agent.process_mouse_event(data)
    data["api_score"] = api_score
    data["instability"] = sensitivity_agent.instability_score
    # Use thread-safe way to broadcast from callback
    if loop and loop.is_running():
        asyncio.run_coroutine_threadsafe(manager.broadcast(data), loop)

def on_system_data(data):
    perf_analysis = performance_agent.analyze_system_latency()
    data["perf_score"] = perf_analysis["score"]
    data["perf_status"] = perf_analysis["status"]
    
    throttling, msg = performance_agent.detect_thermal_throttling(data.get("gpus", []))
    data["thermal_throttling"] = throttling
    data["thermal_msg"] = msg
    
    if loop and loop.is_running():
        asyncio.run_coroutine_threadsafe(manager.broadcast(data), loop)

def on_active_window(data):
    global _current_active_window
    _current_active_window = data
    logger.info(f"Active window: [{data['process_name']}] {data['display_name']}")
    if loop and loop.is_running():
        asyncio.run_coroutine_threadsafe(manager.broadcast(data), loop)

# Initialize Sensors with Cloud Fallback
try:
    mouse_sensor = MouseSensor(callback=on_mouse_data)
    system_sensor = SystemSensor(callback=on_system_data, interval=2.0)
    active_window_sensor = ActiveWindowSensor(callback=on_active_window, interval=1.0)
    CLOUD_MODE = False
except Exception as e:
    logger.warning(f"Hardware sensors unavailable ({e}). Entering CLOUD MOCK MODE.")
    CLOUD_MODE = True

async def mock_sensor_loop():
    """Generates fake data when running in the cloud (Render/Vercel)"""
    import random
    while True:
        if CLOUD_MODE:
            # Mock System Data
            mock_sys = {
                "type": "system",
                "cpu_usage": random.uniform(10, 60),
                "ram_usage_pct": random.uniform(30, 70),
                "ram_used_gb": 8.5,
                "ram_total_gb": 16.0,
                "gpus": [{"name": "Cloud GPU", "load": random.uniform(0, 100), "temperature": random.uniform(40, 70)}]
            }
            on_system_data(mock_sys)
            await asyncio.sleep(2)
        else:
            await asyncio.sleep(10)

@app.on_event("startup")
async def startup_event():
    global loop
    loop = asyncio.get_running_loop()
    
    if not CLOUD_MODE:
        try:
            mouse_sensor.start()
            system_sensor.start()
            active_window_sensor.start()
            logger.info("SenseGuard Hardware Sensors Started")
        except Exception as e:
            logger.error(f"Failed to start hardware sensors: {e}")
    
    # Start the mock loop anyway as a heartbeat or fallback
    asyncio.create_task(mock_sensor_loop())
    logger.info(f"SenseGuard AI Core Started (Mode: {'Cloud' if CLOUD_MODE else 'Hardware'})")

@app.on_event("shutdown")
async def shutdown_event():
    if not CLOUD_MODE:
        try:
            mouse_sensor.stop()
            system_sensor.stop()
            active_window_sensor.stop()
        except:
            pass
    logger.info("SenseGuard Sensors Stopped")

@app.websocket("/ws/telemetry")
async def telemetry_websocket(websocket: WebSocket):
    await manager.introduce(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/action/optimize")
async def optimize():
    success, msg = system_agent.optimize_for_gaming()
    return {"success": success, "message": msg}

@app.get("/status")
async def get_status():
    return {
        "status": "running",
        "api_score": sensitivity_agent.api_score,
        "recommendation": sensitivity_agent.get_recommendation()
    }

@app.get("/status/active-window")
async def get_active_window():
    return _current_active_window

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
