document.getElementById('goBackButton').addEventListener('click', function() {
  window.location.href = 'popup.html';
});

// Add export/import buttons to history.html
const headerRow = document.querySelector('.header-row');
headerRow.insertAdjacentHTML('beforeend', `
  <div style="display: flex; gap: 8px;">
      <button id="exportButton" class="action-button">Export</button>
      <input type="file" id="importInput" accept=".json" style="display: none;">
      <button id="importButton" class="action-button">Import</button>
  </div>
`);

// Function to load and display history
function loadHistory() {
  chrome.storage.sync.get(['outreachHistory'], function(result) {
      const history = result.outreachHistory || [];
      const historyDiv = document.getElementById('outreachHistory');
      
      if (history.length === 0) {
          historyDiv.innerHTML = '<p style="color: #666; font-size: 13px;">No outreach history found.</p>';
          return;
      }

      const reversedHistory = [...history].reverse();
      const historyHtml = reversedHistory.map(outreach => `
          <div class="outreach-item">
              <p><strong>Name:</strong> ${outreach.name}</p>
              <p><strong>Company:</strong> ${outreach.company}</p>
              <p><strong>Role:</strong> ${outreach.role}</p>
              <p><strong>Date:</strong> ${new Date(outreach.date).toLocaleString()}</p>
              <p><strong>Message:</strong> ${outreach.message}</p>
          </div>
      `).join('');

      historyDiv.innerHTML = historyHtml;
  });
}

// Export functionality
document.getElementById('exportButton').addEventListener('click', function() {
  chrome.storage.sync.get(['outreachHistory'], function(result) {
      const history = result.outreachHistory || [];
      const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `linkedin-outreach-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  });
});

// Import functionality
document.getElementById('importButton').addEventListener('click', function() {
  document.getElementById('importInput').click();
});

document.getElementById('importInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          try {
              const importedHistory = JSON.parse(e.target.result);
              chrome.storage.sync.get(['outreachHistory'], function(result) {
                  const currentHistory = result.outreachHistory || [];
                  // Merge imported history with current history, removing duplicates
                  const mergedHistory = [...currentHistory];
                  importedHistory.forEach(item => {
                      if (!mergedHistory.some(existing => 
                          existing.name === item.name && 
                          existing.date === item.date)) {
                          mergedHistory.push(item);
                      }
                  });
                  chrome.storage.sync.set({ 'outreachHistory': mergedHistory }, function() {
                      loadHistory(); // Refresh the display
                      alert('History imported successfully!');
                  });
              });
          } catch (error) {
              alert('Error importing history. Please make sure the file is valid.');
          }
      };
      reader.readAsText(file);
  }
});

// Initial load
loadHistory();
