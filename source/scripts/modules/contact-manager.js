import { loadContacts, saveContacts } from './local-storage.js';

// Инициализируем контакты из localStorage
let contactsStorage = loadContacts() || []; // Защищаем от null или undefined

// Получаем все контакты (геттер)
function getContacts() {
  return contactsStorage;
}

// Добавление контакта
function addContactToStorage(name, position, phone) {
  const newContact = { name, position, phone };
  contactsStorage.push(newContact); // Добавляем контакт в хранилище

  saveContacts(contactsStorage); // Сохраняем обновленный список в localStorage
}

// Удаление контакта
function deleteContactToStorage(name, position, phone) {
  contactsStorage = contactsStorage.filter(
    (contact) => contact.name !== name || contact.position !== position || contact.phone !== phone
  );

  saveContacts(contactsStorage); // Сохраняем обновленный список в localStorage
}

// Поиск контакта
function searchContacts(query) {
  return contactsStorage.filter(
    ({ name, position, phone }) =>
      name.toLowerCase().includes(query.toLowerCase()) ||
      position.toLowerCase().includes(query.toLowerCase()) ||
      phone.includes(query)
  );
}

// Редактирование контакта
function updateContactInStorage(oldContact, newContact) {
  // Удаляем старый контакт
  const oldIndex = contactsStorage.findIndex((contact) =>
    contact.name === oldContact.name && contact.position === oldContact.position && contact.phone === oldContact.phone
  );

  if (oldIndex !== -1) {
    contactsStorage.splice(oldIndex, 1); // Удаляем старый контакт
  }

  // Добавляем новый контакт
  contactsStorage.push(newContact);

  // Сохраняем обновленные контакты в localStorage
  saveContacts(contactsStorage);
}

// Очистка всех контактов
function clearAllContacts() {
  contactsStorage = []; // Очищаем массив контактов
  saveContacts(contactsStorage); // Обновляем localStorage
}

export { getContacts, addContactToStorage, deleteContactToStorage, searchContacts, updateContactInStorage, clearAllContacts };
