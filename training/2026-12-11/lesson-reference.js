(() => {
  const host = document.querySelector('.reference-stage-host');
  const frames = new Map();
  let manifest;
  let mount;
  let frame;
  let range;
  let bounds;
  let activeIndex = -1;
  let entryDirection;
  let entering;
  let requested;
  let timer;
  let fullscreen = false;
  let changeSession;
  let updateToc;

  function send(data, target = frame) {
    target?.contentWindow?.postMessage(data, location.origin);
  }

  function setStatus(text) {
    if (!mount) return;
    const status = mount.querySelector('[role="status"]');
    status.textContent = text;
    status.hidden = !text;
  }

  function unavailable() {
    clearTimeout(timer);
    entering = false;
    if (frame) {
      frames.delete(range.module);
      frame.remove();
      frame = undefined;
    }
    setStatus('웹교재를 불러오지 못했습니다.');
  }

  function synchronize(items) {
    const original = frame.contentDocument?.querySelector('#phycomStage')?.contentDocument;
    const pages = [...(original?.querySelectorAll('main.wrap > .slide') ?? [])];
    const first = pages.findIndex(page => page.matches(range.firstPage));
    const last = pages.findIndex(page => page.matches(range.lastPage));
    if (first < 0 || last < first || pages.length !== items.length) {
      unavailable();
      return;
    }
    bounds = { first, last };
    const index = items.findIndex(item => item.active);
    if (index < 0) return;

    if (entering) {
      const destination = entryDirection < 0 ? last : first;
      if ((!requested && index !== destination) || index < first || index > last) {
        if (!requested || index < first || index > last) {
          requested = true;
          send({ type: 'info-jump', index: destination });
        }
        return;
      }
      entering = false;
      clearTimeout(timer);
      frame.style.visibility = 'visible';
      setStatus('');
      send({ type: 'info-fullscreen', on: fullscreen });
    } else if (index < first || index > last) {
      if (first === last) send({ type: 'info-jump', index: first });
      else changeSession(index < first ? -1 : 1);
      return;
    }
    activeIndex = index;
    updateToc(items.slice(first, last + 1).map((item, offset) => ({ ...item, index: first + offset })));
  }

  function getFrame(references, module) {
    const existing = frames.get(module);
    if (existing) return existing;
    const base = new URL(references.publishedBase, location.href);
    const stage = new URL(references.stage, base);
    stage.searchParams.set('lesson', new URL(references.modules[module].entry, base).href);
    stage.searchParams.set('embedded', '1');
    stage.searchParams.set('view', 'content');
    stage.searchParams.set('student', '1');

    const next = document.createElement('iframe');
    next.allow = 'autoplay; fullscreen';
    next.allowFullscreen = true;
    next.hidden = true;
    next.src = stage.href;
    frames.set(module, next);
    host.append(next);
    return next;
  }

  async function show(page, direction = 0) {
    const target = page.querySelector('[data-lesson-source]');
    if (target === mount) return;
    clearTimeout(timer);
    const previous = frame;
    frame = undefined;
    range = undefined;
    bounds = undefined;
    activeIndex = -1;
    mount = target;
    entering = true;
    requested = false;
    entryDirection = direction;
    if (!target) {
      if (previous) {
        send({ type: 'info-pause' }, previous);
        previous.hidden = true;
      }
      return;
    }

    setStatus('웹교재를 불러오는 중입니다.');
    if (previous) previous.style.visibility = 'hidden';
    try {
      manifest ??= fetch('./lesson-references.json').then(response => {
        if (!response.ok) throw new Error('Lesson references are unavailable');
        return response.json();
      }).catch(error => {
        manifest = undefined;
        throw error;
      });
      const references = await manifest;
      if (mount !== target) return;
      range = references.sessions[target.dataset.lessonSource];
      frame = getFrame(references, range.module);
      if (previous && previous !== frame) {
        send({ type: 'info-pause' }, previous);
        previous.hidden = true;
      }
      frame.title = page.querySelector('h2').textContent;
      frame.style.visibility = 'hidden';
      frame.hidden = false;
      timer = setTimeout(unavailable, 18000);
      send({ type: 'info-report' });
    } catch {
      if (mount === target) unavailable();
    }
  }

  window.addEventListener('message', event => {
    if (!frame || event.source !== frame.contentWindow || event.origin !== location.origin) return;
    if (event.data?.type === 'info-toc') synchronize(event.data.items);
    if (event.data?.type === 'info-boundary' && bounds) {
      const direction = event.data.direction;
      if ((direction === -1 && activeIndex === bounds.first) ||
          (direction === 1 && activeIndex === bounds.last)) changeSession(direction);
    }
  });
  window.infoShell = { fullscreen: () => window.infoFullscreen.toggle() };
  window.trainingReference = {
    bind({ onBoundary, onToc }) {
      changeSession = onBoundary;
      updateToc = onToc;
    },
    show,
    move(direction) {
      if (!mount || (!frame && !entering)) return false;
      if (!entering) send({ type: 'info-key', key: direction < 0 ? 'ArrowLeft' : 'ArrowRight' });
      return true;
    },
    jump(index) {
      if (bounds && index >= bounds.first && index <= bounds.last) send({ type: 'info-jump', index });
    },
    setFullscreen(on) {
      fullscreen = on;
      if (!entering) send({ type: 'info-fullscreen', on });
    },
  };
})();
