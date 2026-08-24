(() => {
  const trigger = document.querySelector('.to-top-arrow-trigger');
  const arrow = document.querySelector('.to-top-arrow');

  if (!trigger || !arrow) {
    return;
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  arrow.addEventListener('click', scrollToTop);

  if (!('IntersectionObserver' in window)) {
    trigger.classList.add('in-viewport');
    arrow.classList.add('animate');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const currentArrow = entry.target.querySelector('.to-top-arrow');

      if (!currentArrow) {
        return;
      }

      void currentArrow.offsetHeight;

      if (entry.isIntersecting) {
        entry.target.classList.add('in-viewport');
        currentArrow.classList.add('animate');
      } else {
        entry.target.classList.remove('in-viewport');
        currentArrow.classList.remove('animate');
      }
    });
  });

  observer.observe(trigger);
})();