import { updateCounter } from './counter.js';
import { COLUMN_ELEMENT_SELECTOR, CONTACTS_SELECTOR, COUNTER_SELECTOR, MESSAGE_NAME_SELECTOR, MESSAGE_PHONE_SELECTOR, MESSAGE_POSITION_SELECTOR } from './constants.js';
import { addContactToStorage, deleteContactToStorage, getContacts } from './contact-manager.js';
import { openEditPopup } from './search-modal.js';

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

// Функция для добавления контакта в хранилище и рендеринга
function addContact(name, position, phone, letterElement, shouldSave = true) {
  // Если необходимо, добавляем контакт в хранилище
  if (shouldSave) {
    addContactToStorage(name, position, phone);
  }

  // Извлекаем первую букву из letterElement, если это DOM-элемент
  const letter = letterElement.querySelector('[data-id]').textContent.toUpperCase();

  // Обновляем колонку, фильтруем контакты по первой букве имени
  const updatedContacts = getContacts().filter((contact) => contact.name[0].toUpperCase() === letter);
  renderColumn(letter, updatedContacts);
}

// Функция удаления контакта из списка
function deleteContact(event) {
  const contactMessage = event.target.closest('.message');
  const name = contactMessage.querySelector(MESSAGE_NAME_SELECTOR).textContent;
  const position = contactMessage.querySelector(MESSAGE_POSITION_SELECTOR).textContent;
  const phone = contactMessage.querySelector(MESSAGE_PHONE_SELECTOR).textContent;

  // Удаляем контакт
  deleteContactToStorage(name, position, phone);

  // Удаляем из DOM
  contactMessage.remove();

  // Рендерим колонку заново
  const firstLetter = name[0].toUpperCase();
  const updatedContacts = getContacts().filter((contact) => contact.name[0].toUpperCase() === firstLetter);
  renderColumn(firstLetter, updatedContacts);
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
  if (e.target.closest('.js-delete-contact-button')) {
    deleteContact(e);
    return;
  }

  // Редактирования контакта по кнопке
  if (e.target.closest('.js-edit-contact-button')) {
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
    if (evt.target.matches('.js-delete-contact-button')) {
      deleteContact(evt);
      return;
    }

    // Редактирования контакта по кнопке
    if (evt.target.matches('.js-edit-contact-button')) {
      const contactElement = evt.target.closest('.message');
      openEditPopup(contactElement);
      return;
    }

    // Открытие информации о контактах по табу
    openContactInfo(evt);
  }
});

export { renderContactElement, addContact, deleteContact, renderContacts };
