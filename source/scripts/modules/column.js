import { ELEMENT_SELECTOR, LETTER_SELECTOR, LETTER_TEMPLATE_SELECTOR } from './constants';

const letterTemplate = document.querySelector(LETTER_TEMPLATE_SELECTOR).content.querySelector(ELEMENT_SELECTOR);

const getLetter = ({ letter, id }) => {
  const letterElement = letterTemplate.cloneNode(true);
  letterElement.querySelector(LETTER_SELECTOR).textContent = letter;
  letterElement.querySelector(LETTER_SELECTOR).dataset.id = id;
  letterElement.setAttribute('tabindex', '0');

  return letterElement;
};

const createColumn = (alphabet, container) => {
  const fragmentElement = document.createDocumentFragment();
  alphabet.forEach((element) => {
    const letter = getLetter(element);
    fragmentElement.append(letter);
  });

  container.append(fragmentElement);
};

export { createColumn };
