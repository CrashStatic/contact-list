import { ContactInfo } from '../types/contact';

// Загрузка контактов из localStorage
function loadContacts(key: string): ContactInfo[] {
  const savedContacts = localStorage.getItem(key);
  if (savedContacts) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Ошибка парсинга данных из localStorage:', error);
      throw new Error('Ошибка парсинга данных из localStorage');
    }
  }
  return [];
}

// Сохранение контактов в localStorage
function saveContacts(key: string, contacts: ContactInfo[]): void {
  localStorage.setItem(key, JSON.stringify(contacts));
}

export { loadContacts, saveContacts };
