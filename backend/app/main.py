import json
import uuid
import os
from pathlib import Path
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import init_db, get_db
from app.seed_data import seed_demo_data
from app.analyzer import scan_zip_archive
from app.ai_service import generate_ai_autopsy, generate_ai_resurrection_plan, generate_frankenstein_fusion
from app.models import (
    ResurrectionRequest, FrankensteinRequest, ProjectOverview
)

app = FastAPI(
    title="Project Cemetery API",
    description="AI-Powered Platform to Autopsy and Resurrect Abandoned Software Projects",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()
    seed_demo_data()

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Project Cemetery API"}

@app.get("/api/projects")
def list_projects():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, name, description, tech_stack, last_activity, completion_pct, status, health_score, 
           file_count, line_count, todo_count, test_count, is_demo, created_at
    FROM projects ORDER BY created_at DESC
    """)
    rows = cursor.fetchall()
    
    projects = []
    for r in rows:
        p_dict = dict(r)
        p_dict["tech_stack"] = json.loads(p_dict["tech_stack"]) if p_dict["tech_stack"] else []
        p_dict["is_demo"] = bool(p_dict["is_demo"])
        
        # Get survivor count for card
        cursor.execute("SELECT COUNT(*) FROM survivors WHERE project_id = ?", (p_dict["id"],))
        p_dict["survivor_count"] = cursor.fetchone()[0]
        projects.append(p_dict)

    conn.close()
    return {"projects": projects}

@app.get("/api/projects/{project_id}")
def get_project_details(project_id: str):
    conn = get_db()
    cursor = conn.cursor()
    
    # Project
    cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
    p_row = cursor.fetchone()
    if not p_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Project not found in Cemetery")
        
    project = dict(p_row)
    project["tech_stack"] = json.loads(project["tech_stack"]) if project["tech_stack"] else []
    project["summary_json"] = json.loads(project["summary_json"]) if project.get("summary_json") else {}

    # Autopsy
    cursor.execute("SELECT * FROM autopsies WHERE project_id = ?", (project_id,))
    a_row = cursor.fetchone()
    autopsy = None
    if a_row:
        autopsy = dict(a_row)
        autopsy["likely_causes"] = json.loads(autopsy["likely_causes_json"]) if autopsy["likely_causes_json"] else []
        autopsy["dna_metrics"] = json.loads(autopsy["dna_metrics_json"]) if autopsy["dna_metrics_json"] else {}
        autopsy["tech_dna"] = json.loads(autopsy["tech_dna_json"]) if autopsy["tech_dna_json"] else []
        autopsy["commit_history"] = json.loads(autopsy["commit_history_json"]) if autopsy.get("commit_history_json") else []

    # Survivors
    cursor.execute("SELECT * FROM survivors WHERE project_id = ?", (project_id,))
    s_rows = cursor.fetchall()
    survivors = []
    for s in s_rows:
        sd = dict(s)
        sd["dependencies"] = json.loads(sd["dependencies"]) if sd["dependencies"] else []
        survivors.append(sd)

    # Resurrections
    cursor.execute("SELECT * FROM resurrections WHERE project_id = ? ORDER BY created_at DESC", (project_id,))
    r_rows = cursor.fetchall()
    resurrections = []
    for r in r_rows:
        rd = dict(r)
        rd["components_to_keep"] = json.loads(rd["components_to_keep"]) if rd["components_to_keep"] else []
        rd["components_to_modify"] = json.loads(rd["components_to_modify"]) if rd["components_to_modify"] else []
        rd["components_to_remove"] = json.loads(rd["components_to_remove"]) if rd["components_to_remove"] else []
        rd["new_components_required"] = json.loads(rd["new_components_required"]) if rd["new_components_required"] else []
        rd["implementation_steps"] = json.loads(rd["implementation_steps"]) if rd["implementation_steps"] else []
        resurrections.append(rd)

    conn.close()
    return {
        "project": project,
        "autopsy": autopsy,
        "survivors": survivors,
        "resurrections": resurrections
    }

@app.get("/api/projects/{project_id}/export-survivors")
def export_survivor_bundle(project_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
    p_row = cursor.fetchone()
    if not p_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Project not found")

    project = dict(p_row)
    project["tech_stack"] = json.loads(project["tech_stack"]) if project["tech_stack"] else []

    cursor.execute("SELECT * FROM survivors WHERE project_id = ?", (project_id,))
    surv_rows = cursor.fetchall()
    survivors = []
    for s in surv_rows:
        sd = dict(s)
        sd["dependencies"] = json.loads(sd["dependencies"]) if sd["dependencies"] else []
        survivors.append(sd)

    conn.close()

    bundle = {
        "cemetery_manifest_version": "1.0.0",
        "project_name": project["name"],
        "status": project["status"],
        "health_score": project["health_score"],
        "exported_at": "2026-10-01",
        "surviving_assets_count": len(survivors),
        "surviving_assets": survivors,
        "scaffold_instructions": [
            "1. Extract surviving files into your new project root.",
            "2. Install specified dependencies in package.json or requirements.txt.",
            "3. Import survivors into your application framework."
        ]
    }

    content_disposition = f'attachment; filename="{project["name"].replace(" ", "_")}_survivors_bundle.json"'
    return JSONResponse(content=bundle, headers={"Content-Disposition": content_disposition})


@app.post("/api/upload")
async def upload_project_zip(file: UploadFile = File(...)):
    if not file.filename.endswith('.zip'):
        raise HTTPException(status_code=400, detail="Only .zip files are accepted")
        
    contents = await file.read()
    if len(contents) > 50 * 1024 * 1024: # 50MB limit
        raise HTTPException(status_code=400, detail="ZIP file exceeds max size limit of 50MB")

    # Step 1: Scan ZIP archive & extract repository metrics
    summary = scan_zip_archive(contents, file.filename)
    
    # Step 2: Run AI Autopsy (Gemini API or deterministic evidence fallback)
    autopsy_data = generate_ai_autopsy(summary)

    # Step 3: Save into SQLite Database
    project_id = f"proj_{uuid.uuid4().hex[:10]}"
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO projects (id, name, description, tech_stack, last_activity, completion_pct, status, health_score, file_count, line_count, todo_count, test_count, is_demo, summary_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        project_id,
        summary["name"],
        f"Uploaded project containing {summary['file_count']} files and ~{summary['line_count']} lines of code.",
        json.dumps(summary["tech_stack"]),
        "Recently uploaded",
        summary["completion_pct"],
        summary["status"],
        summary["health_score"],
        summary["file_count"],
        summary["line_count"],
        summary["todo_count"],
        summary["test_count"],
        0,
        json.dumps(summary)
    ))

    # Save Autopsy
    cursor.execute("""
    INSERT INTO autopsies (id, project_id, status_category, likely_causes_json, evidence_json, dna_metrics_json, tech_dna_json)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        f"autopsy_{project_id}",
        project_id,
        autopsy_data.get("status_category", "Abandoned"),
        json.dumps(autopsy_data.get("likely_causes", [])),
        json.dumps(summary.get("missing_endpoints", [])),
        json.dumps(autopsy_data.get("dna_metrics", {})),
        json.dumps(autopsy_data.get("tech_dna", []))
    ))

    # Save Survivors
    for surv in autopsy_data.get("survivors", []):
        surv_id = f"surv_{uuid.uuid4().hex[:8]}"
        cursor.execute("""
        INSERT INTO survivors (id, project_id, name, type, reusability_reason, file_location, dependencies, suggested_reuse)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            surv_id,
            project_id,
            surv["name"],
            surv["type"],
            surv["reusability_reason"],
            surv["file_location"],
            json.dumps(surv.get("dependencies", [])),
            surv.get("suggested_reuse", "")
        ))

    conn.commit()
    conn.close()

    return {
        "status": "success",
        "project_id": project_id,
        "summary": summary,
        "autopsy": autopsy_data
    }

@app.post("/api/resurrect")
def resurrect_project(payload: ResurrectionRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM projects WHERE id = ?", (payload.project_id,))
    p_row = cursor.fetchone()
    if not p_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Project not found")

    project = dict(p_row)
    project["tech_stack"] = json.loads(project["tech_stack"]) if project["tech_stack"] else []

    # Generate plan using AI or fallback
    plan = generate_ai_resurrection_plan(project, payload.mode, payload.target_goal)

    res_id = f"res_{uuid.uuid4().hex[:8]}"
    cursor.execute("""
    INSERT INTO resurrections (id, project_id, resurrection_mode, user_prompt, new_project_name, components_to_keep, components_to_modify, components_to_remove, new_components_required, suggested_architecture, implementation_steps)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        res_id,
        payload.project_id,
        payload.mode,
        payload.target_goal,
        plan.get("new_project_name", "Resurrected App"),
        json.dumps(plan.get("components_to_keep", [])),
        json.dumps(plan.get("components_to_modify", [])),
        json.dumps(plan.get("components_to_remove", [])),
        json.dumps(plan.get("new_components_required", [])),
        plan.get("suggested_architecture", ""),
        json.dumps(plan.get("implementation_steps", []))
    ))

    conn.commit()
    conn.close()
    
    plan["id"] = res_id
    plan["project_id"] = payload.project_id
    return {"status": "success", "plan": plan}

@app.post("/api/frankenstein")
def create_frankenstein(payload: FrankensteinRequest):
    if len(payload.project_ids) < 2 or len(payload.project_ids) > 4:
        raise HTTPException(status_code=400, detail="Frankenstein Mode requires selecting between 2 and 4 projects.")

    conn = get_db()
    cursor = conn.cursor()
    
    projects = []
    for pid in payload.project_ids:
        cursor.execute("SELECT * FROM projects WHERE id = ?", (pid,))
        r = cursor.fetchone()
        if r:
            pd = dict(r)
            pd["tech_stack"] = json.loads(pd["tech_stack"]) if pd["tech_stack"] else []
            
            # Fetch survivors for project
            cursor.execute("SELECT name, type FROM survivors WHERE project_id = ?", (pid,))
            survs = [f"{s['name']} ({s['type']})" for s in cursor.fetchall()]
            pd["survivors_summary"] = ", ".join(survs)
            projects.append(pd)

    if len(projects) < 2:
        conn.close()
        raise HTTPException(status_code=404, detail="Could not find specified projects for Frankenstein fusion.")

    # Call AI Frankenstein fusion
    fusion = generate_frankenstein_fusion(projects)

    frank_id = f"frank_{uuid.uuid4().hex[:8]}"
    cursor.execute("""
    INSERT INTO frankensteins (id, parent_project_ids, fusion_name, tagline, concept, why_fits, architecture, new_components, reused_components, technical_challenges, dna_breakdown)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        frank_id,
        json.dumps(payload.project_ids),
        fusion.get("fusion_name", "Frankenstein Hybrid"),
        fusion.get("tagline", ""),
        fusion.get("concept", ""),
        fusion.get("why_fits", ""),
        fusion.get("architecture", ""),
        json.dumps(fusion.get("new_components_required", [])),
        json.dumps(fusion.get("reused_components", [])),
        json.dumps(fusion.get("technical_challenges", [])),
        json.dumps(fusion.get("dna_breakdown", []))
    ))

    conn.commit()
    conn.close()
    
    fusion["id"] = frank_id
    return {"status": "success", "fusion": fusion}

@app.post("/api/reset-demo")
def reset_demo():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM projects")
    cursor.execute("DELETE FROM autopsies")
    cursor.execute("DELETE FROM survivors")
    cursor.execute("DELETE FROM resurrections")
    cursor.execute("DELETE FROM frankensteins")
    conn.commit()
    conn.close()

    seed_demo_data()
    return {"status": "success", "message": "Cemetery reset to demo state."}

from app.models import (
    ResurrectionRequest, FrankensteinRequest, ProjectOverview, GhostChatRequest
)

@app.delete("/api/projects/{project_id}")
def delete_project(project_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM projects WHERE id = ?", (project_id,))
    cursor.execute("DELETE FROM autopsies WHERE project_id = ?", (project_id,))
    cursor.execute("DELETE FROM survivors WHERE project_id = ?", (project_id,))
    cursor.execute("DELETE FROM resurrections WHERE project_id = ?", (project_id,))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Project removed from cemetery"}

@app.post("/api/projects/{project_id}/ghost-chat")
def ghost_chat(project_id: str, payload: GhostChatRequest = Body(default_factory=GhostChatRequest)):
    user_msg = payload.message or "Why did this project die?"
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
    p_row = cursor.fetchone()
    if not p_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Project not found")

    project = dict(p_row)
    project["tech_stack"] = json.loads(project["tech_stack"]) if project["tech_stack"] else []

    cursor.execute("SELECT * FROM autopsies WHERE project_id = ?", (project_id,))
    a_row = cursor.fetchone()
    autopsy = dict(a_row) if a_row else {}
    if autopsy:
        autopsy["likely_causes"] = json.loads(autopsy["likely_causes_json"]) if autopsy.get("likely_causes_json") else []

    cursor.execute("SELECT name, type FROM survivors WHERE project_id = ?", (project_id,))
    survivors = [dict(s) for s in cursor.fetchall()]
    conn.close()

    project_data = {
        **project,
        "autopsy": autopsy,
        "survivors": survivors
    }

    from app.ai_service import generate_ghost_chat_response
    reply = generate_ghost_chat_response(project_data, user_msg, payload.chat_history or [])
    return {"status": "success", "reply": reply}

@app.api_route("/api/projects/{project_id}/generate-pitch", methods=["GET", "POST"])
def generate_pitch(project_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
    p_row = cursor.fetchone()
    if not p_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Project not found")

    project = dict(p_row)
    project["tech_stack"] = json.loads(project["tech_stack"]) if project["tech_stack"] else []

    cursor.execute("SELECT * FROM resurrections WHERE project_id = ? ORDER BY created_at DESC LIMIT 1", (project_id,))
    r_row = cursor.fetchone()
    plan = dict(r_row) if r_row else None

    conn.close()

    from app.ai_service import generate_hackathon_pitch
    pitch = generate_hackathon_pitch(project, plan)
    return {"status": "success", "pitch": pitch}


