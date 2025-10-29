// Theme Management
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Initialize theme from memory or default to dark
let currentTheme = 'dark';

function setTheme(theme) {
  currentTheme = theme;
  htmlElement.setAttribute('data-theme', theme);
}

themeToggle.addEventListener('click', () => {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
});

// Initialize with dark theme (professional modern look)
setTheme('dark');

// Enhanced Mobile Menu Toggle with animation
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

mobileMenuToggle.addEventListener('click', () => {
  const isActive = mobileMenuToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  
  // Animate menu items on open
  if (isActive) {
    const menuLinks = navMenu.querySelectorAll('.nav-link');
    menuLinks.forEach((link, index) => {
      link.style.opacity = '0';
      link.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        link.style.opacity = '1';
        link.style.transform = 'translateX(0)';
      }, index * 50);
    });
  }
  
  // Prevent body scroll when menu is open
  document.body.style.overflow = isActive ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target) && navMenu.classList.contains('active')) {
    mobileMenuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Enhanced Navbar Scroll Effect with hide/show
const navbar = document.getElementById('navbar');
let lastScrollTop = 0;
let ticking = false;
let scrollTimeout;

function updateNavbar(scrollTop) {
  if (scrollTop > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  // Hide navbar on scroll down, show on scroll up (only on mobile)
  if (window.innerWidth <= 768) {
    clearTimeout(scrollTimeout);
    
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    // Always show navbar when scrolling stops
    scrollTimeout = setTimeout(() => {
      navbar.style.transform = 'translateY(0)';
    }, 150);
  }
  
  lastScrollTop = scrollTop;
  ticking = false;
}

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateNavbar(scrollTop);
    });
    ticking = true;
  }
});

// Enhanced Active Navigation Link on Scroll
const sections = document.querySelectorAll('.section, .hero');
const navLinksArray = Array.from(navLinks);
let activeTransitionTimeout;

function updateActiveNavLink() {
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const scrollPosition = window.pageYOffset + 150;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinksArray.forEach(link => {
    const wasActive = link.classList.contains('active');
    link.classList.remove('active');
    
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
      
      // Only animate if it's newly active
      if (!wasActive) {
        clearTimeout(activeTransitionTimeout);
        link.style.transition = 'none';
        link.style.transform = 'scale(1.08)';
        
        activeTransitionTimeout = setTimeout(() => {
          link.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
          link.style.transform = 'scale(1)';
        }, 50);
      }
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);

// Enhanced Smooth Scroll for Navigation Links
navLinksArray.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Add ripple effect on click
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(34, 211, 238, 0.3);
        width: 20px;
        height: 20px;
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;
      link.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
  });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Enhanced Intersection Observer for Scroll Animations
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      entry.target.style.filter = 'blur(0)';
    }
  });
}, observerOptions);

// Observe elements for scroll animations with stagger effect
const animateOnScroll = document.querySelectorAll(
  '.experience-card, .project-card, .achievement-card, .publication-card, .timeline-item, .skills-category'
);

animateOnScroll.forEach((el, index) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(40px)';
  el.style.filter = 'blur(10px)';
  el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease';
  el.style.transitionDelay = `${index * 0.1}s`;
  observer.observe(el);
});

// Enhanced Parallax Effect for Hero Section
const heroSection = document.querySelector('.hero');
const particles = document.querySelectorAll('.particle');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxSpeed = 0.5;
  
  if (heroSection && scrolled < window.innerHeight) {
    // Parallax particles
    particles.forEach((particle, index) => {
      const speed = parallaxSpeed * (index + 1) * 0.3;
      particle.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    // Subtle hero content parallax
    if (heroContent) {
      const opacity = 1 - (scrolled / window.innerHeight) * 0.8;
      const translateY = scrolled * 0.3;
      heroContent.style.opacity = opacity;
      heroContent.style.transform = `translateY(${translateY}px)`;
    }
  }
});

// Enhanced Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };
    
    // Simulate form submission with loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      console.log('Form submitted:', formData);
      
      // Show success message with animation
      contactForm.style.opacity = '0';
      contactForm.style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
        formSuccess.style.animation = 'fadeInScale 0.5s ease-out';
      }, 300);
      
      // Reset form and hide success message after 6 seconds
      setTimeout(() => {
        formSuccess.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
          contactForm.reset();
          contactForm.style.display = 'flex';
          contactForm.style.opacity = '1';
          contactForm.style.transform = 'scale(1)';
          formSuccess.classList.remove('show');
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 300);
      }, 6000);
    }, 1500);
  });
  
  // Add fade in scale animation
  const formStyle = document.createElement('style');
  formStyle.textContent = `
    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes fadeOut {
      to {
        opacity: 0;
        transform: scale(0.95);
      }
    }
  `;
  document.head.appendChild(formStyle);
}

// Enhanced Floating Action Button with pulse effect
const fab = document.getElementById('fab');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 500) {
    fab.classList.add('show');
  } else {
    fab.classList.remove('show');
  }
});

fab.addEventListener('click', () => {
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    const offsetTop = contactSection.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
    
    // Add visual feedback
    fab.style.transform = 'scale(0.9)';
    setTimeout(() => {
      fab.style.transform = 'scale(1)';
    }, 150);
  }
});

// Cursor blink effect for hero (optional enhancement)
function addCursorEffect() {
  const heroTagline = document.querySelector('.hero-tagline');
  if (heroTagline) {
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
      .hero-tagline::after {
        content: '|';
        animation: blink 1s step-end infinite;
        margin-left: 2px;
        opacity: 0.7;
      }
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
    `;
    // Uncomment to enable cursor effect
    // document.head.appendChild(cursorStyle);
  }
}

// Call on load if desired
// addCursorEffect();

// Enhanced Project Card Hover Effect with 3D tilt
const projectCards = document.querySelectorAll('.project-card');

if (window.innerWidth > 768) {
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    
    // Add subtle 3D tilt effect
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;
      
      this.style.transform = `translateY(-10px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
  });
} else {
  // Mobile: simple hover effect
  projectCards.forEach(card => {
    card.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
    });
    
    card.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
  });
}

// Enhanced Skill Tags Animation - removed to use CSS hover instead
// The new design uses pure CSS transitions for better performance

// Add magnetic effect to buttons (subtle)
function addMagneticEffect() {
  const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary');
  
  magneticElements.forEach(el => {
    el.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const moveX = x * 0.15;
      const moveY = y * 0.15;
      
      this.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    el.addEventListener('mouseleave', function() {
      this.style.transform = 'translate(0, 0)';
      this.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    
    el.addEventListener('mouseenter', function() {
      this.style.transition = 'none';
    });
  });
}

// Initialize magnetic effect on desktop
if (window.innerWidth > 768) {
  setTimeout(addMagneticEffect, 1000);
}

// Add gradient animation to hero name on load
function animateHeroGradient() {
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gradientShift {
        0%, 100% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
      }
      .hero-name {
        background-size: 200% 200%;
        animation: gradientShift 8s ease infinite;
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize gradient animation
animateHeroGradient();

// Enhanced page load animation
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);
  
  // Trigger hero animations
  const heroElements = document.querySelectorAll('.hero .fade-in, .hero .fade-in-up');
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.style.animationPlayState = 'running';
    }, index * 100);
  });
  
  // Animate stats counters
  setTimeout(() => {
    animateStatsCounters();
  }, 1000);
});

// Animated counter for hero stats
function animateStatsCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        stat.textContent = Math.floor(current).toString();
        requestAnimationFrame(updateCounter);
      } else {
        stat.textContent = target.toString() + (target >= 50 ? '+' : '');
      }
    };
    
    updateCounter();
  });
}

// Performance Optimization: Throttle scroll events
function throttle(func, wait = 16) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}

// Apply throttle to scroll handler for better performance
const throttledScrollHandler = throttle(() => {
  updateActiveNavLink();
}, 100);

window.addEventListener('scroll', throttledScrollHandler);

// Add scroll progress indicator
function addScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #22D3EE, #3B82F6);
    z-index: 10000;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// Initialize scroll progress
addScrollProgress();

// Lazy load images with fade-in effect
function loadImage(img) {
  const src = img.getAttribute('data-src');
  if (src) {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    img.src = src;
    img.onload = () => {
      img.style.opacity = '1';
      img.removeAttribute('data-src');
    };
  }
}

const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadImage(entry.target);
      imageObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '50px' });

images.forEach(img => imageObserver.observe(img));

// Add custom cursor effect (optional - modern touch)
function addCustomCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `
    .custom-cursor {
      width: 20px;
      height: 20px;
      border: 2px solid var(--color-primary);
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: width 0.2s, height 0.2s, border-color 0.2s;
      mix-blend-mode: difference;
    }
    .custom-cursor.hover {
      width: 40px;
      height: 40px;
      border-color: var(--color-cyan-400);
    }
  `;
  // Uncomment to enable custom cursor
  // document.head.appendChild(cursorStyle);
  // document.body.appendChild(cursor);
  // document.addEventListener('mousemove', (e) => {
  //   cursor.style.left = e.clientX + 'px';
  //   cursor.style.top = e.clientY + 'px';
  // });
}

// Initialize on desktop only
if (window.innerWidth > 768) {
  // addCustomCursor();
}

// Add section reveal animations on scroll
function addSectionReveal() {
  const sections = document.querySelectorAll('.section');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(section);
  });
}

// Initialize section reveals
addSectionReveal();

// Enhanced console greeting for recruiters
setTimeout(() => {
  console.clear();
  console.log(
    '%c✨ Hello Recruiter! 👋',
    'font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #22D3EE, #3B82F6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; padding: 12px 0;'
  );
  console.log(
    '%cThanks for exploring my portfolio. Built with modern web technologies.\nI\'d love to connect and discuss opportunities!',
    'font-size: 14px; color: #9CA3AF; line-height: 1.8; padding: 8px 0;'
  );
  console.log(
    '%c\n📧 Email: amborukoushik@gmail.com',
    'font-size: 15px; color: #22D3EE; font-weight: 700;'
  );
  console.log(
    '%c🔗 LinkedIn: linkedin.com/in/koushik-amboru',
    'font-size: 15px; color: #22D3EE; font-weight: 700;'
  );
  console.log(
    '%c💻 GitHub: github.com/koushikamboru',
    'font-size: 15px; color: #22D3EE; font-weight: 700;'
  );
  console.log(
    '%c\n🚀 Tech Stack: Flutter, React, Next.js, Node.js, AWS, Firebase',
    'font-size: 13px; color: #6B7280; font-style: italic; padding: 8px 0;'
  );
  console.log(
    '%c✨ Portfolio redesigned with inspiration from modern web aesthetics',
    'font-size: 12px; color: #4B5563; padding: 4px 0;'
  );
}, 500);