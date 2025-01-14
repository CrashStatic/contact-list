import { deleteContact, getContactElement } from './contact.js';
import { openEditPopup } from './edit-popup.js';
import { contactsStorage } from './local-storage.js';

const searchModal = document.querySelector('.modal');
const searchInput = searchModal.querySelector('.modal__input');
const searchArea = searchModal.querySelector('.modal__search-area');

// // Открытие модального окна
// searchButton.addEventListener('click', () => {
//   searchModal.classList.add('modal--open');
//   document.querySelector('.body').style.overflow = 'hidden';
//   searchModal.querySelector('input').focus(); // Перемещаем фокус на первое поле ввода
// });

// Функция поиска контактов
function searchContacts(query) {
  const results = [];
  contactsStorage.forEach(({ name, position, phone }) => {
    if (
      name.toLowerCase().includes(query) ||
      position.toLowerCase().includes(query) ||
      phone.includes(query)
    ) {
      results.push({ name, position, phone });
    }
  });
  return results;
}

// Отображение результатов поиска
function displaySearchResults(results) {
  searchArea.innerHTML = ''; // Очищаем область результатов

  if (results.length === 0) {
    searchArea.textContent = 'No results found';
    return;
  }

  results.forEach(({ name, position, phone }) => {
    const contactElement = getContactElement(name, position, phone);
    searchArea.appendChild(contactElement);
  });
}

// Обработчик для ввода поиска
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (query) {
    const results = searchContacts(query);
    displaySearchResults(results);
  } else {
    searchArea.innerHTML = ''; // Очищаем, если строка поиска пуста
  }
});

// Функция для кнопки "Show All" в модальном окне
function showAllContacts() {
  const allContacts = Array.from(contactsStorage.values());
  displaySearchResults(allContacts);
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
  if (e.target.matches('.modal__button-cancel')) {
    closeSearchModal();
  }

  // Закрытие модального окна по клику на свободную область
  if (e.target.matches('.modal__overlay')) {
    closeSearchModal();
  }

  // Редактирования контакта по кнопке
  if (e.target.matches('.message__edit')) {
    const contactElement = e.target.closest('.message');
    openEditPopup(contactElement);
  }

  // Закрытие моального окна по кнопке Delete
  if (e.target.matches('.message__delete')) {
    deleteContact(e);
  }
});

export { searchModal };
