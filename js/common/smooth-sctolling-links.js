document.addEventListener("DOMContentLoaded", addSmoothScrolling);

    function addSmoothScrolling() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();

          const targetId = this.getAttribute("href");
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            const offset = 80;
            const distanceToTargetY = targetElement.getBoundingClientRect().top - offset;
            smoothScrollTo(distanceToTargetY, 1000); // 500ms scroll
          }
        });
      });
    }

    function smoothScrollTo(distance, duration = 500) {
      const startY = window.scrollY;
      let startTime = null;

      function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutQuad(progress);

        window.scrollTo(0, startY + distance * ease);

        if (progress < 1) {
          requestAnimationFrame(animation);
        }
      }

      function easeInOutQuad(t) {
        return t < 0.5
          ? 2 * t * t
          : -1 + (4 - 2 * t) * t;
      }

      requestAnimationFrame(animation);
    }