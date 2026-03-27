import EmblaCarousel from 'embla-carousel';

export default async function decorate(block) {
  if (!block.classList.contains('is-carousel')) {
    return;
  }

  const originalChildren = [...block.children];

  const viewport = document.createElement('div');
  viewport.className = 'embla-viewport';

  const container = document.createElement('div');
  container.className = 'embla-container';

  originalChildren.forEach((child) => {
    const slide = document.createElement('div');
    slide.className = 'embla-slide';
    slide.appendChild(child);
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

  block.textContent = '';
  block.append(viewport, prevButton, nextButton);

  const embla = EmblaCarousel(viewport, {
    loop: false,
    align: 'start',
    slidesToScroll: 1,
  });

  prevButton.addEventListener('click', () => embla.scrollPrev());
  nextButton.addEventListener('click', () => embla.scrollNext());

  const updateButtons = () => {
    prevButton.disabled = !embla.canScrollPrev();
    nextButton.disabled = !embla.canScrollNext();
  };

  embla.on('init', updateButtons);
  embla.on('reInit', updateButtons);
  embla.on('select', updateButtons);

  updateButtons();
}
