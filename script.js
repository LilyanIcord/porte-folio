(function () {
  'use strict';

  var themeToggle = document.getElementById('theme-toggle');
  var menuToggle = document.getElementById('menu-toggle');
  var navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
  var sections = document.querySelectorAll('.main-content .section[id]');

  /* Lien actif selon la section visible au scroll */
  function setActiveNavLink() {
    var viewportMid = window.innerHeight * 0.35;
    var currentId = '';

    sections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      if (rect.top <= viewportMid && rect.bottom >= viewportMid) {
        currentId = section.getAttribute('id') || '';
      }
    });

    if (!currentId && sections.length) {
      var first = sections[0];
      var firstRect = first.getBoundingClientRect();
      if (firstRect.bottom > 0) {
        currentId = first.getAttribute('id') || '';
      }
    }

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      var id = href.indexOf('#') === 0 ? href.slice(1) : '';
      link.classList.toggle('active', id === currentId);
    });
  }

  window.addEventListener('scroll', setActiveNavLink);
  window.addEventListener('resize', setActiveNavLink);
  setActiveNavLink();

  /* Persistance du thème (localStorage) */
  if (themeToggle) {
    try {
      if (window.localStorage && localStorage.getItem('portfolio-theme') === 'light') {
        themeToggle.checked = true;
      }
      themeToggle.addEventListener('change', function () {
        try {
          if (window.localStorage) {
            localStorage.setItem('portfolio-theme', themeToggle.checked ? 'light' : 'dark');
          }
        } catch (e) {
          // Si l'accès au localStorage est bloqué, on ignore simplement.
        }
      });
    } catch (e) {
      // Si localStorage est désactivé (mode navigation ou politique de sécurité),
      // on n'utilise simplement pas la persistance du thème.
    }
  }

  /* Fermer le menu mobile au clic sur un lien (optionnel) */
  if (menuToggle && navLinks.length) {
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 900px)').matches) {
          menuToggle.checked = false;
        }
      });
    });
  }

  /* Effet d'apparition au scroll pour les éléments .reveal */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal-visible');
              obs.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15
        }
      );

      revealEls.forEach(function (el, index) {
        el.style.transitionDelay = (index * 0.08) + 's';
        observer.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add('reveal-visible');
      });
    }
  }
})();
