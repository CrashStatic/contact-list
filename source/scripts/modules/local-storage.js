import { addContactToStorage } from './contact.js';

const contactsStorage = new Map(); // Хранилище контактов

// Загрузка контактов из localStorage
function loadContactsFromLocalStorage() {
  const savedContacts = localStorage.getItem('contacts');
  if (savedContacts) {
    try {
      const contacts = JSON.parse(savedContacts); // Преобразуем строку в массив
      if (Array.isArray(contacts)) {
        contacts.forEach(({ name, position, phone }) => {
          const firstLetter = name[0].toUpperCase();
          const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest('.column__element');
          if (letterElement) {
            addContactToStorage(name, position, phone, letterElement);
          }
        });
      }
    } catch (error) {
      console.error('Ошибка парсинга данных из localStorage:', error);
    }
  }
}

// Сохранение контактов в localStorage
function saveContactsToLocalStorage() {
  const contactsArray = Array.from(contactsStorage.values());
  localStorage.setItem('contacts', JSON.stringify(contactsArray));
}

export { contactsStorage, loadContactsFromLocalStorage, saveContactsToLocalStorage };
