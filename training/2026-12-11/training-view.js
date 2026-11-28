(() => {
  const reader = document.getElementById('training-reader');
  const moduleId = reader.dataset.module;
  const lessons = moduleId === 'lessons';
  const params = new URLSearchParams(location.search);
  const pages = [...reader.querySelectorAll('.training-content > .slide')].filter(page =>
    !page.dataset.demo || page.dataset.demo === params.get('demo'));
  const demoIndex = pages.findIndex(page => page.dataset.demo);
  const viewport = reader.querySelector('.training-viewport');
  const titles = pages.map(page => [...page.querySelector('h1,h2').childNodes]
    .map(node => node.textContent.trim()).filter(Boolean).join(' '));
  const titleIcons = {
    calendar: 'M4 5h16a1 1 0 0 1 1 1v14H3V6a1 1 0 0 1 1-1z M7 3v4m10-4v4M3 10h18M7 14h2m3 0h2m3 0h1M7 17h2m3 0h2',
    question: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z M9.2 9a2.8 2.8 0 1 1 4.4 2.3c-1 .7-1.6 1.2-1.6 2.7m0 3h.01',
    compass: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z M15.7 8.3l-2 5.4-5.4 2 2-5.4z',
    puzzle: 'M3 4h6a2 2 0 0 1 4 0h6v5a2 2 0 1 1 0 4v7h-6a2 2 0 1 0-4 0H3v-6a2 2 0 1 0 0-4z',
    growth: 'M3 19h18M4 16l5-6 4 3 7-8m-6 0h6v6',
    roadmap: 'M6 5h12a3 3 0 0 1 0 6H7a3 3 0 1 0 0 6h11m-3-3 3 3-3 3M6 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
    cycle: 'M20 10a8 8 0 0 0-13-5L4 8m0-5v5h5m-5 6a8 8 0 0 0 13 5l3-3m0 5v-5h-5',
    book: 'M12 6c-2-2-5-3-9-2v14c4-1 7 0 9 2 2-2 5-3 9-2V4c-4-1-7 0-9 2zm0 0v14',
    bulb: 'M9 18v-2c0-1.6-3-3.2-3-6a6 6 0 1 1 12 0c0 2.8-3 4.4-3 6v2z M10 21h4',
    music: 'M9 17V6l11-2v11M9 9l11-2M9 17c0 1.3-1.5 2-3 2s-2-.6-2-1.5S5.2 16 7 16c.8 0 1.5.3 2 1zm11-2c0 1.3-1.5 2-3 2s-2-.6-2-1.5 1.2-1.5 3-1.5c.8 0 1.5.3 2 1z',
    sign: 'M12 3v18M4 6h13l3 3-3 3H4zm3 7-3 3 3 3h11v-6z',
    alert: 'M4 18h16l-2-3v-4a6 6 0 0 0-12 0v4zm6 3h4M12 2v3m-8 1L2 8m18-2 2 2',
    scarecrow: 'M12 13v9M3 13h18l-2 5-3-1-4 2-4-2-3 1zM6 8h12m-9 0 1-5h4l1 5m-6 0v2a3 3 0 1 0 6 0V8',
    code: 'M3 5h18v14H3zM3 8h18m-12 3-2 2.5L9 16m6-5 2 2.5-2 2.5m-2-5-2 5',
    checklist: 'M8 5H5v16h14V5h-3m-8 1V3h8v3zM8 11l1 1 2-2m2 1h3m-8 5 1 1 2-2m2 1h3',
    ai: 'M5 16l3-8 3 8M6 13h4m5-5h4m-2 0v8m-2 0h4M3 5h18v14H3z',
    share: 'M8 11l8-4m-8 6 8 4M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm13-6a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z',
    dial: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z M12 12l4-4m-4-2v1m-6 5h1m10 0h1m-6 5v1',
    moon: 'M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z',
    rotation: 'M20 10a8 8 0 1 0-1.3 7M20 4v6h-6',
    waves: 'M5 9a4.2 4.2 0 0 1 0 6m3-9a8.5 8.5 0 0 1 0 12m3-15a12.7 12.7 0 0 1 0 18M3 12h.01',
  };
  const svgNamespace = 'http://www.w3.org/2000/svg';
  for (const heading of reader.querySelectorAll('[data-title-icon]')) {
    const icon = document.createElementNS(svgNamespace, 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('aria-hidden', 'true');
    const line = document.createElementNS(svgNamespace, 'path');
    line.setAttribute('d', titleIcons[heading.dataset.titleIcon]);
    icon.append(line);
    heading.prepend(icon);
  }

  const catalogue = [
    { id: 'icebreaker', name: '아이스브레이킹' },
    { id: 'slides', name: '연수 슬라이드', path: './slides.html' },
    { id: 'lessons', name: '11차시 수업자료', path: './lessons.html' },
    { id: 'practice', name: '2부 실습자료 공유' },
  ].map(item => ({ ...item, unit: 'understand', enabled: true }));
  const reference = window.trainingReference;
  let current = 0;
  let tocOpen = lessons;
  let fullscreen = false;

  const sidebar = document.createElement('aside');
  sidebar.className = 'slide-sidebar';
  sidebar.id = 'training-toc';
  sidebar.setAttribute('aria-label', '목차');
  const title = document.createElement('h2');
  title.className = 'slide-sidebar-title';
  title.textContent = '목차';
  const list = document.createElement('div');
  list.id = 'slideSidebarList';
  sidebar.append(title, list);
  const tocButtons = titles.map((text, index) => {
    const button = document.createElement('button');
    const number = document.createElement('span');
    const label = document.createElement('span');
    button.type = 'button';
    button.className = 'slide-sidebar-item';
    number.className = 'sidebar-page-no';
    number.textContent = lessons && index === 0 ? '↳' : String(lessons ? index : index + 1);
    number.setAttribute('aria-hidden', 'true');
    label.textContent = lessons && index === 0 ? '학습 로드맵' : text;
    if (index === demoIndex) button.hidden = true;
    if (index > 0 || !lessons) {
      button.setAttribute('aria-label', `${number.textContent}${lessons ? '차시' : '페이지'} ${text}`);
    }
    button.append(number, label);
    button.addEventListener('click', () => show(index));
    list.append(button);
    return button;
  });
  reader.prepend(sidebar);

  const subToc = document.createElement('nav');
  subToc.className = 'reference-toc';
  subToc.setAttribute('aria-label', '차시별 웹교재 목차');
  function showReferenceToc(items) {
    const children = [...subToc.children];
    if (children.length !== items.length || items.some((item, i) =>
      children[i].dataset.page !== String(item.index) || children[i].textContent !== item.label)) {
      subToc.replaceChildren(...items.map(item => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'slide-sidebar-item';
        button.dataset.page = item.index;
        button.textContent = item.label;
        button.addEventListener('click', () => reference.jump(item.index));
        return button;
      }));
    }
    items.forEach((item, i) => {
      const button = subToc.children[i];
      button.classList.toggle('active', item.active);
      if (item.active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    tocButtons[current].after(subToc);
  }
  reference?.bind({ onBoundary: direction => { if (current !== demoIndex) show(current + direction, direction); }, onToc: showReferenceToc });

  function move(direction) {
    if (!reference?.move(direction)) show(current + direction, direction);
  }

  const tocToggle = document.createElement('button');
  tocToggle.type = 'button';
  tocToggle.className = 'toc-toggle';
  tocToggle.textContent = '목차';
  tocToggle.setAttribute('aria-controls', sidebar.id);
  tocToggle.addEventListener('click', () => {
    tocOpen = !tocOpen;
    syncToc();
  });

  function select(id) {
    const item = catalogue.find(entry => entry.id === id);
    if (!item || item.id === moduleId) return;
    if (!item.path) {
      pendingTitle.textContent = item.name;
      pending.showModal();
    } else if (window.parent === window) {
      location.assign(item.path);
    } else {
      window.parent.postMessage({ type: 'training-open', id }, location.origin);
    }
  }

  async function renderHomeChoices(onSelect, items) {
    try {
      const response = await fetch('./index.html');
      if (!response.ok) throw new Error('Training home unavailable');
      const home = new DOMParser().parseFromString(await response.text(), 'text/html');
      const cards = home.querySelector('.cards');
      const art = home.querySelector('.art-source');
      if (!cards || !art) throw new Error('Training shortcuts unavailable');
      const content = document.createElement('div');
      content.className = 'shortcut-cards';
      content.append(art, cards);
      for (const item of items) {
        const card = cards.querySelector(`.card.${item.id}`);
        if (!card) throw new Error('Training shortcut unavailable');
        card.dataset.module = item.id;
      }
      cards.addEventListener('click', event => {
        const card = event.target.closest('[data-module]');
        if (!card || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        onSelect(card.dataset.module);
      });
      return content;
    } catch {
      return window.phycomNavigation.choices(onSelect, items);
    }
  }

  const navigation = window.phycomNavigation.create({
    catalogue,
    renderChoices: renderHomeChoices,
    home() {
      if (window.parent === window) location.assign('./');
      else window.parent.postMessage('phycom-home', location.origin);
    },
    previous: () => move(-1),
    next: () => move(1),
    select,
    fullscreen: () => window.infoFullscreen.toggle(),
  });
  const nav = navigation.element;
  const previous = nav.querySelector('[data-action="previous"]');
  const next = nav.querySelector('[data-action="next"]');
  const fullscreenButton = nav.querySelector('[data-action="fullscreen"]');
  nav.querySelector('.lesson-navigation-controls').append(nav.querySelector('.module-panel'));
  nav.prepend(tocToggle);
  reader.append(nav);

  const pending = document.createElement('dialog');
  pending.className = 'training-pending';
  pending.setAttribute('aria-labelledby', 'training-pending-title');
  pending.innerHTML = '<h2 id="training-pending-title"></h2><p>준비 중인 메뉴입니다.</p><form method="dialog"><button autofocus>확인</button></form>';
  const pendingTitle = pending.querySelector('h2');
  reader.append(pending);

  function syncToc() {
    const visible = tocOpen && !fullscreen;
    sidebar.hidden = !visible;
    tocToggle.hidden = fullscreen;
    tocToggle.setAttribute('aria-label', visible ? '목차 접기' : '목차 펼치기');
    tocToggle.setAttribute('aria-expanded', String(visible));
    reader.toggleAttribute('data-toc-open', visible);
  }

  function show(index, direction = 0) {
    const prior = current;
    current = Math.max(0, Math.min(index, pages.length - 1));
    pages.forEach((page, i) => {
      page.hidden = current !== i;
      const button = tocButtons[i];
      button.classList.toggle('active', i === current);
      if (i === current) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    if (tocOpen && !fullscreen) tocButtons[current].scrollIntoView({ block: 'nearest' });
    const start = lessons ? 1 : 0;
    navigation.update(moduleId, pages.slice(start, demoIndex < 0 ? pages.length : demoIndex).map((page, i) => ({ active: i + start === current })));
    if (prior !== current) subToc.remove();
    reference?.show(pages[current], direction);
    previous.disabled = current === 0 || current === demoIndex;
    next.disabled = current === (demoIndex < 0 ? pages.length - 1 : demoIndex - 1) || current === demoIndex;
  }

  viewport.addEventListener('click', event => {
    const button = event.target.closest('button[data-jump]');
    if (!button) return;
    show(Number(button.dataset.jump));
    pages[current].querySelector('h1,h2').focus();
  });
  window.infoFullscreen.subscribe(on => {
    fullscreen = on;
    reference?.setFullscreen(on);
    fullscreenButton.setAttribute('aria-pressed', String(on));
    fullscreenButton.setAttribute('aria-label', on ? '전체화면 종료' : '전체화면');
    fullscreenButton.title = on ? '전체화면 종료' : '전체화면';
    syncToc();
  });
  document.addEventListener('keydown', event => {
    if (pending.open || event.defaultPrevented || event.target.closest?.('input,select,textarea,[contenteditable]')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Escape' && fullscreen && !document.fullscreenElement) {
      window.infoFullscreen.toggle();
    }
  });
  if (!lessons) {
    new ResizeObserver(() => {
      const scale = viewport.clientWidth / document.documentElement.clientWidth;
      reader.style.setProperty('--training-scale', String(scale));
    }).observe(viewport);
  }
  syncToc();
  window.infoFullscreen.sync();
  const requested = lessons ? Number(params.get('session')) : Number(params.get('page')) - 1;
  const end = demoIndex < 0 ? pages.length : demoIndex;
  show(demoIndex < 0 ? (Number.isInteger(requested) && requested >= 0 && requested < end ? requested : 0) : demoIndex);
})();
