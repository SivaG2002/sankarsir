const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');

  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute(
    'aria-label',
    isOpen ? 'Close navigation' : 'Open navigation'
  );
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('is-open');

    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
  });
});

const consultationForm = document.getElementById("consultation-form");

if (consultationForm) {
  const formStatus = consultationForm.querySelector(".form-status");

  consultationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = consultationForm.querySelector(
      'button[type="submit"]'
    );

    const originalButtonText = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML = "Sending...";

    const data = {
      name: consultationForm.elements["name"].value.trim(),
      email: consultationForm.elements["email"].value.trim(),
      phone: consultationForm.elements["phone"].value.trim(),
      interest: consultationForm.elements["interest"].value,
      message: consultationForm.elements["message"].value.trim()
    };

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbyfiGOTXi2JaqZOQS_hu0zPbZDx0biXG9Ko3BQmozwpwNDq8vPr8hMdEt4E0miQjHpT/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain"
          },
          body: JSON.stringify(data)
        }
      );

      formStatus.textContent =
        "Thank you! Your enquiry has been sent successfully.";

      consultationForm.reset();

    } catch (error) {
      console.error("Form submission error:", error);

      formStatus.textContent =
        "Something went wrong. Please try again.";
    }

    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  });
}


/* =========================
   VISITOR COUNTER
   ========================= */

async function updateVisitorCount() {
  try {
    const response = await fetch('/api/visits', {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Visitor API failed');
    }

    const data = await response.json();

    console.log('Total visitors:', data.count);

    // If your HTML has an element with id="visitor-count",
    // it will display the number automatically.
    const visitorCount = document.querySelector('#visitor-count');

    if (visitorCount) {
      visitorCount.textContent = data.count.toLocaleString();
    }

  } catch (error) {
    console.error('Could not update visitor count:', error);
  }
}

updateVisitorCount();

/* =========================
   CAROUSEL NAVIGATION (60fps Optimized)
   ========================= */

function initCarousel() {
  const carouselContainers = document.querySelectorAll('.carousel-container');
  
  carouselContainers.forEach(container => {
    const track = container.querySelector('.carousel-track');
    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    let isScrolling = false;
    let scrollAnimationFrame;
    
    function smoothScroll(target, duration = 600) {
      if (isScrolling) return;
      
      isScrolling = true;
      const start = track.scrollLeft;
      const distance = target - start;
      const startTime = performance.now();
      
      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }
      
      function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        track.scrollLeft = start + distance * ease;
        
        if (progress < 1) {
          scrollAnimationFrame = requestAnimationFrame(animate);
        } else {
          isScrolling = false;
          updateButtonStates();
        }
      }
      
      scrollAnimationFrame = requestAnimationFrame(animate);
    }
    
    function scroll(direction) {
      const slideWidth = track.querySelector('.carousel-slide').offsetWidth + 18;
      const targetScroll = track.scrollLeft + (slideWidth * (direction === 'next' ? 1 : -1));
      smoothScroll(targetScroll, 600);
    }
    
    prevBtn.addEventListener('click', () => scroll('prev'));
    nextBtn.addEventListener('click', () => scroll('next'));
    
    // Auto-scroll carousel
    let autoScrollInterval;
    let isAutoPlaying = true;
    let isHovered = false;
    const AUTO_SCROLL_DELAY = 2000; // 4 seconds between slides
    
    function startAutoScroll() {
      if (!isAutoPlaying || isHovered) return;
      
      clearInterval(autoScrollInterval);
      autoScrollInterval = setInterval(() => {
        if (!isScrolling) {
          const isAtEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 5;
          
          if (isAtEnd) {
            // Loop back to start
            smoothScroll(0, 1200);
          } else {
            scroll('next');
          }
        }
      }, AUTO_SCROLL_DELAY);
    }
    
    function stopAutoScroll() {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
    
    function pauseAutoScroll() {
      isHovered = true;
      stopAutoScroll();
    }
    
    function resumeAutoScroll() {
      isHovered = false;
      startAutoScroll();
    }
    
    // Pause auto-scroll on hover
    container.addEventListener('mouseenter', () => {
      pauseAutoScroll();
    });
    
    // Resume auto-scroll on mouse leave
    container.addEventListener('mouseleave', () => {
      resumeAutoScroll();
    });
    
    // Pause auto-scroll when user manually scrolls
    track.addEventListener('scroll', () => {
      pauseAutoScroll();
    }, { passive: true });
    
    // Resume after user stops manually scrolling
    let manualScrollTimeout;
    track.addEventListener('scroll', () => {
      clearTimeout(manualScrollTimeout);
      manualScrollTimeout = setTimeout(() => {
        if (!isHovered) {
          resumeAutoScroll();
        }
      }, 3000);
    }, { passive: true });
    
    // Start auto-scroll on initialization
    startAutoScroll();
    
    // Add keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') scroll('prev');
      if (e.key === 'ArrowRight') scroll('next');
    });
    
    // Update button states based on scroll position
    function updateButtonStates() {
      const isAtStart = track.scrollLeft < 5;
      const isAtEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 5;
      
      prevBtn.style.opacity = isAtStart ? '0.5' : '1';
      prevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
      prevBtn.style.cursor = isAtStart ? 'not-allowed' : 'pointer';
      
      nextBtn.style.opacity = isAtEnd ? '0.5' : '1';
      nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
      nextBtn.style.cursor = isAtEnd ? 'not-allowed' : 'pointer';
    }
    
    track.addEventListener('scroll', updateButtonStates, { passive: true });
    window.addEventListener('resize', updateButtonStates, { passive: true });
    updateButtonStates();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      if (scrollAnimationFrame) cancelAnimationFrame(scrollAnimationFrame);
    });
  });
}

// Initialize carousel when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousel);
} else {
  initCarousel();
}

