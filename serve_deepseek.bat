@echo off
echo Starting SenseGuard DeepSeek-V4-Pro Analysis Engine...
echo Initializing vLLM Server on http://localhost:8000
echo This requires a high-performance GPU (NVIDIA 3090/4090 or better recommended).
echo.
vllm serve "deepseek-ai/DeepSeek-V4-Pro" --port 8000 --model-type "auto" --max-model-len 4096
pause
