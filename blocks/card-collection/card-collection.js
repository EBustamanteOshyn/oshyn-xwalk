export default function decorate(block) {
  block.classList.add('card-collection');

  // header parts (first matching elements are used)
  const headline = block.querySelector('h1, h2, h3, h4, h5, h6');
  const description = block.querySelector('p');
  const cta = block.querySelector('a[href]');

  // find a cards container produced by the card primitive block if available.
  let cardsSource = block.querySelector('.cards');

  // Build card items from leftover rows if no dedicated cards div exists
  if (!cardsSource) {
    const rows = [...block.children].filter((row) => row.tagName === 'DIV');
    let cardRows = rows;
    if (headline || description || cta) {
      cardRows = rows.filter((row) => {
        const wouldContainHeadline = headline && row.contains(headline);
        const wouldContainDescription = description && row.contains(description);
        const wouldContainCta = cta && row.contains(cta);
        return !wouldContainHeadline && !wouldContainDescription && !wouldContainCta;
      });
    }

    const cardElements = cardRows.slice(0, 3).map((row) => {
      const card = document.createElement('article');
      card.className = 'card-collection-card';

      const media = row.querySelector('picture, img');
      if (media) {
        const figure = document.createElement('figure');
        figure.className = 'card-collection-card-image';
        figure.appendChild(media.cloneNode(true));
        card.appendChild(figure);
      }

      const body = document.createElement('div');
      body.className = 'card-collection-card-body';

      const cardHeading = row.querySelector('h3, h4, h5, h6, strong')?.cloneNode(true);
      if (cardHeading) {
        cardHeading.classList.add('card-collection-card-title');
        body.appendChild(cardHeading);
      }

      const cardText = row.querySelector('p')?.cloneNode(true);
      if (cardText) {
        cardText.classList.add('card-collection-card-text');
        body.appendChild(cardText);
      }

      const cardLink = row.querySelector('a[href]')?.cloneNode(true);
      if (cardLink) {
        cardLink.classList.add('button', 'secondary', 'card-collection-card-link');
        body.appendChild(cardLink);
      }

      // If row contains simple text cell without heading/card, preserve it as body text.
      if (!cardHeading && !cardText && !cardLink && row.textContent.trim()) {
        const fallbackText = document.createElement('p');
        fallbackText.className = 'card-collection-card-text';
        fallbackText.textContent = row.textContent.trim();
        body.appendChild(fallbackText);
      }

      if (body.children.length) card.appendChild(body);
      return card;
    });

    cardsSource = document.createElement('div');
    cardsSource.className = 'card-collection-cards';
    cardElements.forEach((card) => cardsSource.appendChild(card));
  } else {
    // existing .cards container from card primitive: use only first 3 card items
    const cardItems = [...cardsSource.querySelectorAll('li')].slice(0, 3);
    cardsSource = document.createElement('div');
    cardsSource.className = 'card-collection-cards';
    cardItems.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'card-collection-card';
      card.appendChild(item.cloneNode(true));
      cardsSource.appendChild(card);
    });
  }

  const header = document.createElement('header');
  header.className = 'card-collection-header';

  const headingId = `card-collection-heading-${Math.random().toString(36).slice(2, 8)}`;

  if (headline) {
    const headingClone = headline.cloneNode(true);
    headingClone.classList.add('card-collection-title');
    headingClone.id = headingId;
    header.appendChild(headingClone);
  } else {
    const fallbackHeading = document.createElement('h2');
    fallbackHeading.className = 'card-collection-title';
    fallbackHeading.id = headingId;
    fallbackHeading.textContent = 'Featured cards';
    header.appendChild(fallbackHeading);
  }

  if (description) {
    const descriptionClone = description.cloneNode(true);
    descriptionClone.classList.add('card-collection-description');
    header.appendChild(descriptionClone);
  }

  if (cta) {
    const ctaClone = cta.cloneNode(true);
    ctaClone.classList.add('button', 'primary', 'card-collection-cta');
    ctaClone.setAttribute('aria-label', ctaClone.textContent.trim() || 'Learn more');
    header.appendChild(ctaClone);
  }

  const collection = document.createElement('section');
  collection.className = 'card-collection-grid';
  collection.setAttribute('role', 'region');
  collection.setAttribute('aria-labelledby', headingId);
  collection.appendChild(cardsSource);

  block.replaceChildren(header, collection);
}
