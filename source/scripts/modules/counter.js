// Функция для обновления счётчика
function updateCounter(counterElement, contactsContainer) {
  const count = contactsContainer.children.length; // Количество контактов

  if (count > 0) {
    counterElement.classList.add('element__counter--active');
    counterElement.textContent = count;
  } else {
    counterElement.classList.remove('element__counter--active');
    counterElement.textContent = 0;
  }
}

export { updateCounter };
