import EmblaCarousel from '../../scripts/vendor/embla-carousel.esm.js';

export default function decorate(block) {
  const cardItems = [...block.children];

  if (!cardItems.length) {
    return;
  }

  const viewport = document.createElement('div');
  viewport.className = 'embla-viewport';

  const container = document.createElement('div');
  container.className = 'embla-container';

  cardItems.forEach((item) => {
    const slide = document.createElement('div');
    slide.className = 'embla-slide';
    slide.appendChild(item);
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
    loop: false,
    align: 'start',
    slidesToScroll: 1,
  });

  const updateButtons = () => {
    prevButton.disabled = !embla.canScrollPrev();
    nextButton.disabled = !embla.canScrollNext();
  };

  prevButton.addEventListener('click', () => embla.scrollPrev());
  nextButton.addEventListener('click', () => embla.scrollNext());

  updateButtons();
  embla.on('select', updateButtons);
  embla.on('reInit', updateButtons);
}
