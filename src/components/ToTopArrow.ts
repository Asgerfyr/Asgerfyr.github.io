export const ToTopArrow = {
  render(_props: Record<string, unknown> = {}): string {
    return `
      <div class="to-top-arrow-trigger">
        <button class="to-top-arrow" title="Back to top">
          <i class="fas fa-chevron-up"></i>
        </button>
      </div>
    `;
  },
};
