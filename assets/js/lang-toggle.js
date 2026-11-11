/* Anima la bolita y luego navega al otro idioma */
(function(){
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a.pm-lt');
    if(!a||e.ctrlKey||e.metaKey||e.shiftKey||e.button)return;
    e.preventDefault();a.classList.add('pm-lt-go');
    try{localStorage.setItem('pm-lang',a.getAttribute('hreflang'))}catch(_){}
    setTimeout(function(){location.href=a.href},300);
  });
})();
