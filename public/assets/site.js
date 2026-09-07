
(() => {
  const body = document.body;
  const menuButton = document.getElementById('hamb');
  const mobileMenu = document.getElementById('mob');

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
      if (window.innerWidth <= 1080) return;
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
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerWidth > 760) {
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
    const a = item.querySelector('.fa');
    q?.addEventListener('click', () => {
      item.classList.toggle('open');
      a.style.maxHeight = item.classList.contains('open') ? `${a.scrollHeight}px` : '0';
    });
  });

  const links = [...document.querySelectorAll('[data-scrollspy]')];
  const sections = links.map((link) => document.getElementById(link.dataset.scrollspy)).filter(Boolean);
  if (links.length && sections.length) {
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
      body.classList.toggle('subnav-on', window.scrollY > 500);
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
