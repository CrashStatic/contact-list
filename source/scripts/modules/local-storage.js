import { COLUMN_ELEMENT_SELECTOR } from './constants.js';
import { addContactToStorage } from './contact.js';

const contactsStorage = []; // Хранилище контактов

// Загрузка контактов из localStorage
function loadContactsFromLocalStorage() {
  const savedContacts = localStorage.getItem('contacts');
  if (savedContacts) {
    try {
      const contacts = JSON.parse(savedContacts); // Преобразуем строку в массив
      if (Array.isArray(contacts)) {
        contacts.forEach(({ name, position, phone }) => {
          const firstLetter = name[0].toUpperCase();
          const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest(COLUMN_ELEMENT_SELECTOR);
          if (letterElement) {
            addContactToStorage(name, position, phone, letterElement);
          }
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Ошибка парсинга данных из localStorage:', error);
    }
  }
}

// Сохранение контактов в localStorage
function saveContactsToLocalStorage() {
  localStorage.setItem('contacts', JSON.stringify(contactsStorage));
}

export { contactsStorage, loadContactsFromLocalStorage, saveContactsToLocalStorage };
