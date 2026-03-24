// Content script - injected into Google Meet pages
(function () {
  'use strict';

  let classroomIframe = null;
  let toggleButton = null;
  let isOpen = false;

  // Create the floating toggle button on Meet
  function createToggleButton() {
    if (document.getElementById('mc3d-toggle')) return;

    toggleButton = document.createElement('button');
    toggleButton.id = 'mc3d-toggle';
    toggleButton.innerHTML = '🚀';
    toggleButton.title = 'פתח כיתה 3D';
    toggleButton.addEventListener('click', () => {
      if (isOpen) {
        closeClassroom();
      } else {
        openClassroom();
      }
    });
    document.body.appendChild(toggleButton);
  }

  // Open the 3D classroom as overlay
  function openClassroom() {
    if (classroomIframe) return;

    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'mc3d-overlay';

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.id = 'mc3d-close';
    closeBtn.innerHTML = '✕ ESC';
    closeBtn.addEventListener('click', closeClassroom);
    overlay.appendChild(closeBtn);

    // Create iframe with the 3D classroom app
    classroomIframe = document.createElement('iframe');
    classroomIframe.id = 'mc3d-iframe';
    classroomIframe.src = chrome.runtime.getURL('app/index.html');
    classroomIframe.allow = 'autoplay; microphone; camera';
    overlay.appendChild(classroomIframe);

    document.body.appendChild(overlay);
    isOpen = true;
    toggleButton.innerHTML = '✕';
    toggleButton.title = 'סגור כיתה 3D';

    // ESC to close
    document.addEventListener('keydown', handleEsc);
  }

  // Close the 3D classroom
  function closeClassroom() {
    const overlay = document.getElementById('mc3d-overlay');
    if (overlay) {
      overlay.remove();
    }
    classroomIframe = null;
    isOpen = false;
    if (toggleButton) {
      toggleButton.innerHTML = '🚀';
      toggleButton.title = 'פתח כיתה 3D';
    }
    document.removeEventListener('keydown', handleEsc);
  }

  function handleEsc(e) {
    if (e.key === 'Escape') {
      closeClassroom();
    }
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'openClassroom') {
      openClassroom();
      sendResponse({ ok: true });
    } else if (msg.action === 'closeClassroom') {
      closeClassroom();
      sendResponse({ ok: true });
    } else if (msg.action === 'getStatus') {
      sendResponse({ isOpen });
    }
    return true;
  });

  // Wait for Meet to load, then inject button
  function init() {
    // Wait for the Meet UI to be ready
    const observer = new MutationObserver(() => {
      if (document.querySelector('[data-meeting-title]') || document.querySelector('[data-call-id]') || document.querySelector('c-wiz')) {
        createToggleButton();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also try immediately and after delays
    setTimeout(createToggleButton, 2000);
    setTimeout(createToggleButton, 5000);
    setTimeout(createToggleButton, 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
