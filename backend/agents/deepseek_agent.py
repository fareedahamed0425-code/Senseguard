import os
import json
import logging
import aiohttp
from typing import List, Dict, Any

logger = logging.getLogger("SenseGuard.DeepSeek")

class DeepSeekAgent:
    def __init__(self, endpoint="http://localhost:8001/v1"):
        self.endpoint = endpoint
        self.model = "deepseek-ai/DeepSeek-V4-Pro"
        
    async def analyze_live_data(self, system_data: Dict[str, Any], mouse_data: Dict[str, Any]) -> str:
        """
        Sends live telemetry to DeepSeek for tactical analysis, help, and thoughts.
        """
        prompt = self._build_analysis_prompt(system_data, mouse_data)
        
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "model": self.model,
                    "messages": [
                        {
                            "role": "system", 
                            "content": (
                                "You are SenseGuard AI, an elite tactical gaming companion powered by DeepSeek-V4-Pro. "
                                "Your goal is to provide real-time, high-level analysis of gaming telemetry. "
                                "Provide detailed 'Thoughts' on the current state and specific 'Help' or 'Actions' the user should take. "
                                "Keep it technical, aggressive, and concise (max 3 sentences). "
                                "Format: [THOUGHTS] ... [HELP] ..."
                            )
                        },
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.8,
                    "max_tokens": 150
                }
                
                async with session.post(f"{self.endpoint}/chat/completions", json=payload, timeout=10) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result['choices'][0]['message']['content'].strip()
                    else:
                        logger.error(f"DeepSeek API error: {response.status}")
                        return "DeepSeek Engine Offline: Check vLLM Server on Port 8001"
        except Exception as e:
            logger.error(f"Failed to connect to vLLM: {e}")
            return "DeepSeek Connection Timeout: Ensure vLLM is serving on port 8001"

    def _build_analysis_prompt(self, system_data: Dict[str, Any], mouse_data: Dict[str, Any]) -> str:
        cpu = system_data.get("cpu_usage", 0)
        ram = system_data.get("ram_usage", 0)
        gpus = system_data.get("gpus", [])
        gpu_load = gpus[0].get("load", 0) if gpus else 0
        gpu_temp = gpus[0].get("temperature", 0) if gpus else 0
        
        api_score = mouse_data.get("api_score", 0)
        instability = mouse_data.get("instability", 0)
        velocity = mouse_data.get("velocity", 0)
        
        return (
            f"LATEST TELEMETRY SCAN:\n"
            f"- CPU: {cpu:.1f}% | RAM: {ram:.1f}% | GPU: {gpu_load:.1f}% @ {gpu_temp}°C\n"
            f"- Aim Precision (API): {api_score:.2f}%\n"
            f"- Aim Instability Index: {instability:.4f}\n"
            f"- Current Mouse Velocity: {velocity:.0f} px/s\n"
            f"\nAnalyze these metrics and provide tactical thoughts and actionable help."
        )
