const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
    const arrow = entry.target.querySelector('.to-top-arrow');
    
    // Trigger reflow to ensure animation restarts
    void arrow.offsetHeight; // Forces reflow
    
    // If the element is in the viewport, add 'in-viewport' to trigger animation
    if (entry.isIntersecting) {
      entry.target.classList.add('in-viewport');
      arrow.classList.add('animate');
    } else {
      // If the element is not in the viewport, remove 'in-viewport' and reverse animation
      entry.target.classList.remove('in-viewport');
    }
    });
});

const triggerElement = document.querySelector('.to-top-arrow-trigger');
observer.observe(triggerElement);