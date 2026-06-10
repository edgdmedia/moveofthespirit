(function () {
  'use strict';

  const PAGE_URL = window.location.href.split('#')[0];
  const SHARE_TEXT = 'The Move of the Spirit 2026 — HolyGhost Meetings at Noble House Christian Centre. His Kingdom. His Power. His Glory.';

  const CALENDAR_EVENTS = [
  {
    id: 'sundays-aug2026',
    title: 'Holyghost Meeting — Sunday Session',
    description: 'The Move of the Spirit 2026. All sessions are livestreamed at https://noblehousechristiancentre.mixlr.com/',
    location: 'Noble House Christian Centre, GreenHall 5, Taiwo Shitta Street, Off Bola Ahmed Tinubu Road, Iju, Lagos',
    dates: [
      ['20260802T073000Z', '20260802T113000Z'],
      ['20260809T073000Z', '20260809T113000Z'],
      ['20260816T073000Z', '20260816T113000Z'],
      ['20260823T073000Z', '20260823T113000Z'],
      ['20260830T073000Z', '20260830T113000Z']
    ]
  },
  {
    id: 'special-friday',
    title: 'Holyghost Meeting — Special Weekend (Friday)',
    description: 'The Move of the Spirit 2026 Special Weekend. Livestream: https://noblehousechristiancentre.mixlr.com/',
    location: 'The Charis Event Centre, Etal Avenue, First Bank Bus Stop, Off Kudirat Abiola Way, Ikeja, Lagos',
    dates: [['20260828T170000Z', '20260828T210000Z']]
  },
  {
    id: 'special-saturday-morning',
    title: 'Holyghost Meeting — Special Weekend (Saturday Morning)',
    description: 'The Move of the Spirit 2026 Special Weekend. Livestream: https://noblehousechristiancentre.mixlr.com/',
    location: 'The Charis Event Centre, Etal Avenue, First Bank Bus Stop, Off Kudirat Abiola Way, Ikeja, Lagos',
    dates: [['20260829T080000Z', '20260829T120000Z']]
  },
  {
    id: 'special-saturday-afternoon',
    title: 'Holyghost Meeting — Special Weekend (Saturday Afternoon)',
    description: 'The Move of the Spirit 2026 Special Weekend. Livestream: https://noblehousechristiancentre.mixlr.com/',
    location: 'The Charis Event Centre, Etal Avenue, First Bank Bus Stop, Off Kudirat Abiola Way, Ikeja, Lagos',
    dates: [['20260829T120000Z', '20260829T160000Z']]
  },
  {
    id: 'special-saturday-evening',
    title: 'Holyghost Meeting — Special Weekend (Saturday Evening)',
    description: 'The Move of the Spirit 2026 Special Weekend. Livestream: https://noblehousechristiancentre.mixlr.com/',
    location: 'The Charis Event Centre, Etal Avenue, First Bank Bus Stop, Off Kudirat Abiola Way, Ikeja, Lagos',
    dates: [['20260829T160000Z', '20260829T200000Z']]
  },
  {
    id: 'closing-sunday',
    title: 'Holyghost Meeting — Closing Sunday',
    description: 'The Move of the Spirit 2026 closing session. Livestream: https://noblehousechristiancentre.mixlr.com/',
    location: 'Noble House Christian Centre, GreenHall 5, Taiwo Shitta Street, Iju, Lagos',
    dates: [['20260831T073000Z', '20260831T113000Z']]
  }
  ];

  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const colors = ['#C8401A', '#E8571E', '#D4870A', '#FF6B35'];
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        bottom:${Math.random() * 30}%;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration:${Math.random() * 8 + 6}s;
        animation-delay:${Math.random() * 8}s;
      `;
      container.appendChild(p);
    }
  }

  function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const open = menu.classList.toggle('open');
    document.getElementById('hamburger').setAttribute('aria-expanded', open);
  }

  function toggleFaq(btn) {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  }

  function buildIcs(event) {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Noble House Christian Centre//HGM 2026//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    event.dates.forEach(([start, end], index) => {
      lines.push(
        'BEGIN:VEVENT',
        `UID:${event.id}-${index}@noblehousecc.org`,
        `DTSTAMP:${formatIcsDate(new Date())}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${escapeIcs(event.title)}`,
        `DESCRIPTION:${escapeIcs(event.description)}`,
        `LOCATION:${escapeIcs(event.location)}`,
        'END:VEVENT'
      );
    });

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  function formatIcsDate(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  function escapeIcs(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  }

  function downloadIcs(eventId) {
    const event = CALENDAR_EVENTS.find((e) => e.id === eventId);
    if (!event) return;
    const blob = new Blob([buildIcs(event)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.id}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function googleCalendarUrl(eventId) {
    const event = CALENDAR_EVENTS.find((e) => e.id === eventId);
    if (!event || !event.dates[0]) return '#';
    const [start, end] = event.dates[0];
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${start.replace(/[-:]/g, '').replace('Z', 'Z')}/${end.replace(/[-:]/g, '').replace('Z', 'Z')}`,
      details: event.description,
      location: event.location
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function showToast(message) {
    const toast = document.getElementById('shareToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  async function sharePage(method) {
    const url = PAGE_URL;
    const text = SHARE_TEXT;

    if (method === 'native' && navigator.share) {
      try {
        await navigator.share({ title: document.title, text, url });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    if (method === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank', 'noopener,noreferrer');
      return;
    }

    if (method === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
      return;
    }

    if (method === 'x') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
      return;
    }

    if (method === 'copy' || method === 'native') {
      try {
        await navigator.clipboard.writeText(url);
        showToast('Link copied to clipboard');
      } catch (err) {
        showToast('Copy this link: ' + url);
      }
    }
  }

  function initScrollUi() {
    const navbar = document.getElementById('navbar');
    const stickyRegister = document.getElementById('stickyRegister');
    const backToTop = document.getElementById('backToTop');
    const hero = document.getElementById('home');

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (navbar) {
        navbar.style.boxShadow = y > 50 ? '0 4px 30px rgba(0,0,0,0.5)' : 'none';
      }
      const pastHero = hero ? y > hero.offsetHeight * 0.6 : y > 400;
      stickyRegister?.classList.toggle('visible', pastHero);
      backToTop?.classList.toggle('visible', y > 600);
    });
  }

  function closeAllCalMenus() {
    document.querySelectorAll('.session-cal-wrap').forEach((wrap) => {
      const trigger = wrap.querySelector('.cal-trigger');
      const menu = wrap.querySelector('.cal-menu');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (menu) menu.hidden = true;
    });
  }

  function initCalendarDropdowns() {
    document.querySelectorAll('.session-cal-wrap').forEach((wrap) => {
      const trigger = wrap.querySelector('.cal-trigger');
      const menu = wrap.querySelector('.cal-menu');
      if (!trigger || !menu) return;

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        closeAllCalMenus();
        if (!isOpen) {
          trigger.setAttribute('aria-expanded', 'true');
          menu.hidden = false;
        }
      });

      menu.addEventListener('click', (e) => e.stopPropagation());
    });

    document.addEventListener('click', closeAllCalMenus);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllCalMenus();
    });
  }

  function initCalendarButtons() {
    document.querySelectorAll('[data-calendar]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-calendar');
        const action = btn.getAttribute('data-calendar-action') || 'ics';
        if (action === 'google') {
          window.open(googleCalendarUrl(id), '_blank', 'noopener,noreferrer');
        } else {
          downloadIcs(id);
        }
        closeAllCalMenus();
      });
    });
  }

  function initShareButtons() {
    document.querySelectorAll('[data-share]').forEach((btn) => {
      btn.addEventListener('click', () => sharePage(btn.getAttribute('data-share')));
    });
  }

  function initEditionTabs() {
    document.querySelectorAll('.edition-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const edition = tab.getAttribute('data-edition');
        document.querySelectorAll('.edition-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('[data-testimony-edition]').forEach((panel) => {
          panel.hidden = panel.getAttribute('data-testimony-edition') !== edition;
        });
      });
    });
  }

  window.toggleMenu = toggleMenu;
  window.toggleFaq = toggleFaq;

  document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initScrollUi();
    initCalendarDropdowns();
    initCalendarButtons();
    initShareButtons();
    initEditionTabs();
  });
})();
