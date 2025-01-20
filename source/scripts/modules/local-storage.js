const LOCAL_STORAGE_KEY = 'contacts';

// Загрузка контактов из localStorage
function loadContacts() {
  const savedContacts = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedContacts) {
    try {
      return JSON.parse(savedContacts);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Ошибка парсинга данных из localStorage:', error);
      return [];
    }
  }
  return [];
}

// Сохранение контактов в localStorage
function saveContacts(contacts) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
}

export { loadContacts, saveContacts };
