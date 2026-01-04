const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function submitCase(caseData) {
  try {
    const response = await fetch(`${API_URL}/api/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData)
    });
    if (!response.ok) throw new Error('Failed to submit');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Save to localStorage as fallback (offline mode)
    const offlineId = `OFFLINE-${Date.now()}`;
    const offlineCase = { ...caseData, id: offlineId, offline: true };
    const pending = JSON.parse(localStorage.getItem('swasth-pending') || '[]');
    pending.push(offlineCase);
    localStorage.setItem('swasth-pending', JSON.stringify(pending));
    return { id: offlineId, status: 'saved-offline' };
  }
}

export async function getCases(status = 'all') {
  try {
    const response = await fetch(`${API_URL}/api/cases?status=${status}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Return localStorage data as fallback
    return JSON.parse(localStorage.getItem('swasth-pending') || '[]');
  }
}

export async function validateCase(caseId, comment = '') {
  const response = await fetch(`${API_URL}/api/cases/${caseId}/validate`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment })
  });
  return await response.json();
}

export async function getEpidemicData(days = 7) {
  try {
    const response = await fetch(`${API_URL}/api/epidemic?days=${days}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Return mock data as fallback
    return { symptoms: [], periodDays: days };
  }
}

export async function syncOfflineCases() {
  const pending = JSON.parse(localStorage.getItem('swasth-pending') || '[]');
  const synced = [];
  
  for (const caseData of pending) {
    try {
      await submitCase(caseData);
      synced.push(caseData.id);
    } catch (e) {
      console.error('Sync failed for', caseData.id);
    }
  }
  
  // Remove synced cases from pending
  const remaining = pending.filter(c => !synced.includes(c.id));
  localStorage.setItem('swasth-pending', JSON.stringify(remaining));
  
  return { synced: synced.length, remaining: remaining.length };
}
