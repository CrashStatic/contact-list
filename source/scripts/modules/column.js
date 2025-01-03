const letterTemplate = document.querySelector('#letter').content.querySelector('.element');

const getLetter = ({ letter, id }) => {
  const letterElement = letterTemplate.cloneNode(true);
  letterElement.querySelector('.element__letter').textContent = letter;
  letterElement.querySelector('.element__letter').dataset.id = id;
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
