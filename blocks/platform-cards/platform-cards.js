import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('tw-card-container');
  [...block.children].forEach((row) => {
    const a = document.createElement('a');
    a.classList.add('tw-card');
    moveInstrumentation(row, a);
    while (row.firstElementChild) a.append(row.firstElementChild);

    const [imageCol, bodyCol, ctaCol] = a.children;
    if (bodyCol && imageCol && bodyCol.children.length > 0) {
      while (bodyCol.firstElementChild) imageCol.append(bodyCol.firstElementChild);
    }
    bodyCol.remove();

    imageCol.querySelector('p')?.classList.add('tw-card-text');
    
    if (ctaCol && ctaCol.children.length === 1 && ctaCol.querySelector('a')) {
      const ctaLink = ctaCol.querySelector('a');
      if (ctaLink.href) a.href = ctaLink.href;
      const span = document.createElement('span');
      if (ctaLink.textContent) span.textContent = ctaLink.textContent;
      ctaCol.replaceWith(span);
      span.classList.add('tw-card-link');
    }
    row.replaceWith(a);

    a.querySelectorAll('picture > img').forEach((img) => {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.querySelector('img').classList.add('tw-card-image');
      img.closest('picture').replaceWith(optimizedPic);
    });

    
  });
}
