const API_BASE = '/api';

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function fetchProjectDetails(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  if (!res.ok) throw new Error('Failed to fetch project details');
  return res.json();
}

export async function uploadProjectZip(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(errorData.detail || 'Failed to upload and analyze project ZIP');
  }
  return res.json();
}

export async function resurrectProject(projectId, mode, targetGoal) {
  const res = await fetch(`${API_BASE}/resurrect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      project_id: projectId,
      mode: mode,
      target_goal: targetGoal
    })
  });

  if (!res.ok) throw new Error('Failed to generate resurrection plan');
  return res.json();
}

export async function createFrankenstein(projectIds) {
  const res = await fetch(`${API_BASE}/frankenstein`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project_ids: projectIds })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Frankenstein creation failed' }));
    throw new Error(err.detail || 'Failed to create Frankenstein fusion');
  }
  return res.json();
}

export async function resetDemoCemetery() {
  const res = await fetch(`${API_BASE}/reset-demo`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to reset demo data');
  return res.json();
}

export async function deleteProject(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete project');
  return res.json();
}

export async function exportSurvivorBundle(projectId, projectName) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/export-survivors`);
  if (!res.ok) throw new Error('Failed to export survivor bundle');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(projectName || 'project').replace(/\s+/g, '_')}_survivors_bundle.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function sendGhostChatMessage(projectId, message, chatHistory = []) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/ghost-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, chat_history: chatHistory })
  });
  if (!res.ok) throw new Error('Ghost chat failed');
  return res.json();
}

export async function generateHackathonPitch(projectId) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/generate-pitch`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Pitch generation failed');
  return res.json();
}


