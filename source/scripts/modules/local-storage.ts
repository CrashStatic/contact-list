import { ContactInfo } from '../types/contact';

// Загрузка контактов из localStorage
function loadContacts(key: string): ContactInfo[] | null {
  const savedContacts = localStorage.getItem(key);
  if (savedContacts) {
    try {
      return JSON.parse(savedContacts) as ContactInfo[];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Ошибка парсинга данных из localStorage:', error);
      throw new Error('Ошибка парсинга данных из localStorage');
    }
  }
  return null;
}

// Сохранение контактов в localStorage
function saveContacts(key: string, contacts: ContactInfo[]): void {
  localStorage.setItem(key, JSON.stringify(contacts));
}

export { loadContacts, saveContacts };
