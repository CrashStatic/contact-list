import { Letter } from '../types/letter';
import { ELEMENT_SELECTOR, LETTER_SELECTOR, LETTER_TEMPLATE_SELECTOR } from './constants';

const letterTemplate = document.querySelector(LETTER_TEMPLATE_SELECTOR) as HTMLTemplateElement;
const content = letterTemplate.content.querySelector(ELEMENT_SELECTOR);

const getLetter = ({ letter, id }: Letter): HTMLElement => {
  const letterElement = content?.cloneNode(true) as HTMLElement;

  if (letterElement) {
    const letterContent = letterElement.querySelector(LETTER_SELECTOR) as HTMLElement;
    letterContent.textContent = letter;
    letterContent.dataset.id = id;
    letterElement.setAttribute('tabindex', '0');
  }

  return letterElement;
};

const createColumn = (alphabet: Letter[], container: HTMLElement): void => {
  const fragmentElement = document.createDocumentFragment();
  alphabet.forEach((element) => {
    const letter = getLetter(element);
    fragmentElement.append(letter);
  });

  container.append(fragmentElement);
};

export { createColumn };
