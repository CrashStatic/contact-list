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

// const LOCAL_STORAGE_KEY = 'contacts';

// // Загрузка контактов из localStorage
// function loadContacts() {
//   const savedContacts = localStorage.getItem(LOCAL_STORAGE_KEY);
//   if (savedContacts) {
//     try {
//       return JSON.parse(savedContacts);
//     } catch (error) {
//       // eslint-disable-next-line no-console
//       console.error('Ошибка парсинга данных из localStorage:', error);
//       return [];
//     }
//   }
//   return [];
// }

// // Сохранение контактов в localStorage
// function saveContacts(contacts) {
//   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
// }


// let contactsStorage = loadContacts(); // Инициализируем контакты из localStorage

// // Добавление контакта
// function addContact(name, position, phone) {
//   if (isContactExist(name, position, phone)) {
//     return; // Контакт уже существует, не добавляем
//   }

//   const newContact = { name, position, phone };
//   contactsStorage.push(newContact); // Добавляем контакт в хранилище

//   saveContacts(contactsStorage); // Сохраняем обновленный список в localStorage
// }

// // Удаление контакта
// function deleteContact(name, position, phone) {
//   contactsStorage = contactsStorage.filter(
//     (contact) => contact.name !== name || contact.position !== position || contact.phone !== phone
//   );

//   saveContacts(contactsStorage); // Сохраняем обновленный список в localStorage
// }

// // Поиск контакта
// function searchContacts(query) {
//   return contactsStorage.filter(
//     ({ name, position, phone }) =>
//       name.toLowerCase().includes(query.toLowerCase()) ||
//       position.toLowerCase().includes(query.toLowerCase()) ||
//       phone.includes(query)
//   );
// }

// // Проверка на существование контакта
// function isContactExist(name, position, phone) {
//   return contactsStorage.some(
//     (contact) =>
//       contact.name.toLowerCase() === name.toLowerCase() &&
//       contact.position.toLowerCase() === position.toLowerCase() &&
//       contact.phone === phone
//   );
// }
// export { addContact, deleteContact, searchContacts, isContactExist(validateSameValues) };

export { contactsStorage, loadContactsFromLocalStorage, saveContactsToLocalStorage };
