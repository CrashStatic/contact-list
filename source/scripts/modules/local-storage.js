// Загрузка контактов из localStorage
function loadContacts(key) {
  const savedContacts = localStorage.getItem(key);
  if (savedContacts) {
    try {
      return JSON.parse(savedContacts);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Ошибка парсинга данных из localStorage:', error);
      return error;
    }
  }
}

// Сохранение контактов в localStorage
function saveContacts(key, contacts) {
  localStorage.setItem(key, JSON.stringify(contacts));
}

export { loadContacts, saveContacts };
