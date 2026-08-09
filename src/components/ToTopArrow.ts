export const ToTopArrow = {
  render(props: Record<string, unknown>): HTMLElement {
    const trigger = document.createElement('div');
    trigger.className = 'to-top-arrow-trigger';
    
    const arrow = document.createElement('button');
    arrow.className = 'to-top-arrow';
    arrow.title = 'Back to top';
    arrow.innerHTML = '<i class="fas fa-chevron-up"></i>';
    arrow.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    
    trigger.appendChild(arrow);
    return trigger;
  },
};
