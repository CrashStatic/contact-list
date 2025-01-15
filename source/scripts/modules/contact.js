import { updateCounter } from './counter.js';
import { contactsStorage, saveContactsToLocalStorage } from './local-storage.js';
import { openEditPopup } from './edit-popup.js';
import { COLUMN_ELEMENT_SELECTOR, CONTACTS_SELECTOR, COUNTER_SELECTOR, MESSAGE_NAME_SELECTOR, MESSAGE_PHONE_SELECTOR, MESSAGE_POSITION_SELECTOR } from './constants.js';

// Функция рендеринга одного контакта
function renderContactElement(name, position, phone) {
  const letterTemplate = document.querySelector('#message').content.querySelector('.message');
  const contactElement = letterTemplate.cloneNode(true);
  contactElement.querySelector(MESSAGE_NAME_SELECTOR).textContent = name;
  contactElement.querySelector(MESSAGE_POSITION_SELECTOR).textContent = position;
  contactElement.querySelector(MESSAGE_PHONE_SELECTOR).textContent = phone;
  return contactElement;
}

// Функция рендеринга списка контактов
function renderContacts(contacts, container) {
  container.innerHTML = ''; // Очистка контейнера перед рендером
  contacts.forEach(({ name, position, phone }) => {
    const contactElement = renderContactElement(name, position, phone);
    container.append(contactElement);
  });
}

// Функция рендеринга колонки
function renderColumn(letter, contacts) {
  const columnElement = document.querySelector(`[data-id="${letter.toLowerCase()}"]`)?.closest(COLUMN_ELEMENT_SELECTOR);

  if (columnElement) {
    const contactsContainer = columnElement.querySelector(CONTACTS_SELECTOR);
    renderContacts(contacts, contactsContainer);

    // Обновляем счётчик для буквы
    const counterElement = columnElement.querySelector(COUNTER_SELECTOR);
    updateCounter(counterElement, contactsContainer);
  }
}

// Добавление контакта в DOM и запись в хранилище
function addContactToStorage(name, position, phone, letterElement, saveToLocal = true) {

  // Сохраняем контакт в хранилище
  contactsStorage.set(`${name.toLowerCase()}|${position.toLowerCase()}|${phone}`, { name, position, phone });

  // Обновляем колонку
  const firstLetter = name[0].toUpperCase();
  const updatedContacts = Array.from(contactsStorage.values()).filter((contact) => contact.name[0].toUpperCase() === firstLetter);
  renderColumn(firstLetter, updatedContacts);

  // Сохраняем в localStorage, если нужно
  if (saveToLocal) {
    saveContactsToLocalStorage();
  }
}

// Функция удаления контакта из списка
function deleteContact(event) {
  const contactMessage = event.target.closest('.message');
  const name = contactMessage.querySelector(MESSAGE_NAME_SELECTOR).textContent;
  const position = contactMessage.querySelector(MESSAGE_POSITION_SELECTOR).textContent;
  const phone = contactMessage.querySelector(MESSAGE_PHONE_SELECTOR).textContent;

  // Удаляем из хранилища
  contactsStorage.delete(`${name.toLowerCase()}|${position.toLowerCase()}|${phone}`);

  // Удаляем из DOM
  contactMessage.remove();

  // Рендерим колонку заново
  const firstLetter = name[0].toUpperCase();
  const updatedContacts = Array.from(contactsStorage.values()).filter((contact) => contact.name[0].toUpperCase() === firstLetter);
  renderColumn(firstLetter, updatedContacts);

  // Обновляем localStorage
  saveContactsToLocalStorage();
}


// Раскрывающееся меню с контактами при взаимодействии с буквой
function openContactInfo(event) {
  if (event.target.closest(COLUMN_ELEMENT_SELECTOR)) {
    const currentBtn = event.target.closest('.element');
    const currentContent = currentBtn.querySelector(CONTACTS_SELECTOR);

    currentContent.classList.toggle('element__contacts--open');

    if (currentContent.classList.contains('element__contacts--open')) {
      currentContent.style.maxHeight = `${currentContent.scrollHeight}px`;
    } else {
      currentContent.style.maxHeight = 0;
    }
  }
}

// Обработчики действий по клику
document.querySelector('.contact-table').addEventListener('click', (e) => {

  // Удаление контакта по кнопке
  if (e.target.matches('.message__delete')) {
    deleteContact(e);
    return;
  }

  // Редактирования контакта по кнопке
  if (e.target.matches('.message__edit')) {
    const contactElement = e.target.closest('.message');
    openEditPopup(contactElement);
    return;
  }

  // Открытие информации о контактах по клику
  openContactInfo(e);
});


// Обработчики действий по табу
document.querySelector('.contact-table').addEventListener('keydown', (evt) => {
  if (evt.keyCode === 32 || evt.key === 'Enter') {
    evt.preventDefault();

    // Удаление контакта по кнопке
    if (evt.target.matches('.message__delete')) {
      deleteContact(evt);
      return;
    }

    // Редактирования контакта по кнопке
    if (evt.target.matches('.message__edit')) {
      const contactElement = evt.target.closest('.message');
      openEditPopup(contactElement);
      return;
    }

    // Открытие информации о контактах по табу
    openContactInfo(evt);
  }
});

export { renderContactElement, addContactToStorage, deleteContact };
