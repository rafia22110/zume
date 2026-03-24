// Popup script - communicates with content script on Meet page
const btnOpen = document.getElementById('btnOpen');
const btnClose = document.getElementById('btnClose');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

// Check if we're on a Meet page
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (tab && tab.url && tab.url.includes('meet.google.com')) {
    statusDot.classList.add('active');
    statusText.textContent = 'מחובר לשיחת Meet';
    btnOpen.disabled = false;

    // Check if classroom is already open
    chrome.tabs.sendMessage(tab.id, { action: 'getStatus' }, (response) => {
      if (chrome.runtime.lastError) return;
      if (response && response.isOpen) {
        btnOpen.classList.add('hidden');
        btnClose.classList.remove('hidden');
      }
    });
  } else {
    statusDot.classList.remove('active');
    statusText.textContent = 'פתח שיחת Meet קודם';
    btnOpen.disabled = true;
    btnOpen.style.opacity = '0.3';
  }
});

btnOpen.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'openClassroom' });
    btnOpen.classList.add('hidden');
    btnClose.classList.remove('hidden');
  });
});

btnClose.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'closeClassroom' });
    btnClose.classList.add('hidden');
    btnOpen.classList.remove('hidden');
  });
});
