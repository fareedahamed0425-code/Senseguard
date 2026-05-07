from sqlmodel import SQLModel, Field, create_all
from typing import Optional
from datetime import datetime

class Session(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = None
    avg_api_score: float = 0.0
    game_detected: Optional[str] = None

class TelemetryRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    cpu_usage: float
    ram_usage: float
    gpu_load: float
    api_score: float

class SensitivityEvent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    event_type: str # 'drift', 'correction', 'overshoot'
    description: str

class ReviewRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: int
    summary_json: str # Store the structured AI summary as JSON
    created_at: datetime = Field(default_factory=datetime.utcnow)
