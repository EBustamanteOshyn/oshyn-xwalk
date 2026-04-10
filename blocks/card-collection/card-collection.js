import EmblaCarousel from '../../scripts/vendor/embla-carousel.esm.js';

function getClosestPropWrapper(card, propName) {
  const el = card.querySelector(`[data-aue-prop="${propName}"]`);
  return el ? el.closest('div') : null;
}

function transformCard(card) {
  const imageWrapper = getClosestPropWrapper(card, 'image');
  const headerWrapper = getClosestPropWrapper(card, 'header');
  const textWrapper = getClosestPropWrapper(card, 'text');

  const img = imageWrapper?.querySelector('img');
  const ctaLink = card.querySelector('.button-container a');

  const imageSrc = img?.getAttribute('src');
  const href = ctaLink?.getAttribute('href');
  const target = ctaLink?.getAttribute('target');

  const bg = document.createElement('div');
  bg.className = 'card-bg';

  if (imageSrc) {
    bg.style.backgroundImage = `url("${imageSrc}")`;
  }

  const cardContent = href ? document.createElement('a') : document.createElement('div');
  cardContent.className = 'card-link';

  if (href) {
    cardContent.href = href;
    cardContent.setAttribute('aria-label', ctaLink?.textContent?.trim() || 'Open card');

    if (target) {
      cardContent.target = target;
    }
  }

  const header = document.createElement('h3');
  header.className = 'card-header';

  const body = document.createElement('div');
  body.className = 'card-body';

  if (headerWrapper) {
    header.appendChild(headerWrapper);
  }

  if (textWrapper) {
    body.appendChild(textWrapper);
  }

  cardContent.append(header, body);
  bg.appendChild(cardContent);
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
    transformCard(card);

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
  prevButton.textContent = 'Previous';

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
  embla.on('select', updateButtons);
  embla.on('reInit', updateButtons);
}
