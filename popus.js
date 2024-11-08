document.getElementById('autofillButton').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "getProfileData"}, function(response) {
          console.log('Received response:', response);
          
          if (response?.error) {
              // Show error message
              const errorElement = document.getElementById('errorMessage');
              errorElement.textContent = response.error;
              errorElement.style.display = 'block';
              setTimeout(() => {
                  errorElement.style.display = 'none';
              }, 5000);
              return;
          }

          if (response?.name || response?.company || response?.overlap) {
              if (response.name) {
                  document.getElementById('nameField').value = response.name;
              }
              if (response.company) {
                  document.getElementById('companyField').value = response.company;
              }
              if (response.overlap) {
                  document.getElementById('educationField').value = response.overlap;
              }
          }
      });
  });
});

document.getElementById('generateMessageButton').addEventListener('click', async function() {
  const messageData = {
      name: document.getElementById('nameField').value,
      company: document.getElementById('companyField').value,
      role: document.getElementById('roleField').value,
      overlap: document.getElementById('educationField').value
  };

  try {
      const response = await chrome.runtime.sendMessage({
          action: 'generateMessage',
          profileData: messageData
      });

      if (response.error) {
          showError(response.error);
      } else {
          document.getElementById('generatedMessage').value = response.message;
          updateCharCount();
          await storeOutreach(messageData, response.message);
      }
  } catch (error) {
      console.error('Error:', error);
      showError("Error generating message. Please try again.");
  }
});

document.getElementById('copyButton').addEventListener('click', function() {
  const messageText = document.getElementById('generatedMessage').value;
  navigator.clipboard.writeText(messageText).then(function() {
      showNotification();
      
      // Try to inject into LinkedIn
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
              action: "injectMessage",
              message: messageText
          });
      });
  }).catch(error => {
      console.error('Copy error:', error);
      showError("Failed to copy message.");
  });
});

document.getElementById('historyButton').addEventListener('click', function() {
  window.location.href = 'history.html';
});

// Helper Functions
function showError(message) {
  const errorElement = document.getElementById('errorMessage');
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  setTimeout(() => {
      errorElement.style.display = 'none';
  }, 5000);
}

function showNotification() {
  const notification = document.getElementById('copyNotification');
  notification.classList.remove('hidden');
  setTimeout(() => {
      notification.classList.add('hidden');
  }, 2000);
}

function updateCharCount() {
  const message = document.getElementById('generatedMessage').value;
  document.getElementById('charCount').textContent = `${message.length} / 300`;
}

async function storeOutreach(profileData, message) {
  const outreach = {
      ...profileData,
      message,
      date: new Date().toISOString()
  };
  
  chrome.storage.sync.get(['outreachHistory'], function(result) {
      const history = result.outreachHistory || [];
      history.push(outreach);
      chrome.storage.sync.set({ 'outreachHistory': history });
  });
}

// Add input listener for character count
document.getElementById('generatedMessage').addEventListener('input', updateCharCount);
