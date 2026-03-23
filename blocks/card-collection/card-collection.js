function getRows(block) {
  return [...block.children].filter((row) => row.tagName === 'DIV');
}

function createCta(row) {
  if (!row) return null;

  const existingLink = row.querySelector('a[href]');
  if (existingLink) {
    const link = existingLink.cloneNode(true);
    link.classList.add('button', 'primary', 'card-collection-cta');
    return link;
  }

  const cells = [...row.children].filter((cell) => cell.tagName === 'DIV');
  const text = cells[0]?.textContent?.trim();
  const url = cells[1]?.textContent?.trim();

  if (!text || !url) return null;

  const link = document.createElement('a');
  link.href = url;
  link.textContent = text;
  link.className = 'button primary card-collection-cta';
  return link;
}

function createCard(row) {
  const card = document.createElement('article');
  card.className = 'card-collection-card';

  const cells = [...row.children].filter((cell) => cell.tagName === 'DIV');

  const imageCell = cells[0] || row;
  const titleCell = cells[1] || row;
  const bodyCell = cells[2] || row;
  const linkLabelCell = cells[3];
  const linkUrlCell = cells[4];

  const media = imageCell.querySelector('picture, img');
  if (media) {
    const figure = document.createElement('figure');
    figure.className = 'card-collection-card-image';
    figure.appendChild(media.cloneNode(true));
    card.appendChild(figure);
  }

  const body = document.createElement('div');
  body.className = 'card-collection-card-body';

  const heading = titleCell.querySelector('h3, h4, h5, h6, strong') || (
    titleCell.textContent.trim() ? null : null
  );

  if (heading) {
    const headingClone = heading.cloneNode(true);
    headingClone.classList.add('card-collection-card-title');
    body.appendChild(headingClone);
  } else if (titleCell !== row && titleCell.textContent.trim()) {
    const title = document.createElement('h3');
    title.className = 'card-collection-card-title';
    title.textContent = titleCell.textContent.trim();
    body.appendChild(title);
  }

  const paragraph = bodyCell.querySelector('p');
  if (paragraph) {
    const paragraphClone = paragraph.cloneNode(true);
    paragraphClone.classList.add('card-collection-card-text');
    body.appendChild(paragraphClone);
  } else if (bodyCell !== row && bodyCell.textContent.trim()) {
    const text = document.createElement('p');
    text.className = 'card-collection-card-text';
    text.textContent = bodyCell.textContent.trim();
    body.appendChild(text);
  }

  let link;
  const existingLink = row.querySelector('a[href]');
  if (existingLink) {
    link = existingLink.cloneNode(true);
  } else if (linkLabelCell?.textContent.trim() && linkUrlCell?.textContent.trim()) {
    link = document.createElement('a');
    link.href = linkUrlCell.textContent.trim();
    link.textContent = linkLabelCell.textContent.trim();
  }

  if (link) {
    link.classList.add('button', 'secondary', 'card-collection-card-link');
    body.appendChild(link);
  }

  if (body.children.length) {
    card.appendChild(body);
  }

  return card;
}

export default function decorate(block) {
  block.classList.add('card-collection');

  const rows = getRows(block);

  const headlineRow = rows[0];
  const descriptionRow = rows[1];
  const ctaRow = rows[2];
  const cardRows = rows.slice(3);

  const header = document.createElement('header');
  header.className = 'card-collection-header';

  const heading = headlineRow?.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    const headingClone = heading.cloneNode(true);
    headingClone.classList.add('card-collection-title');
    header.appendChild(headingClone);
  } else if (headlineRow?.textContent.trim()) {
    const title = document.createElement('h2');
    title.className = 'card-collection-title';
    title.textContent = headlineRow.textContent.trim();
    header.appendChild(title);
  }

  const description = descriptionRow?.querySelector('p');
  if (description) {
    const descriptionClone = description.cloneNode(true);
    descriptionClone.classList.add('card-collection-description');
    header.appendChild(descriptionClone);
  } else if (descriptionRow?.textContent.trim()) {
    const text = document.createElement('p');
    text.className = 'card-collection-description';
    text.textContent = descriptionRow.textContent.trim();
    header.appendChild(text);
  }

  const cta = createCta(ctaRow);
  if (cta) {
    header.appendChild(cta);
  }

  const cardsWrapper = document.createElement('div');
  cardsWrapper.className = 'card-collection-cards';

  cardRows.forEach((row) => {
    const card = createCard(row);
    if (card) cardsWrapper.appendChild(card);
  });

  block.replaceChildren(header, cardsWrapper);
}
