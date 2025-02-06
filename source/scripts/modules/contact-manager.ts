import { ContactInfo } from '../types/contact';
import { loadContacts, saveContacts } from './local-storage';

const LOCAL_STORAGE_KEY: string = 'contacts';

// Инициализируем контакты из localStorage
let contactsStorage: ContactInfo[] = loadContacts(LOCAL_STORAGE_KEY);

// Получаем все контакты (геттер)
function getContacts(): ContactInfo[] {
  return contactsStorage;
}

function addContactToStorage({ name, position, phone }: ContactInfo): void {
  const newContact = { name, position, phone };
  contactsStorage.push(newContact);

  saveContacts(LOCAL_STORAGE_KEY, contactsStorage);
}

function deleteContactToStorage({ name, position, phone }: ContactInfo): void {
  contactsStorage = contactsStorage.filter(
    (contact) => contact.name !== name || contact.position !== position || contact.phone !== phone
  );

  saveContacts(LOCAL_STORAGE_KEY, contactsStorage);
}

function searchContacts(query: string): ContactInfo[] {
  return contactsStorage.filter(
    ({ name, position, phone }) =>
      name.toLowerCase().includes(query.toLowerCase()) ||
      position.toLowerCase().includes(query.toLowerCase()) ||
      phone.includes(query)
  );
}

function updateContactInStorage(oldContact: ContactInfo, newContact: ContactInfo): void {
  contactsStorage = contactsStorage.map((contact) =>
    contact.name === oldContact.name && contact.position === oldContact.position && contact.phone === oldContact.phone
      ? newContact
      : contact
  );

  saveContacts(LOCAL_STORAGE_KEY, contactsStorage);
}

function clearAllContactsInStorage(): void {
  contactsStorage = [];

  saveContacts(LOCAL_STORAGE_KEY, contactsStorage);
}

export { getContacts, addContactToStorage, deleteContactToStorage, searchContacts, updateContactInStorage, clearAllContactsInStorage };
