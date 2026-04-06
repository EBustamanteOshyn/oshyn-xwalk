import EmblaCarousel from '../../scripts/vendor/embla-carousel.esm.js';

function transformCardImageToBackground(card) {
  const imageWrapper = card.querySelector(':scope > div:first-child');
  const img = imageWrapper?.querySelector('img');

  if (!img) {
    return;
  }

  const src = img.getAttribute('src');
  if (!src) {
    return;
  }

  const bg = document.createElement('div');
  bg.className = 'card-bg';
  bg.style.backgroundImage = `url("${src}")`;

  const content = document.createElement('div');
  content.className = 'card-content';

  const children = [...card.children];

  children.forEach((child, index) => {
    if (index !== 0) {
      content.appendChild(child);
    }
  });

  bg.appendChild(content);
  card.replaceChildren(bg);
}

export default function decorate(block) {
  const cardItems = [...block.children];

  if (!cardItems.length) {
    return;
  }

  const viewport = document.createElement('div');
  viewport.className = 'embla-viewport';

  const container = document.createElement('div');
  container.className = 'embla-container';

  cardItems.forEach((card) => {
    transformCardImageToBackground(card);

    const slide = document.createElement('div');
    slide.className = 'embla-slide';
    slide.appendChild(card);
    container.appendChild(slide);
  });

  viewport.appendChild(container);

  const prevButton = document.createElement('button');
  prevButton.className = 'embla-prev';
  prevButton.type = 'button';
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.textContent = 'Prev';

  const nextButton = document.createElement('button');
  nextButton.className = 'embla-next';
  nextButton.type = 'button';
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.textContent = 'Next';

  block.replaceChildren(viewport, prevButton, nextButton);

  const embla = EmblaCarousel(viewport, {
    align: 'start',
    loop: false,
    slidesToScroll: 1,
  });

  const updateButtons = () => {
    prevButton.disabled = !embla.canScrollPrev();
    nextButton.disabled = !embla.canScrollNext();
  };

  prevButton.addEventListener('click', () => embla.scrollPrev());
  nextButton.addEventListener('click', () => embla.scrollNext());

  updateButtons();
  embla.on('init', updateButtons);
  embla.on('reInit', updateButtons);
  embla.on('select', updateButtons);

  console.log('Embla initialized');
  console.log('Slides:', container.children.length);
}
