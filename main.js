/* ============================================================
   THIS IS HAMILTON — main.js
   A city speaking for itself.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Navigation Scroll Effect ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  /* ---------- Mobile Menu ---------- */
  const toggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('nav__toggle--active');
      mobileMenu.classList.toggle('mobile-menu--active');
      document.body.style.overflow = mobileMenu.classList.contains('mobile-menu--active') ? 'hidden' : '';
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('nav__toggle--active');
        mobileMenu.classList.remove('mobile-menu--active');
        document.body.style.overflow = '';
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--active')) {
        toggle.classList.remove('nav__toggle--active');
        mobileMenu.classList.remove('mobile-menu--active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Scroll Reveal Animation ---------- */
  var revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all elements
    revealElements.forEach(function (el) {
      el.classList.add('reveal--visible');
    });
  }

  /* ---------- Counter Animation ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easedProgress = easeOutQuart(progress);
      var current = Math.floor(easedProgress * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  /* ---------- Lazy Loading Images ---------- */
  var lazyImages = document.querySelectorAll('img[data-src]');
  if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
    var imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.getAttribute('data-src');
          if (img.getAttribute('data-srcset')) {
            img.srcset = img.getAttribute('data-srcset');
          }
          img.removeAttribute('data-src');
          img.removeAttribute('data-srcset');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px'
    });

    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  } else {
    // Fallback: load all images immediately
    lazyImages.forEach(function (img) {
      img.src = img.getAttribute('data-src');
      if (img.getAttribute('data-srcset')) {
        img.srcset = img.getAttribute('data-srcset');
      }
    });
  }

  /* ---------- Parallax Effect on Hero ---------- */
  var heroBg = document.querySelector('.hero__bg');
  if (heroBg && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('scroll', function () {
      var scrolled = window.pageYOffset;
      var rate = scrolled * 0.3;
      heroBg.style.transform = 'translateY(' + rate + 'px)';
    }, { passive: true });
  }

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var navHeight = nav ? nav.offsetHeight : 0;
        var targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ---------- Active Navigation Link ---------- */
  var navLinks = document.querySelectorAll('.nav__link[data-section]');
  if (navLinks.length > 0) {
    var sections = [];
    navLinks.forEach(function (link) {
      var sectionId = link.getAttribute('data-section');
      var section = document.getElementById(sectionId);
      if (section) sections.push({ link: link, section: section });
    });

    if (sections.length > 0) {
      window.addEventListener('scroll', function () {
        var scrollPos = window.pageYOffset + 200;
        sections.forEach(function (item) {
          var top = item.section.offsetTop;
          var bottom = top + item.section.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) {
            navLinks.forEach(function (l) { l.classList.remove('nav__link--active'); });
            item.link.classList.add('nav__link--active');
          }
        });
      }, { passive: true });
    }
  }

  /* ---------- Back to Top ---------- */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 600) {
        backToTop.classList.add('back-to-top--visible');
      } else {
        backToTop.classList.remove('back-to-top--visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Image Error Handling ---------- */
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      this.style.backgroundColor = '#2a2a4a';
      this.style.minHeight = '200px';
      this.alt = this.alt || 'Image of Hamilton, Ontario';
    });
  });

})();
