import { getContacts, searchContacts } from './contact-manager.js';
import { renderContactElement } from './contact.js';
import { isEscapeKey } from './util.js';
// import { deleteContact, renderContactElement } from './contact.js';
// import { openEditPopup } from './edit-popup.js';

const searchModal = document.querySelector('.modal');

// Отображение результатов поиска
function displaySearchResults(results, area) {
  area.innerHTML = ''; // Очищаем область результатов

  if (results.length === 0) {
    area.textContent = 'No results found';
    return;
  }

  results.forEach(({ name, position, phone }) => {
    const contactElement = renderContactElement(name, position, phone);
    area.appendChild(contactElement);
  });
}

// Обработчик для ввода поиска
function processSearchInput(input, area) {
  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    if (query) {
      const results = searchContacts(query); // Ищем контакты по запросу
      displaySearchResults(results, area); // Отображаем результаты
    } else {
      area.innerHTML = ''; // Очищаем, если строка поиска пуста
    }
  });
}

// Функция для кнопки "Show All" в модальном окне
function showAllContacts() {
  const allContacts = getContacts(); // Получаем все контакты из localStorage
  const searchArea = searchModal.querySelector('.modal__search-area');
  displaySearchResults(allContacts, searchArea); // Отображаем все контакты
  searchModal.querySelector('input').focus(); // Ставим фокус обратно на поле ввода
}

// Функция открытия модального окна поиска
function openSearchModal() {
  searchModal.classList.add('modal--open');
  document.querySelector('.body').style.overflow = 'hidden';

  const modalBody = document.querySelector('#modal-body');
  const searchModalTemplate = document.querySelector('#search-modal-content');

  // Очистить тело модалки
  modalBody.innerHTML = '';

  // Клонировать содержимое шаблона и вставить в модалку
  const searchModalContent = searchModalTemplate.content.cloneNode(true);
  modalBody.appendChild(searchModalContent);

  // Получаем доступ к элементу searchInput и searchArea
  const searchInput = modalBody.querySelector('.modal__input');
  const searchArea = modalBody.querySelector('.modal__search-area');

  if (searchInput && searchArea) {
    processSearchInput(searchInput, searchArea);
  }

  searchModal.querySelector('input').focus(); // Перемещаем фокус на первое поле ввода
  document.addEventListener('keydown', onDocumentKeydown);
}

// Функция закрытие модального окна поиска
function closeSearchModal() {
  const searchInput = document.querySelector('.modal__input');
  const searchArea = document.querySelector('.modal__search-area');

  searchModal.classList.remove('modal--open');
  searchInput.value = '';
  searchArea.innerHTML = '';
  document.querySelector('.body').style.overflow = 'auto';
}

// Обработчики действий по клику
document.querySelector('.modal').addEventListener('click', (e) => {

  // Обработчки на конпку ShowAll
  if (e.target.matches('.modal__button-show')) {
    showAllContacts();
  }

  // Закрытие модального окна по клику на кнопку закрытия
  if (e.target.closest('.modal__close-button')) {
    closeSearchModal();
  }

  // Закрытие модального окна по клику на свободную область
  if (e.target.matches('.modal__overlay')) {
    closeSearchModal();
  }
});

// Закрытие модального окна через Escape
function onDocumentKeydown (evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeSearchModal();
  }
}

export { closeSearchModal, openSearchModal };
