import sqlite3
import os
import json
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "cemetery.db"

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Projects table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        tech_stack TEXT,
        last_activity TEXT,
        completion_pct INTEGER DEFAULT 50,
        status TEXT DEFAULT 'Abandoned',
        health_score INTEGER DEFAULT 60,
        file_count INTEGER DEFAULT 0,
        line_count INTEGER DEFAULT 0,
        todo_count INTEGER DEFAULT 0,
        test_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_demo BOOLEAN DEFAULT 0,
        summary_json TEXT
    );
    """)

    # Autopsies table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS autopsies (
        id TEXT PRIMARY KEY,
        project_id TEXT UNIQUE,
        status_category TEXT,
        likely_causes_json TEXT,
        evidence_json TEXT,
        dna_metrics_json TEXT,
        tech_dna_json TEXT,
        commit_history_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
    """)

    # Column migration check for existing databases
    cursor.execute("PRAGMA table_info(autopsies);")
    columns = [col[1] for col in cursor.fetchall()]
    if "commit_history_json" not in columns:
        cursor.execute("ALTER TABLE autopsies ADD COLUMN commit_history_json TEXT;")


    # Survivors table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS survivors (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        reusability_reason TEXT,
        file_location TEXT,
        dependencies TEXT,
        suggested_reuse TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
    """)

    # Resurrections table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS resurrections (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        resurrection_mode TEXT,
        user_prompt TEXT,
        new_project_name TEXT,
        components_to_keep TEXT,
        components_to_modify TEXT,
        components_to_remove TEXT,
        new_components_required TEXT,
        suggested_architecture TEXT,
        implementation_steps TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
    """)

    # Frankenstein fusions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS frankensteins (
        id TEXT PRIMARY KEY,
        parent_project_ids TEXT,
        fusion_name TEXT,
        tagline TEXT,
        concept TEXT,
        why_fits TEXT,
        architecture TEXT,
        new_components TEXT,
        reused_components TEXT,
        technical_challenges TEXT,
        dna_breakdown TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()
    conn.close()
