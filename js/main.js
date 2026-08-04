/**
 * BITZA EXPORTS — GLOBAL JAVASCRIPT & INTERACTION CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sticky Navigation & Scroll Header ---
  const header = document.getElementById('mainHeader');
  const scrollThreshold = 40;

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      header?.classList.add('scrolled');
      document.body.classList.add('page-scrolled');
    } else {
      header?.classList.remove('scrolled');
      document.body.classList.remove('page-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- 2. Mobile Drawer Menu & Backdrop ---
  const burgerBtn = document.getElementById('burgerBtn');
  const mobilePanel = document.getElementById('mobilePanel');
  
  let backdrop = document.querySelector('.mobile-nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    document.body.appendChild(backdrop);
  }

  const closeMenu = () => {
    if (burgerBtn) {
      burgerBtn.classList.remove('active');
      burgerBtn.setAttribute('aria-expanded', 'false');
      burgerBtn.setAttribute('aria-label', 'Open navigation menu');
    }
    if (mobilePanel) {
      mobilePanel.classList.remove('open');
    }
    if (backdrop) {
      backdrop.classList.remove('open');
    }
    document.body.classList.remove('overflow-hidden');
  };

  const openMenu = () => {
    if (burgerBtn) {
      burgerBtn.classList.add('active');
      burgerBtn.setAttribute('aria-expanded', 'true');
      burgerBtn.setAttribute('aria-label', 'Close navigation menu');
    }
    if (mobilePanel) {
      mobilePanel.classList.add('open');
    }
    if (backdrop) {
      backdrop.classList.add('open');
    }
    document.body.classList.add('overflow-hidden');
  };

  if (burgerBtn && mobilePanel) {
    burgerBtn.setAttribute('aria-label', 'Open navigation menu');
    burgerBtn.setAttribute('aria-expanded', 'false');

    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobilePanel.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }

    mobilePanel.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobilePanel.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // --- 3. Smooth Anchor Scrolling for Internal Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 80;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // --- 4. Enhanced Staggered Scroll Reveal Observer ---
  const revealElements = document.querySelectorAll(
    '.reveal-up, .journey-step-card, .product-range-card, .why-value-item, ' +
    '.product-item-card, .distributor-benefit-card, .distributor-trust-card, ' +
    '.contact-detail-card, .enquiry-form-card, .b2b-cta-card, .cat-block-header'
  );
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          
          // Calculate stagger delay if part of a grid or stack
          const parent = el.parentElement;
          if (parent && (parent.classList.contains('products-3col-grid') || 
                         parent.classList.contains('distributor-benefits-grid') || 
                         parent.classList.contains('distributor-trust-grid') || 
                         parent.classList.contains('contact-cards-stack') ||
                         parent.classList.contains('grid-3') ||
                         parent.classList.contains('grid-4'))) {
            const index = Array.from(parent.children).indexOf(el);
            el.style.transitionDelay = `${(index % 3) * 110}ms`;
          }

          el.classList.add('revealed');
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) scale(1)';
          observer.unobserve(el);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(element => {
      if (!element.classList.contains('revealed')) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(28px) scale(0.985)';
        element.style.transition = 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease';
        revealObserver.observe(element);
      }
    });
  } else {
    // Fallback if IntersectionObserver is not available
    revealElements.forEach(element => {
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
  }

  // --- 5. Language Selector Dropdown Interaction ---
  const langSelector = document.querySelector('.lang-selector');
  if (langSelector) {
    langSelector.addEventListener('click', () => {
      const currentLang = langSelector.querySelector('span');
      if (currentLang) {
        currentLang.textContent = currentLang.textContent === 'EN' ? 'FR' : 'EN';
      }
    });
  }
});


// Products Page Category Filter System
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.cat-filter-btn');
  const catBlocks = document.querySelectorAll('.product-category-block');

  if (filterBtns.length > 0 && catBlocks.length > 0) {
    function filterCategory(targetCat) {
      filterBtns.forEach(btn => {
        if (btn.getAttribute('data-filter') === targetCat) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      catBlocks.forEach(block => {
        const blockCat = block.getAttribute('data-category');
        if (targetCat === 'all' || blockCat === targetCat) {
          block.style.display = 'block';
          block.style.opacity = '1';
        } else {
          block.style.display = 'none';
          block.style.opacity = '0';
        }
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.getAttribute('data-filter');
        filterCategory(cat);
      });
    });

    // Check URL parameters for initial category selection (e.g. ?cat=spices)
    const urlParams = new URLSearchParams(window.location.search);
    const initialCat = urlParams.get('cat');
    if (initialCat) {
      filterCategory(initialCat.toLowerCase());
    }
  }
});

// Contact Form Product Pre-selection System
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedProduct = urlParams.get('product') || urlParams.get('subject');
  
  if (selectedProduct) {
    const productSelect = document.getElementById('productInterest');
    const enquiryTypeSelect = document.getElementById('enquiryType');
    
    if (productSelect) {
      const searchVal = selectedProduct.toLowerCase().trim();
      let matched = false;
      
      for (let i = 0; i < productSelect.options.length; i++) {
        const optionVal = productSelect.options[i].value.toLowerCase().trim();
        const optionText = productSelect.options[i].text.toLowerCase().trim();
        
        if (optionVal === searchVal || optionText.includes(searchVal) || searchVal.includes(optionVal)) {
          productSelect.selectedIndex = i;
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        const newOpt = new Option(selectedProduct, selectedProduct, true, true);
        productSelect.add(newOpt);
      }

      if (enquiryTypeSelect && !enquiryTypeSelect.value) {
        enquiryTypeSelect.value = "Product Enquiry";
      }

      const formCard = document.querySelector('.contact-form-card') || document.getElementById('contactForm');
      if (formCard) {
        setTimeout(() => {
          formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 250);
      }
    }
  }
});
