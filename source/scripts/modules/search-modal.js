import { getContacts, searchContacts } from './contact-manager.js';
import { deleteContact, renderContactElement } from './contact.js';
import { openEditPopup } from './edit-popup.js';

const searchModal = document.querySelector('.modal');
const searchInput = searchModal.querySelector('.modal__input');
const searchArea = searchModal.querySelector('.modal__search-area');

// Отображение результатов поиска
function displaySearchResults(results) {
  searchArea.innerHTML = ''; // Очищаем область результатов

  if (results.length === 0) {
    searchArea.textContent = 'No results found';
    return;
  }

  results.forEach(({ name, position, phone }) => {
    const contactElement = renderContactElement(name, position, phone);
    searchArea.appendChild(contactElement);
  });
}

// Обработчик для ввода поиска
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (query) {
    const results = searchContacts(query); // Ищем контакты по запросу
    displaySearchResults(results); // Отображаем результаты
  } else {
    searchArea.innerHTML = ''; // Очищаем, если строка поиска пуста
  }
});

// Функция для кнопки "Show All" в модальном окне
function showAllContacts() {
  const allContacts = getContacts(); // Получаем все контакты из localStorage
  displaySearchResults(allContacts); // Отображаем все контакты
}

// Функция закрытие модального окна поиска
function closeSearchModal() {
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
  if (e.target.closest('.modal__button-cancel')) {
    closeSearchModal();
  }

  // Закрытие модального окна по клику на свободную область
  if (e.target.matches('.modal__overlay')) {
    closeSearchModal();
  }

  // Редактирования контакта по кнопке
  if (e.target.closest('.js-edit-contact-button')) {
    const contactElement = e.target.closest('.message');
    openEditPopup(contactElement);
  }

  // Закрытие моального окна по кнопке Delete
  if (e.target.closest('.js-delete-contact-button')) {
    deleteContact(e);
  }
});

export { searchModal, closeSearchModal };
