
(() => {
  const body = document.body;
  const menuButton = document.getElementById('hamb');
  const mobileMenu = document.getElementById('mob');
  const desktopNav = window.matchMedia('(min-width: 1081px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const open = !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.addEventListener('click', (event) => {
      if (!event.target.closest('a')) return;
      mobileMenu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    });
  }

  document.querySelectorAll('.drop>button').forEach((button) => {
    button.addEventListener('click', (event) => {
      if (!desktopNav.matches) return;
      const drop = button.closest('.drop');
      const next = !drop.classList.contains('is-open');
      document.querySelectorAll('.drop.is-open').forEach((item) => {
        item.classList.remove('is-open');
        item.querySelector('button')?.setAttribute('aria-expanded','false');
      });
      drop.classList.toggle('is-open', next);
      button.setAttribute('aria-expanded', String(next));
      event.stopPropagation();
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.drop.is-open').forEach((item) => {
      item.classList.remove('is-open');
      item.querySelector('button')?.setAttribute('aria-expanded','false');
    });
  });

  const revealItems = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !reduceMotion.matches && window.matchMedia('(min-width: 761px)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('on');
        observer.unobserve(entry.target);
      });
    }, {threshold:.10});
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('on'));
  }

  document.querySelectorAll('.fi').forEach((item) => {
    const q = item.querySelector('.fq');
    q?.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });

  const links = [...document.querySelectorAll('[data-scrollspy]')];
  const sections = links.map((link) => document.getElementById(link.dataset.scrollspy)).filter(Boolean);
  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.dataset.scrollspy === id;
      link.classList.toggle('is-active', active);
      active ? link.setAttribute('aria-current','true') : link.removeAttribute('aria-current');
    });
  };
  let subnavFrame = 0;
  const updateSubnav = () => {
    subnavFrame = 0;
    body.classList.toggle('subnav-on', window.scrollY > 500);
  };
  window.addEventListener('scroll', () => {
    if (!subnavFrame) subnavFrame = requestAnimationFrame(updateSubnav);
  }, {passive:true});
  updateSubnav();

  if (links.length && sections.length && 'IntersectionObserver' in window) {
    const visibleSections = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry.boundingClientRect.top);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      const active = [...visibleSections.entries()].sort((a, b) => Math.abs(a[1]) - Math.abs(b[1]))[0];
      if (active) setActive(active[0]);
    }, {
      rootMargin: '-22% 0px -62% 0px',
      threshold: [0, .12, .5]
    });

    sections.forEach((section) => observer.observe(section));
  } else if (links.length && sections.length) {
    const setActive = (id) => {
      links.forEach((link) => {
        const active = link.dataset.scrollspy === id;
        link.classList.toggle('is-active', active);
        active ? link.setAttribute('aria-current','true') : link.removeAttribute('aria-current');
      });
    };
    let frame = 0;
    const update = () => {
      frame = 0;
      const marker = window.scrollY + Math.min(230, window.innerHeight * .34);
      let active = sections[0];
      sections.forEach((section) => { if (section.offsetTop <= marker) active = section; });
      if (active) setActive(active.id);
    };
    window.addEventListener('scroll', () => {
      if (!frame) frame = requestAnimationFrame(update);
    }, {passive:true});
    update();
  }
})();
