import './style.css'

// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
  if (cursor && follower) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Smooth follow
    setTimeout(() => {
      follower.style.left = e.clientX + 'px';
      follower.style.top = e.clientY + 'px';
    }, 100);
  }
});

// Hover effect for links and buttons
const interactables = document.querySelectorAll('a, button, .project-card, .faq-item');
interactables.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('active');
    follower.classList.add('active');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
    follower.classList.remove('active');
  });
});


// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const body = document.body;

if (menuToggle && mobileMenu) {
  const setMenuState = (isOpen) => {
    menuToggle.classList.toggle('active', isOpen);
    mobileMenu.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    body.style.overflow = isOpen ? 'hidden' : '';
  };

  menuToggle.addEventListener('click', () => {
    setMenuState(!mobileMenu.classList.contains('active'));
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
      setMenuState(false);
      menuToggle.focus();
    }
  });
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  
  btn.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    
    // Close all
    faqItems.forEach(i => {
      i.classList.remove('active');
      i.querySelector('.icon').textContent = '+';
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    
    // Toggle current
    if (!isActive) {
      item.classList.add('active');
      item.querySelector('.icon').textContent = '−';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// Scroll Animations (Intersection Observer)
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-up, .reveal-text').forEach(el => {
  observer.observe(el);
});

// Form Submission (WhatsApp Integration)
const leadForm = document.getElementById('lead-form');
if (leadForm) {
  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const company = document.getElementById('company').value;
    const details = document.getElementById('details').value;
    
    // Get checked needs
    const needsChecked = Array.from(document.querySelectorAll('input[name="needs"]:checked')).map(cb => cb.value).join(', ');
    
    // Get selected budget
    const budgetChecked = document.querySelector('input[name="budget"]:checked');
    const budget = budgetChecked ? budgetChecked.value : 'Not specified';
    
    const message = `Hello VELOQ, I would like to submit a project inquiry:
    
Name: ${name}
Phone: ${phone}
Email: ${email}
Company: ${company || 'N/A'}
Needs: ${needsChecked || 'N/A'}
Budget: ${budget}
Details: ${details}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/923081110707?text=${encodedMessage}`;
    
    const opened = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    const status = document.getElementById('form-status');
    if (!opened) {
      status.textContent = 'Please allow pop-ups to continue your inquiry on WhatsApp.';
      return;
    }

    const btn = leadForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'INQUIRY SENT ✓';
    btn.classList.add('success');
    status.textContent = 'Your inquiry is ready in WhatsApp. We look forward to hearing from you.';
    
    setTimeout(() => {
      leadForm.reset();
      btn.innerHTML = originalText;
      btn.classList.remove('success');
    }, 3000);
  });
}
