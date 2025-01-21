function updateCounter(counterElement, contactsContainer) {
  const count = contactsContainer.children.length;

  const element = contactsContainer.parentElement;

  if (count > 0) {
    counterElement.classList.add('element__counter--active');
    element.classList.add('element--active');
    counterElement.textContent = count;
  } else {
    counterElement.classList.remove('element__counter--active');
    element.classList.remove('element--active');
    counterElement.textContent = 0;
  }
}

export { updateCounter };
