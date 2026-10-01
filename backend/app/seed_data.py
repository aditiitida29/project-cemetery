import json
import uuid
from app.database import get_db

DEMO_PROJECTS = [
    {
        "id": "proj_campuschat",
        "name": "CampusChat",
        "description": "Student portal chat and real-time messaging application designed for university groups.",
        "tech_stack": ["React", "FastAPI", "PostgreSQL", "Tailwind CSS"],
        "last_activity": "11 months ago",
        "completion_pct": 63,
        "status": "Dormant",
        "health_score": 68,
        "file_count": 42,
        "line_count": 4280,
        "todo_count": 4,
        "test_count": 2,
        "is_demo": True,
        "autopsy": {
            "status_category": "Dormant",
            "likely_causes": [
                {
                    "cause": "Incomplete Backend API Integration",
                    "evidence": [
                        "6 frontend API fetch calls in 'src/api/chat.js' target missing endpoints",
                        "4 TODO comments found in 'backend/routes/messages.py'",
                        "Backend contains only 3 of 8 planned route handlers completed"
                    ]
                },
                {
                    "cause": "Deployment Configuration Deficit",
                    "evidence": [
                        "No docker-compose.yml or cloud deployment manifest present",
                        "Database connection strings are hardcoded to localhost:5432"
                    ]
                }
            ],
            "dna_metrics": {
                "frontend": 85,
                "backend": 60,
                "database": 75,
                "ai_ml": 10,
                "authentication": 80,
                "apis": 55,
                "testing": 30,
                "documentation": 50,
                "deployment": 15
            },
            "tech_dna": [
                {"tech": "React JS", "percentage": 45},
                {"tech": "Python / FastAPI", "percentage": 35},
                {"tech": "SQL Schema", "percentage": 20}
            ],
            "commit_history": [
                {"month": "Nov 2024", "commits": 25, "status": "Active"},
                {"month": "Dec 2024", "commits": 68, "status": "Active"},
                {"month": "Jan 2025", "commits": 115, "status": "Peak Velocity"},
                {"month": "Feb 2025", "commits": 84, "status": "Slowing"},
                {"month": "Mar 2025", "commits": 22, "status": "Critical"},
                {"month": "Apr 2025 (Dormant)", "commits": 0, "status": "Dormant / Abandoned"},
                {"month": "May 2025", "commits": 0, "status": "Dead"},
                {"month": "Jun 2025", "commits": 0, "status": "Dead"},
                {"month": "Jul 2025", "commits": 0, "status": "Dead"},
                {"month": "Aug 2025", "commits": 0, "status": "Dead"},
                {"month": "Sep 2025", "commits": 0, "status": "Dead"},
                {"month": "Oct 2025", "commits": 0, "status": "Dead"}
            ],
            "survivors": [
                {
                    "id": "surv_cc_1",
                    "name": "JWT Authentication System",
                    "type": "Authentication",
                    "reusability_reason": "Authentication middleware is fully decoupled from chat features and handles bcrypt hashing, token validation, and refresh rotators cleanly.",
                    "file_location": "backend/app/auth/jwt_handler.py",
                    "dependencies": ["python-jose", "passlib"],
                    "suggested_reuse": "Can be dropped directly into any FastAPI backend requiring secure JWT bearer token auth."
                },
                {
                    "id": "surv_cc_2",
                    "name": "React Real-Time Chat UI Component",
                    "type": "UI Component",
                    "reusability_reason": "Message bubble rendering, auto-scrolling container, and avatar badges are written cleanly in React + Tailwind CSS.",
                    "file_location": "src/components/chat/ChatBox.jsx",
                    "dependencies": ["Lucide React", "Tailwind CSS"],
                    "suggested_reuse": "Reuse for customer support widgets, team collaboration tools, or AI assistant interfaces."
                },
                {
                    "id": "surv_cc_3",
                    "name": "Normalized Messaging Database Schema",
                    "type": "Database Schema",
                    "reusability_reason": "Relational schema for Users, Channels, DirectMessages, and Attachments is fully modeled with foreign key constraints.",
                    "file_location": "backend/models/schema.sql",
                    "dependencies": ["PostgreSQL / SQLite"],
                    "suggested_reuse": "Instant blueprint for social, notification, or messaging relational DB setups."
                }
            ]
        }
    },
    {
        "id": "proj_weatherapp",
        "name": "WeatherApp",
        "description": "Lightweight client dashboard fetching real-time weather forecasts and climate metrics.",
        "tech_stack": ["JavaScript", "OpenWeather API", "CSS3", "HTML5"],
        "last_activity": "7 months ago",
        "completion_pct": 41,
        "status": "Abandoned",
        "health_score": 45,
        "file_count": 18,
        "line_count": 1420,
        "todo_count": 7,
        "test_count": 0,
        "is_demo": True,
        "autopsy": {
            "status_category": "Abandoned",
            "likely_causes": [
                {
                    "cause": "Hardcoded API Credentials & Unhandled Rate Limits",
                    "evidence": [
                        "OpenWeather API key hardcoded directly in public JS file 'src/weather.js'",
                        "0 HTTP rate limit handling or error boundaries for 429 quota exceptions"
                    ]
                },
                {
                    "cause": "Zero Test Coverage & Abandoned UI States",
                    "evidence": [
                        "0 automated test files found",
                        "7 TODO markers in weather widget layout code"
                    ]
                }
            ],
            "dna_metrics": {
                "frontend": 65,
                "backend": 15,
                "database": 10,
                "ai_ml": 0,
                "authentication": 0,
                "apis": 70,
                "testing": 0,
                "documentation": 30,
                "deployment": 10
            },
            "tech_dna": [
                {"tech": "JavaScript", "percentage": 70},
                {"tech": "HTML/CSS", "percentage": 30}
            ],
            "commit_history": [
                {"month": "Jan 2025", "commits": 40, "status": "Active"},
                {"month": "Feb 2025", "commits": 78, "status": "Peak Velocity"},
                {"month": "Mar 2025 (Abandoned)", "commits": 5, "status": "API Key Exposed & Abandoned"},
                {"month": "Apr 2025", "commits": 0, "status": "Dead"},
                {"month": "May 2025", "commits": 0, "status": "Dead"},
                {"month": "Jun 2025", "commits": 0, "status": "Dead"},
                {"month": "Jul 2025", "commits": 0, "status": "Dead"},
                {"month": "Aug 2025", "commits": 0, "status": "Dead"},
                {"month": "Sep 2025", "commits": 0, "status": "Dead"},
                {"month": "Oct 2025", "commits": 0, "status": "Dead"}
            ],
            "survivors": [
                {
                    "id": "surv_wa_1",
                    "name": "OpenWeather API Fetch Client",
                    "type": "Service",
                    "reusability_reason": "Clean async fetch wrapper mapping weather codes to standard weather conditions and temperatures.",
                    "file_location": "src/services/weatherClient.js",
                    "dependencies": ["Fetch API"],
                    "suggested_reuse": "Integrate into travel apps, dashboard widgets, or smart home displays."
                },
                {
                    "id": "surv_wa_2",
                    "name": "Geolocation & City Search Parser",
                    "type": "API",
                    "reusability_reason": "Handles browser navigator.geolocation and fallback zip/city geocoding seamlessly.",
                    "file_location": "src/utils/geoParser.js",
                    "dependencies": ["Browser Location API"],
                    "suggested_reuse": "Use whenever location auto-detection is needed in web applications."
                }
            ]
        }
    },
    {
        "id": "proj_routeplanner",
        "name": "RoutePlanner",
        "description": "Interactive campus navigation and shortest path generator for students.",
        "tech_stack": ["Python", "Leaflet.js", "SQLite", "Flask"],
        "last_activity": "14 months ago",
        "completion_pct": 78,
        "status": "Dormant",
        "health_score": 74,
        "file_count": 35,
        "line_count": 3890,
        "todo_count": 2,
        "test_count": 5,
        "is_demo": True,
        "autopsy": {
            "status_category": "Dormant",
            "likely_causes": [
                {
                    "cause": "Routing Algorithm Performance Bottleneck",
                    "evidence": [
                        "Dijkstra graph calculation blocks single-threaded Flask event loop on graph sizes > 500 nodes",
                        "2 TODOs in 'graph/pathfinder.py' note need for A* heuristic optimization"
                    ]
                }
            ],
            "dna_metrics": {
                "frontend": 70,
                "backend": 80,
                "database": 75,
                "ai_ml": 35,
                "authentication": 40,
                "apis": 75,
                "testing": 60,
                "documentation": 65,
                "deployment": 30
            },
            "tech_dna": [
                {"tech": "Python", "percentage": 50},
                {"tech": "JavaScript / Leaflet", "percentage": 35},
                {"tech": "SQL", "percentage": 15}
            ],
            "commit_history": [
                {"month": "Jul 2024", "commits": 30, "status": "Active"},
                {"month": "Aug 2024", "commits": 92, "status": "Peak Velocity"},
                {"month": "Sep 2024 (Dormant)", "commits": 8, "status": "Algorithm Bottleneck / Dormant"},
                {"month": "Oct 2024", "commits": 0, "status": "Dead"},
                {"month": "Nov 2024", "commits": 0, "status": "Dead"},
                {"month": "Dec 2024", "commits": 0, "status": "Dead"},
                {"month": "Jan 2025", "commits": 0, "status": "Dead"},
                {"month": "Feb 2025", "commits": 0, "status": "Dead"},
                {"month": "Mar 2025", "commits": 0, "status": "Dead"},
                {"month": "Apr 2025", "commits": 0, "status": "Dead"}
            ],
            "survivors": [
                {
                    "id": "surv_rp_1",
                    "name": "Dijkstra & A* Pathfinder Engine",
                    "type": "Service",
                    "reusability_reason": "High-efficiency graph path calculation engine with weighted node distance evaluation.",
                    "file_location": "backend/algorithms/pathfinder.py",
                    "dependencies": ["Python standard library"],
                    "suggested_reuse": "Reuse for logistics routing, game AI pathfinding, or delivery optimization apps."
                },
                {
                    "id": "surv_rp_2",
                    "name": "Interactive Leaflet Map Canvas Component",
                    "type": "UI Component",
                    "reusability_reason": "Handles custom map tiles, waypoint markers, polyline drawing, and zoom controls.",
                    "file_location": "static/js/map_view.js",
                    "dependencies": ["Leaflet.js"],
                    "suggested_reuse": "Embed into real estate listings, fleet tracking, or event mapping dashboards."
                }
            ]
        }
    },
    {
        "id": "proj_devpulse",
        "name": "DevPulse",
        "description": "High-frequency metric monitor and alert notification service.",
        "tech_stack": ["Node.js", "WebSockets", "Redis", "React"],
        "last_activity": "5 months ago",
        "completion_pct": 85,
        "status": "Abandoned",
        "health_score": 82,
        "file_count": 56,
        "line_count": 6120,
        "todo_count": 5,
        "test_count": 1,
        "is_demo": True,
        "autopsy": {
            "status_category": "Abandoned",
            "likely_causes": [
                {
                    "cause": "WebSocket Concurrency Memory Leak & Missing Auth Integration",
                    "evidence": [
                        "WebSocket event listener listeners leak connection handles in 'server/ws.js'",
                        "No auth token validation check on socket handshake"
                    ]
                }
            ],
            "dna_metrics": {
                "frontend": 80,
                "backend": 90,
                "database": 60,
                "ai_ml": 10,
                "authentication": 25,
                "apis": 85,
                "testing": 15,
                "documentation": 45,
                "deployment": 40
            },
            "tech_dna": [
                {"tech": "Node.js / Express", "percentage": 50},
                {"tech": "React TS", "percentage": 30},
                {"tech": "Redis / WS", "percentage": 20}
            ],
            "commit_history": [
                {"month": "Mar 2025", "commits": 45, "status": "Active"},
                {"month": "Apr 2025", "commits": 135, "status": "Peak Velocity"},
                {"month": "May 2025 (Abandoned)", "commits": 12, "status": "WS Memory Leak / Abandoned"},
                {"month": "Jun 2025", "commits": 0, "status": "Dead"},
                {"month": "Jul 2025", "commits": 0, "status": "Dead"},
                {"month": "Aug 2025", "commits": 0, "status": "Dead"},
                {"month": "Sep 2025", "commits": 0, "status": "Dead"},
                {"month": "Oct 2025", "commits": 0, "status": "Dead"}
            ],
            "survivors": [
                {
                    "id": "surv_dp_1",
                    "name": "WebSocket Pub/Sub Broadcast Gateway",
                    "type": "Service",
                    "reusability_reason": "High throughput WebSocket engine for streaming metric payloads to client subscribers.",
                    "file_location": "server/sockets/gateway.js",
                    "dependencies": ["ws", "ioredis"],
                    "suggested_reuse": "Reuse for live telemetry, crypto price trackers, or gaming leaderboards."
                },
                {
                    "id": "surv_dp_2",
                    "name": "Real-Time Recharts Metric Visualization Cards",
                    "type": "UI Component",
                    "reusability_reason": "Smooth area and bar chart components bound to live data feeds with dark theme styling.",
                    "file_location": "src/components/analytics/MetricCard.tsx",
                    "dependencies": ["Recharts", "Lucide React"],
                    "suggested_reuse": "Drop directly into developer analytics or admin dashboards."
                }
            ]
        }
    }
]

def seed_demo_data():
    conn = get_db()
    cursor = conn.cursor()

    # Check if data already exists
    cursor.execute("SELECT COUNT(*) FROM projects")
    count = cursor.fetchone()[0]

    if count == 0:
        for proj in DEMO_PROJECTS:
            cursor.execute("""
            INSERT INTO projects (id, name, description, tech_stack, last_activity, completion_pct, status, health_score, file_count, line_count, todo_count, test_count, is_demo, summary_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                proj["id"],
                proj["name"],
                proj["description"],
                json.dumps(proj["tech_stack"]),
                proj["last_activity"],
                proj["completion_pct"],
                proj["status"],
                proj["health_score"],
                proj["file_count"],
                proj["line_count"],
                proj["todo_count"],
                proj["test_count"],
                1,
                json.dumps({"tech_stack": proj["tech_stack"]})
            ))

            autopsy = proj["autopsy"]
            cursor.execute("""
            INSERT INTO autopsies (id, project_id, status_category, likely_causes_json, evidence_json, dna_metrics_json, tech_dna_json, commit_history_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                f"autopsy_{proj['id']}",
                proj["id"],
                autopsy["status_category"],
                json.dumps(autopsy["likely_causes"]),
                json.dumps([]),
                json.dumps(autopsy["dna_metrics"]),
                json.dumps(autopsy["tech_dna"]),
                json.dumps(autopsy.get("commit_history", []))
            ))

            for surv in autopsy["survivors"]:
                cursor.execute("""
                INSERT INTO survivors (id, project_id, name, type, reusability_reason, file_location, dependencies, suggested_reuse)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    surv["id"],
                    proj["id"],
                    surv["name"],
                    surv["type"],
                    surv["reusability_reason"],
                    surv["file_location"],
                    json.dumps(surv["dependencies"]),
                    surv["suggested_reuse"]
                ))

        conn.commit()
    conn.close()

