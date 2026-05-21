document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');
  const copyBtn = document.getElementById('copyBtn');
  const wechatIdSpan = document.getElementById('wechatId');
  const copyToast = document.getElementById('copyToast');

  // --- Dark Mode / Light Mode Theme Handler ---
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return userPrefersDark ? 'dark' : 'light';
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  };

  // Initialize theme
  setTheme(getPreferredTheme());

  // Handle theme toggling
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  // --- Copy to Clipboard Handler ---
  const copyWeChatId = async () => {
    const textToCopy = wechatIdSpan.textContent.trim();
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
        showCopyFeedback();
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed'; // Avoid scrolling to bottom
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            showCopyFeedback();
          } else {
            console.error('Fallback copy command failed');
          }
        } catch (err) {
          console.error('Fallback copy execution failed:', err);
        }
        
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy text using Clipboard API:', err);
    }
  };

  const showCopyFeedback = () => {
    // 1. Animate copy button text
    const btnText = copyBtn.querySelector('span');
    const originalText = btnText.textContent;
    btnText.textContent = '已复制!';
    copyBtn.style.background = 'hsl(149, 80%, 30%)';
    
    setTimeout(() => {
      btnText.textContent = originalText;
      copyBtn.style.background = '';
    }, 2000);

    // 2. Trigger Toast Notification
    copyToast.classList.remove('show');
    // Trigger reflow to restart animation if clicked repeatedly
    void copyToast.offsetWidth; 
    copyToast.classList.add('show');
    
    setTimeout(() => {
      copyToast.classList.remove('show');
    }, 3000);
  };

  copyBtn.addEventListener('click', copyWeChatId);
});
