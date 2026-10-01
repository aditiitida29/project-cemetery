import zipfile
import os
import shutil
import tempfile
import re
from pathlib import Path
from typing import Dict, Any, List

IGNORED_DIRS = {
    'node_modules', '.git', 'venv', '.venv', 'env', '__pycache__',
    'dist', 'build', '.next', '.nuxt', 'coverage', '.idea', '.vscode',
    'bin', 'obj', 'vendor', 'target', 'out'
}

IGNORED_EXTS = {
    '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.eot',
    '.pdf', '.zip', '.tar', '.gz', '.7z', '.exe', '.dll', '.so', '.dylib', '.pyc',
    '.db', '.sqlite', '.sqlite3', '.mp3', '.mp4', '.avi', '.mov', '.bin'
}

LANG_MAP = {
    '.py': 'Python',
    '.js': 'JavaScript',
    '.jsx': 'React JS',
    '.ts': 'TypeScript',
    '.tsx': 'React TS',
    '.html': 'HTML',
    '.css': 'CSS',
    '.scss': 'Sass',
    '.go': 'Go',
    '.rs': 'Rust',
    '.java': 'Java',
    '.c': 'C',
    '.cpp': 'C++',
    '.cs': 'C#',
    '.php': 'PHP',
    '.rb': 'Ruby',
    '.sql': 'SQL',
    '.sh': 'Shell',
    '.md': 'Markdown',
    '.json': 'JSON',
    '.yaml': 'YAML',
    '.yml': 'YAML'
}

FRAMEWORK_SIGNATURES = {
    'React': ['react', 'react-dom', 'useState', 'useEffect', 'jsx'],
    'FastAPI': ['fastapi', 'APIRouter', 'BaseModel'],
    'Flask': ['flask', 'Flask('],
    'Django': ['django', 'models.Model', 'views.py'],
    'Express': ['express', 'app.get(', 'app.post('],
    'Vue': ['vue', '<template>', 'defineComponent'],
    'Svelte': ['svelte', '<script>'],
    'Next.js': ['next', 'getStaticProps', 'getServerSideProps'],
    'Tailwind CSS': ['tailwindcss', 'bg-', 'flex', 'text-'],
    'PostgreSQL': ['psycopg2', 'pg', 'postgresql', 'postgres'],
    'SQLite': ['sqlite3', 'sqlite'],
    'MongoDB': ['mongoose', 'pymongo', 'mongodb'],
    'Redis': ['redis', 'ioredis'],
    'Docker': ['Dockerfile', 'docker-compose']
}

def scan_zip_archive(zip_file_bytes: bytes, filename: str) -> Dict[str, Any]:
    temp_dir = tempfile.mkdtemp()
    try:
        zip_path = Path(temp_dir) / filename
        with open(zip_path, 'wb') as f:
            f.write(zip_file_bytes)
            
        extract_dir = Path(temp_dir) / "extracted"
        os.makedirs(extract_dir, exist_ok=True)
        
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            # Prevent Zip Slip vulnerability
            for member in zip_ref.infolist():
                member_path = Path(member.filename)
                if member_path.is_absolute() or '..' in member_path.parts:
                    continue
                zip_ref.extract(member, extract_dir)
                
        # Analyze extracted folder
        return analyze_directory(extract_dir, filename)
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

def analyze_directory(root_dir: Path, original_filename: str) -> Dict[str, Any]:
    file_count = 0
    line_count = 0
    lang_counts: Dict[str, int] = {}
    todos: List[Dict[str, Any]] = []
    api_routes: List[str] = []
    frontend_endpoints_called: List[str] = []
    tests_found: List[str] = []
    dependencies_found: List[str] = []
    readme_content = ""
    detected_frameworks = set()
    git_history_info = None
    file_tree = []

    # Check git folder if present before ignoring
    git_dir = root_dir / '.git'
    if git_dir.exists() and git_dir.is_dir():
        git_history_info = {
            "git_present": True,
            "note": "Git repository metadata detected."
        }

    for current_root, dirs, files in os.walk(root_dir):
        # Filter out ignored directories in-place
        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS and not d.startswith('.')]
        
        rel_root = Path(current_root).relative_to(root_dir)
        
        for file in files:
            file_path = Path(current_root) / file
            rel_file_path = str(rel_root / file) if str(rel_root) != '.' else file
            
            ext = file_path.suffix.lower()
            if ext in IGNORED_EXTS or file.startswith('.'):
                continue
                
            file_count += 1
            lang = LANG_MAP.get(ext, 'Other')
            if ext not in IGNORED_EXTS:
                lang_counts[lang] = lang_counts.get(lang, 0) + 1
                
            if len(file_tree) < 50:
                file_tree.append(rel_file_path)

            # Check special files
            file_lower = file.lower()
            if 'readme' in file_lower:
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        readme_content = f.read(2000) # first 2000 chars
                except Exception:
                    pass

            if file_lower in ['package.json', 'requirements.txt', 'cargo.toml', 'go.mod', 'pom.xml', 'build.gradle']:
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        if 'package.json' in file_lower:
                            for pkg in ['react', 'express', 'vue', 'next', 'tailwind', 'axios', 'socket.io', 'prisma', 'mongoose']:
                                if pkg in content.lower():
                                    detected_frameworks.add(pkg.capitalize())
                                    dependencies_found.append(pkg)
                        elif 'requirements.txt' in file_lower:
                            for pkg in ['fastapi', 'flask', 'django', 'torch', 'tensorflow', 'psycopg2', 'sqlalchemy', 'celery', 'redis']:
                                if pkg in content.lower():
                                    detected_frameworks.add(pkg.capitalize())
                                    dependencies_found.append(pkg)
                except Exception:
                    pass

            # Detect test files
            if 'test' in rel_file_path.lower() or file.endswith(('_test.py', '.test.js', '.test.tsx', '.spec.js', '.spec.ts')):
                tests_found.append(rel_file_path)

            # Read text files for line counts, TODOs, API routes
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    lines = f.readlines()
                    line_count += len(lines)
                    
                    for idx, line in enumerate(lines, 1):
                        # TODO detection
                        todo_match = re.search(r'#(?:.*)(TODO|FIXME|HACK|XXX):?\s*(.*)', line, re.IGNORECASE) or \
                                     re.search(r'//(?:.*)(TODO|FIXME|HACK|XXX):?\s*(.*)', line, re.IGNORECASE)
                        if todo_match and len(todos) < 30:
                            todos.append({
                                'file': rel_file_path,
                                'line': idx,
                                'type': todo_match.group(1).upper(),
                                'text': todo_match.group(2).strip() or line.strip()
                            })

                        # Backend Route Detection
                        route_match = re.search(r'@app\.(get|post|put|delete|patch)\([\'"]([^\'"]+)[\'"]', line) or \
                                      re.search(r'@router\.(get|post|put|delete|patch)\([\'"]([^\'"]+)[\'"]', line) or \
                                      re.search(r'app\.(get|post|put|delete)\([\'"]([^\'"]+)[\'"]', line)
                        if route_match:
                            api_routes.append(f"{route_match.group(1).upper()} {route_match.group(2)}")

                        # Frontend API call detection
                        fetch_match = re.search(r'fetch\([\'"`](/api/[^\'"\`]+)[\'"`]\)', line) or \
                                      re.search(r'axios\.(get|post|put|delete)\([\'"`](/api/[^\'"\`]+)[\'"`]\)', line)
                        if fetch_match:
                            endpoint = fetch_match.group(1) if fetch_match.lastindex == 1 else fetch_match.group(2)
                            frontend_endpoints_called.append(endpoint)

                        # Framework signature match inside code
                        for fw, sigs in FRAMEWORK_SIGNATURES.items():
                            for sig in sigs:
                                if sig in line:
                                    detected_frameworks.add(fw)

            except Exception:
                continue

    # Extract Project Name from zip file name or parent folder
    project_name = original_filename.replace('.zip', '').replace('_', ' ').replace('-', ' ').title()
    if not project_name or project_name == 'Archive':
        project_name = "Resurrected App"

    # Compute rough completion estimate & health score based on empirical evidence
    todo_penalty = min(len(todos) * 2, 30)
    test_bonus = min(len(tests_found) * 5, 20)
    has_readme_bonus = 10 if readme_content else 0
    has_deps_bonus = 10 if dependencies_found else 0
    
    # Check potential broken backend calls (calls made on frontend vs backend routes present)
    missing_endpoints = set(frontend_endpoints_called) - set([r.split(' ')[-1] for r in api_routes])
    missing_endpoint_penalty = len(missing_endpoints) * 5

    raw_health = 60 + test_bonus + has_readme_bonus + has_deps_bonus - todo_penalty - missing_endpoint_penalty
    health_score = max(15, min(95, raw_health))
    completion_pct = max(20, min(90, health_score + (10 if len(api_routes) > 0 else -10)))

    status = "Abandoned"
    if completion_pct > 75:
        status = "Dormant"
    elif completion_pct < 40:
        status = "Critical"

    tech_stack_list = list(detected_frameworks)[:6]
    if not tech_stack_list:
        tech_stack_list = list(lang_counts.keys())[:4]

    return {
        'name': project_name,
        'tech_stack': tech_stack_list,
        'completion_pct': completion_pct,
        'status': status,
        'health_score': health_score,
        'file_count': file_count,
        'line_count': line_count,
        'todo_count': len(todos),
        'todos': todos,
        'test_count': len(tests_found),
        'tests': tests_found,
        'api_routes': api_routes,
        'frontend_endpoints_called': frontend_endpoints_called,
        'missing_endpoints': list(missing_endpoints),
        'lang_counts': lang_counts,
        'readme_snippet': readme_content[:800],
        'file_tree': file_tree,
        'git_history': git_history_info
    }
