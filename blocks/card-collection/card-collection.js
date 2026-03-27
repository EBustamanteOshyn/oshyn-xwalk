import EmblaCarousel from 'embla-carousel';

export default async function decorate(block) {
  // Optional: only activate when author selected the carousel option
  const isCarousel = block.classList.contains('is-carousel');

  if (!isCarousel) {
    return;
  }

  // Grab current children as slides
  const originalChildren = [...block.children];

  // Build Embla structure
  const viewport = document.createElement('div');
  viewport.className = 'embla__viewport';

  const container = document.createElement('div');
  container.className = 'embla__container';

  originalChildren.forEach((child) => {
    const slide = document.createElement('div');
    slide.className = 'embla__slide';

    slide.appendChild(child);
    container.appendChild(slide);
  });

  viewport.appendChild(container);

  // Optional nav buttons
  const prevButton = document.createElement('button');
  prevButton.className = 'embla__prev';
  prevButton.type = 'button';
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.textContent = 'Prev';

  const nextButton = document.createElement('button');
  nextButton.className = 'embla__next';
  nextButton.type = 'button';
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.textContent = 'Next';

  // Clear and rebuild block
  block.textContent = '';
  block.append(viewport, prevButton, nextButton);

  // Init Embla
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
