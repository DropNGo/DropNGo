(function(){
  const STORAGE_KEY = 'theme';
  const toggleBtns = document.querySelectorAll('#themeToggleDesktop, #themeToggleMobile');
  let saved = localStorage.getItem(STORAGE_KEY);
  let theme = (saved === 'dark' || saved === 'light') ? saved : 'light';
  applyTheme(theme);
  function applyTheme(next){
    const themeVal = next === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeVal);
    localStorage.setItem(STORAGE_KEY, themeVal);
    const isDark = themeVal === 'dark';
    toggleBtns.forEach(btn => btn.setAttribute('aria-pressed', String(isDark)));
  }
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  });
})();
