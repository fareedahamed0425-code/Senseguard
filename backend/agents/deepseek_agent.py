import os
import json
import logging
import aiohttp
from typing import List, Dict, Any

logger = logging.getLogger("SenseGuard.DeepSeek")

class DeepSeekAgent:
    def __init__(self, endpoint="http://localhost:8000/v1"):
        self.endpoint = endpoint
        self.model = "deepseek-ai/DeepSeek-V4-Pro"
        
    async def analyze_live_data(self, system_data: Dict[str, Any], mouse_data: Dict[str, Any]) -> str:
        """
        Sends live telemetry to DeepSeek for tactical analysis.
        """
        prompt = self._build_analysis_prompt(system_data, mouse_data)
        
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": "You are SenseGuard AI, a high-performance gaming tactical assistant. Analyze the following live telemetry and provide a concise, elite-level tactical insight (1-2 sentences). Focus on stability, system bottlenecks, and performance optimization."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 100
                }
                
                async with session.post(f"{self.endpoint}/chat/completions", json=payload, timeout=5) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result['choices'][0]['message']['content'].strip()
                    else:
                        logger.error(f"DeepSeek API error: {response.status}")
                        return "DeepSeek Engine Offline: Check vLLM Server"
        except Exception as e:
            logger.error(f"Failed to connect to vLLM: {e}")
            return "DeepSeek Connection Timeout: Ensure vLLM is serving on port 8000"

    def _build_analysis_prompt(self, system_data: Dict[str, Any], mouse_data: Dict[str, Any]) -> str:
        cpu = system_data.get("cpu_usage", 0)
        ram = system_data.get("ram_usage", 0)
        gpu_load = system_data.get("gpus", [{}])[0].get("load", 0)
        api_score = mouse_data.get("api_score", 0)
        instability = mouse_data.get("instability", 0)
        
        return (
            f"SYSTEM TELEMETRY:\n"
            f"- CPU Load: {cpu:.1f}%\n"
            f"- RAM Usage: {ram:.1f}%\n"
            f"- GPU Load: {gpu_load:.1f}%\n"
            f"MOUSE DYNAMICS:\n"
            f"- API Precision: {api_score:.2f}%\n"
            f"- Movement Instability: {instability:.4f}\n"
            f"Provide a tactical recommendation."
        )
