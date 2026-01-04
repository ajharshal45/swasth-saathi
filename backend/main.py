from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import uuid
from datetime import datetime, timedelta
import json

app = FastAPI(title="Swasth Saathi API", version="1.0.0")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
def get_db():
    conn = sqlite3.connect('swasth_saathi.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS cases (
            id TEXT PRIMARY KEY,
            symptoms TEXT,
            follow_up TEXT,
            age_group TEXT,
            duration TEXT,
            severity TEXT,
            conditions TEXT,
            medicine TEXT,
            risk_level TEXT,
            reasoning_en TEXT,
            reasoning_hi TEXT,
            mode TEXT,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            validated BOOLEAN DEFAULT FALSE,
            validated_at TIMESTAMP,
            doctor_comment TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Pydantic models
class CaseSubmit(BaseModel):
    symptoms: List[str]
    followUp: Optional[dict] = {}
    ageGroup: str
    duration: str
    severity: str
    conditions: str
    medicine: str
    riskLevel: str
    reasoningEn: str
    reasoningHi: str
    mode: str = "online"

class CaseValidate(BaseModel):
    comment: Optional[str] = ""

class CaseResponse(BaseModel):
    id: str
    symptoms: List[str]
    followUp: dict
    ageGroup: str
    duration: str
    severity: str
    conditions: str
    medicine: str
    riskLevel: str
    reasoningEn: str
    reasoningHi: str
    mode: str
    submittedAt: str
    validated: bool
    validatedAt: Optional[str]
    doctorComment: Optional[str]

# Submit case
@app.post("/api/cases")
async def submit_case(case: CaseSubmit):
    case_id = f"CASE-{str(uuid.uuid4())[:8].upper()}"
    conn = get_db()
    conn.execute('''
        INSERT INTO cases (id, symptoms, follow_up, age_group, duration, severity, 
                          conditions, medicine, risk_level, reasoning_en, reasoning_hi, mode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        case_id,
        json.dumps(case.symptoms),
        json.dumps(case.followUp),
        case.ageGroup,
        case.duration,
        case.severity,
        case.conditions,
        case.medicine,
        case.riskLevel,
        case.reasoningEn,
        case.reasoningHi,
        case.mode
    ))
    conn.commit()
    conn.close()
    return {"id": case_id, "status": "saved", "timestamp": datetime.now().isoformat()}

# Get cases
@app.get("/api/cases")
async def get_cases(status: str = "all"):
    conn = get_db()
    if status == "pending":
        rows = conn.execute("SELECT * FROM cases WHERE validated = FALSE ORDER BY submitted_at DESC").fetchall()
    elif status == "validated":
        rows = conn.execute("SELECT * FROM cases WHERE validated = TRUE ORDER BY validated_at DESC").fetchall()
    else:
        rows = conn.execute("SELECT * FROM cases ORDER BY submitted_at DESC").fetchall()
    conn.close()
    
    cases = []
    for row in rows:
        cases.append({
            "id": row["id"],
            "symptoms": json.loads(row["symptoms"]),
            "followUp": json.loads(row["follow_up"]) if row["follow_up"] else {},
            "ageGroup": row["age_group"],
            "duration": row["duration"],
            "severity": row["severity"],
            "conditions": row["conditions"],
            "medicine": row["medicine"],
            "riskLevel": row["risk_level"],
            "reasoningEn": row["reasoning_en"],
            "reasoningHi": row["reasoning_hi"],
            "mode": row["mode"],
            "submittedAt": row["submitted_at"],
            "validated": bool(row["validated"]),
            "validatedAt": row["validated_at"],
            "doctorComment": row["doctor_comment"]
        })
    return cases

# Validate case
@app.put("/api/cases/{case_id}/validate")
async def validate_case(case_id: str, data: CaseValidate):
    conn = get_db()
    conn.execute('''
        UPDATE cases SET validated = TRUE, validated_at = ?, doctor_comment = ?
        WHERE id = ?
    ''', (datetime.now().isoformat(), data.comment, case_id))
    conn.commit()
    conn.close()
    return {"id": case_id, "validated": True, "validatedAt": datetime.now().isoformat()}

# Epidemic data
@app.get("/api/epidemic")
async def get_epidemic_data(days: int = 7):
    conn = get_db()
    cutoff = (datetime.now() - timedelta(days=days)).isoformat()
    previous_cutoff = (datetime.now() - timedelta(days=days*2)).isoformat()
    
    # Current period
    rows = conn.execute("SELECT symptoms FROM cases WHERE submitted_at >= ?", (cutoff,)).fetchall()
    current_counts = {}
    for row in rows:
        for symptom in json.loads(row["symptoms"]):
            current_counts[symptom] = current_counts.get(symptom, 0) + 1
    
    # Previous period
    rows = conn.execute("SELECT symptoms FROM cases WHERE submitted_at >= ? AND submitted_at < ?", 
                       (previous_cutoff, cutoff)).fetchall()
    previous_counts = {}
    for row in rows:
        for symptom in json.loads(row["symptoms"]):
            previous_counts[symptom] = previous_counts.get(symptom, 0) + 1
    
    conn.close()
    
    # Calculate trends
    symptoms = []
    for symptom, count in sorted(current_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
        prev = previous_counts.get(symptom, 0)
        change = ((count - prev) / max(prev, 1)) * 100
        trend = "up" if change > 5 else ("down" if change < -5 else "stable")
        symptoms.append({
            "id": symptom,
            "count": count,
            "previousCount": prev,
            "trend": trend,
            "changePercent": round(change, 1)
        })
    
    return {"symptoms": symptoms, "periodDays": days}

# Health check
@app.get("/api/health")
async def health_check():
    conn = get_db()
    count = conn.execute("SELECT COUNT(*) FROM cases").fetchone()[0]
    conn.close()
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "caseCount": count,
        "version": "1.0.0"
    }
