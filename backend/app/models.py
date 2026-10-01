from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class SurvivorAsset(BaseModel):
    id: Optional[str] = None
    name: str
    type: str  # e.g., 'Authentication', 'Middleware', 'Database Schema', 'UI Component', 'Service'
    reusability_reason: str
    file_location: str
    dependencies: List[str] = []
    suggested_reuse: str

class CauseWithEvidence(BaseModel):
    cause: str
    evidence: List[str]

class DNAMetrics(BaseModel):
    frontend: int = 50
    backend: int = 50
    database: int = 50
    ai_ml: int = 20
    authentication: int = 40
    apis: int = 50
    testing: int = 20
    documentation: int = 40
    deployment: int = 20

class TechDNAShare(BaseModel):
    tech: str
    percentage: int

class AutopsyResult(BaseModel):
    status_category: str  # Active, Dormant, Abandoned
    likely_causes: List[CauseWithEvidence]
    dna_metrics: DNAMetrics
    tech_dna: List[TechDNAShare]
    survivors: List[SurvivorAsset]

class ProjectOverview(BaseModel):
    id: str
    name: str
    description: str
    tech_stack: List[str]
    last_activity: str
    completion_pct: int
    status: str
    health_score: int
    file_count: int
    line_count: int
    todo_count: int
    test_count: int
    created_at: Optional[str] = None
    is_demo: bool = False

class ResurrectionRequest(BaseModel):
    project_id: str
    mode: str  # 'continue', 'convert', 'extract', 'portfolio', 'hackathon'
    target_goal: Optional[str] = ""

class ResurrectionPlan(BaseModel):
    id: Optional[str] = None
    project_id: str
    resurrection_mode: str
    new_project_name: str
    tagline: str
    components_to_keep: List[str]
    components_to_modify: List[str]
    components_to_remove: List[str]
    new_components_required: List[str]
    suggested_architecture: str
    implementation_steps: List[str]
    before_after_mapping: Dict[str, str]

class FrankensteinRequest(BaseModel):
    project_ids: List[str]

class FrankensteinFusion(BaseModel):
    id: Optional[str] = None
    parent_project_names: List[str]
    fusion_name: str
    tagline: str
    concept: str
    why_fits: str
    architecture: str
    reused_components: List[Dict[str, str]] # project_name -> component
    new_components_required: List[str]
    technical_challenges: List[str]
    dna_breakdown: List[Dict[str, Any]]

class GhostChatRequest(BaseModel):
    message: Optional[str] = "Why did this project die?"
    chat_history: Optional[List[Dict[str, str]]] = []


