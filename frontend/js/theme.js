(function(){
  const STORAGE_KEY='theme';
  const toggleBtns=document.querySelectorAll('#themeToggleDesktop,#themeToggleMobile');
  let saved=localStorage.getItem(STORAGE_KEY);
  let theme=(saved==='dark'||saved==='light')?saved:'light';
  applyTheme(theme);
  function applyTheme(next){
    const val=next==='dark'?'dark':'light';
    document.documentElement.setAttribute('data-theme',val);
    localStorage.setItem(STORAGE_KEY,val);
    const isDark=val==='dark';
    toggleBtns.forEach(btn=>btn.setAttribute('aria-pressed',String(isDark)));
  }
  toggleBtns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const current=document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light';
      applyTheme(current==='dark'?'light':'dark');
    });
  });
})();