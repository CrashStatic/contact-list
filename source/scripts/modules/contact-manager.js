import { loadContacts, saveContacts } from './local-storage.js';
const LOCAL_STORAGE_KEY = 'contacts';

// Инициализируем контакты из localStorage
let contactsStorage = loadContacts(LOCAL_STORAGE_KEY) || [];

// Получаем все контакты (геттер)
function getContacts() {
  return contactsStorage;
}

function addContactToStorage(name, position, phone) {
  const newContact = { name, position, phone };
  contactsStorage.push(newContact);

  saveContacts(LOCAL_STORAGE_KEY, contactsStorage);
}

function deleteContactToStorage(name, position, phone) {
  contactsStorage = contactsStorage.filter(
    (contact) => contact.name !== name || contact.position !== position || contact.phone !== phone
  );

  saveContacts(LOCAL_STORAGE_KEY, contactsStorage);
}

function searchContacts(query) {
  return contactsStorage.filter(
    ({ name, position, phone }) =>
      name.toLowerCase().includes(query.toLowerCase()) ||
      position.toLowerCase().includes(query.toLowerCase()) ||
      phone.includes(query)
  );
}

function updateContactInStorage(oldContact, newContact) {
  const oldIndex = contactsStorage.findIndex((contact) =>
    contact.name === oldContact.name && contact.position === oldContact.position && contact.phone === oldContact.phone
  );

  if (oldIndex !== -1) {
    contactsStorage.splice(oldIndex, 1); // Удаляем старый контакт
  }

  contactsStorage.push(newContact);

  saveContacts(LOCAL_STORAGE_KEY, contactsStorage);
}

function clearAllContactsInStorage() {
  const allContactsStorage = getContacts();
  allContactsStorage.length = 0;

  saveContacts(LOCAL_STORAGE_KEY, allContactsStorage);
}

export { getContacts, addContactToStorage, deleteContactToStorage, searchContacts, updateContactInStorage, clearAllContactsInStorage };
