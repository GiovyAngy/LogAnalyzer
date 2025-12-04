 
    const API_BASE = '/logs'; 

    let loadedFiles = []; 
    let currentLogs = [];
    let currentFileName = null;

    document.addEventListener('DOMContentLoaded', () => {
      setupEventListeners();
      loadSessions(); 
    });

    function setupEventListeners(){
      const dropZone = document.getElementById('dropZone');
      const fileInput = document.getElementById('fileInput');

      dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
      dropZone.addEventListener('drop', async e => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files) await handleFiles(e.dataTransfer.files);
      });

      fileInput.addEventListener('change', async e => {
        if (e.target.files) await handleFiles(e.target.files);
      });

      document.getElementById('analyzeBtn').addEventListener('click', analyzeLogs);
      document.getElementById('saveBtn').addEventListener('click', saveSession);
    }

    /* ---------- Sessions (sidebar) ---------- */
    async function loadSessions(){
      const list = document.getElementById('sessionsList');
      list.innerHTML = '<p style="color:#999;text-align:center;padding:12px;">Loading...</p>';
      try {
        const res = await fetch(`${API_BASE}/sessions`);
        if (!res.ok) throw new Error('Unable to obtain sessions: ' + res.statusText);
        const sessions = await res.json();
        renderSessions(sessions);
      } catch (err) {
        list.innerHTML = '<p style="color:#999;text-align:center;padding:12px;">No sessions</p>';
        console.error(err);
      }
    }

    function renderSessions(sessions){
      const container = document.getElementById('sessionsList');
      if (!Array.isArray(sessions) || sessions.length === 0) {
        container.innerHTML = '<p style="color:#999;text-align:center;padding:12px;">No sessions</p>';
        return;
      }
      container.innerHTML = '';
      sessions.forEach(s => {
        const card = document.createElement('div');
        card.className = 'session-card';
        card.innerHTML = `
          <div class="session-row">
            <div>
              <div class="session-title">${escapeHtml(s.fileName || 'Untitled')}</div>
              <div class="session-date">${s.createdAt ? new Date(s.createdAt).toLocaleString() : '-'}</div>
            </div>
            <div class="session-actions">
              <button class="btn-small btn-view" data-id="${escapeHtml(s.id)}">View</button>
              <button class="btn-small btn-del" data-id="${escapeHtml(s.id)}">🗑️</button>
            </div>
          </div>
        `;
        container.appendChild(card);

        // add listeners
        card.querySelector('.btn-view').addEventListener('click', () => viewSession(s.id));
        card.querySelector('.btn-del').addEventListener('click', () => deleteSession(s.id));
      });
    }

    /* ---------- File handling (client) ---------- */
    async function handleFiles(fileList){
      if (!fileList || fileList.length === 0) return;
      loadedFiles = [];
      const fileListDiv = document.getElementById('fileList');
      fileListDiv.innerHTML = '';
      for (let i=0;i<fileList.length;i++){
        const f = fileList[i];
        try {
          const text = await f.text();
          loadedFiles.push({ name: f.name, content: text });
          const pill = document.createElement('span');
          pill.className = 'file-pill';
          pill.textContent = f.name;
          fileListDiv.appendChild(pill);
        } catch(e){
          showError('File reading error ' + f.name + ': ' + (e.message||e));
        }
      }
      fileListDiv.style.display = loadedFiles.length ? 'flex' : 'none';
      currentFileName = loadedFiles.length > 1 ? `${loadedFiles.length} files` : (loadedFiles[0] && loadedFiles[0].name) || null;
      showSuccess(`${loadedFiles.length} file caricati`);
    }

    /* ---------- Analyze & Save ---------- */
    async function analyzeLogs(){
      hideAlerts(); showLoading(true);
      try {
        let fileResults = [];
        
        if (loadedFiles.length > 0){
        
          for (const file of loadedFiles) {
            const res = await fetch(`${API_BASE}/parse-text`, {
              method: 'POST', 
              headers: {'Content-Type':'text/plain'}, 
              body: file.content
            });
            if (!res.ok) throw new Error('Analysis failed for ' + file.name + ': ' + res.statusText);
            const logs = await res.json();
            fileResults.push({ fileName: file.name, logs: logs });
          }
        } else {
          
          const payload = document.getElementById('logTextArea').value.trim();
          if (!payload){
            showError('No content to analyse');
            showLoading(false);
            return;
          }
          const res = await fetch(`${API_BASE}/parse-text`, {
            method: 'POST', headers: {'Content-Type':'text/plain'}, body: payload
          });
          if (!res.ok) throw new Error('Analysis failed: ' + res.statusText);
          const logs = await res.json();
          fileResults.push({ fileName: 'Pasted Text', logs: logs });
        }
        
        displayResultsByFile(fileResults);
        showSuccess('Analysis completed');
      } catch(err){
        showError('Analysis error: ' + (err.message||err));
        console.error(err);
      } finally { showLoading(false); }
    }

    async function saveSession(){
      hideAlerts(); showLoading(true);
      try {
        let payload = '';
        if (loadedFiles.length > 0){
          loadedFiles.forEach(f => payload += `=== FILE: ${f.name} ===\n${f.content}\n\n`);
        } else {
          payload = document.getElementById('logTextArea').value.trim();
        }
        if (!payload) { showError('No content to save'); showLoading(false); return; }
        const fileName = currentFileName || 'Pasted text';
        const res = await fetch(`${API_BASE}/save-session?fileName=${encodeURIComponent(fileName)}`, {
          method:'POST', headers:{'Content-Type':'text/plain'}, body:payload
        });
        if (!res.ok) throw new Error('Save failed: ' + res.statusText);
        await res.json();
        showSuccess('Session saved');
        setTimeout(()=>loadSessions(),400);
      } catch(err){
        showError('Save error: ' + (err.message||err)); console.error(err);
      } finally { showLoading(false); }
    }

    /* ---------- Sessions actions ---------- */
    async function viewSession(id){
      hideAlerts(); showLoading(true);
      try {
        const res = await fetch(`${API_BASE}/sessions/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error('Load session failed: ' + res.statusText);
        const session = await res.json();
        document.getElementById('logTextArea').value = session.originalText || '';
        currentFileName = session.fileName || null;
        const logs = (session.logEntries || []).map(e => ({
          timestamp: e.timestamp, level: e.level, source: e.source, message: e.message
        }));
        currentLogs = logs;
        displayResults(logs);
        showSuccess('Session loaded');
      } catch(err){ showError('Loading error: ' + (err.message||err)); console.error(err); }
      finally{ showLoading(false); }
    }

    async function deleteSession(id){
      if (!confirm('Are you sure you want to delete this session??')) return;
      try {
        const res = await fetch(`${API_BASE}/sessions/${encodeURIComponent(id)}`, { method:'DELETE' });
        if (!res.ok) throw new Error('Delete failed: ' + res.statusText);
        showSuccess('Session deleted');
        setTimeout(()=>loadSessions(),300);
      } catch(err){ showError('Delete failed: ' + (err.message||err)); console.error(err); }
    }

    /* ---------- Display results by file (new approach) ---------- */
    function displayResultsByFile(fileResults){
      const resultsContainer = document.getElementById('resultsContainer');
      resultsContainer.innerHTML = '';

      if (!fileResults || fileResults.length === 0) {
        resultsContainer.innerHTML = '<p style="color:#666">No log files to display.</p>';
        document.getElementById('resultsSection').classList.remove('visible');
        return;
      }

      fileResults.forEach(fileResult => {
        const fileName = fileResult.fileName;
        const entries = fileResult.logs || [];
        const stats = { 
          total: entries.length, 
          errors: entries.filter(e=>e.level==='ERROR').length, 
          warnings: entries.filter(e=>e.level==='WARN').length, 
          info: entries.filter(e=>e.level==='INFO').length 
        };
        
        const el = document.createElement('div');
        el.className = 'file-section';
        el.innerHTML = `
          <div class="file-title">📄 ${escapeHtml(fileName)}</div>
          <div class="per-file-stats">
            <div class="stat-card-small"><div class="stat-value">${stats.total}</div><div class="stat-label">Totals</div></div>
            <div class="stat-card-small"><div class="stat-value">${stats.errors}</div><div class="stat-label">Errors</div></div>
            <div class="stat-card-small"><div class="stat-value">${stats.warnings}</div><div class="stat-label">Warnings</div></div>
            <div class="stat-card-small"><div class="stat-value">${stats.info}</div><div class="stat-label">Info</div></div>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr><th style="min-width:130px">Timestamp</th><th style="min-width:80px">Level</th><th style="min-width:120px">Source</th><th>Message</th></tr>
              </thead>
              <tbody>
                ${entries.map(e=>`<tr>
                  <td>${escapeHtml(e.timestamp||'-')}</td>
                  <td>${e.level?`<span class="level-badge level-${escapeHtml(e.level)}">${escapeHtml(e.level)}</span>`:'-'}</td>
                  <td>${escapeHtml(e.source||'-')}</td>
                  <td class="message-cell">${escapeHtml(e.message||'-')}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        `;
        resultsContainer.appendChild(el);
      });

      document.getElementById('resultsSection').classList.add('visible');
    }

    /* ---------- Display results (legacy for sessions) ---------- */
    function displayResults(logs){
      // For backward compatibility with session loading
      const resultsContainer = document.getElementById('resultsContainer');
      resultsContainer.innerHTML = '';

      // group by file using separators in message
      const logsByFile = {};
      let currentFile = 'Session Date';
      (logs||[]).forEach(log=>{
        if (log && typeof log.message === 'string' && log.message.startsWith('=== FILE:')){
          const m = log.message.match(/=== FILE: (.*) ===/);
          currentFile = (m && m[1]) ? m[1] : 'Session Date';
          return;
        }
        if (!logsByFile[currentFile]) logsByFile[currentFile] = [];
        logsByFile[currentFile].push(log);
      });

      const fileNames = Object.keys(logsByFile);
      if (fileNames.length === 0) {
        resultsContainer.innerHTML = '<p style="color:#666">No log filed to display.</p>';
        document.getElementById('resultsSection').classList.remove('visible');
        return;
      }

      const fileResults = fileNames.map(fn => ({ fileName: fn, logs: logsByFile[fn] }));
      displayResultsByFile(fileResults);
    }

    /* ---------- UI helpers ---------- */
    function showLoading(on){ document.getElementById('loading').classList.toggle('visible', !!on); }
    function showError(msg){ const a=document.getElementById('errorAlert'); a.textContent=msg; a.classList.add('visible'); setTimeout(()=>a.classList.remove('visible'),6000) }
    function showSuccess(msg){ const a=document.getElementById('successAlert'); a.textContent=msg; a.classList.add('visible'); setTimeout(()=>a.classList.remove('visible'),3200) }
    function hideAlerts(){ document.getElementById('errorAlert').classList.remove('visible'); document.getElementById('successAlert').classList.remove('visible'); }
    function escapeHtml(unsafe){ if (unsafe===null||unsafe===undefined) return ''; return String(unsafe).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }

    /* keyframes spin */
    (function(){ const s=document.createElement('style'); s.innerHTML='@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}'; document.head.appendChild(s); })();