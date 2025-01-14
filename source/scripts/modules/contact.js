import { updateCounter } from './counter.js';
import { contactsStorage, saveContactsToLocalStorage } from './local-storage.js';
import { openEditPopup } from './edit-popup.js';
import { COLUMN_ELEMENT_SELECTOR, CONTACTS_SELECTOR, COUNTER_SELECTOR, MESSAGE_NAME_SELECTOR, MESSAGE_PHONE_SELECTOR, MESSAGE_POSITION_SELECTOR } from './constants.js';

// Функция создания контакта
const getContactElement = (name, position, phone) => {
  const letterTemplate = document.querySelector('#message').content.querySelector('.message');
  const contactElement = letterTemplate.cloneNode(true);
  contactElement.querySelector(MESSAGE_NAME_SELECTOR).textContent = name;
  contactElement.querySelector(MESSAGE_POSITION_SELECTOR).textContent = position;
  contactElement.querySelector(MESSAGE_PHONE_SELECTOR).textContent = phone;
  return contactElement;
};


// Добавление контакта в DOM и запись в хранилище
function addContactToStorage(name, position, phone, letterElement, saveToLocal = true) {

  // Заполняем контакт
  const contactElement = getContactElement(name, position, phone);

  // Добавляем контакт в DOM
  const contactsContainer = letterElement.querySelector(CONTACTS_SELECTOR);
  contactsContainer.append(contactElement); // Добавляем контакт

  // Обновляем счётчик
  const counterElement = letterElement.querySelector(COUNTER_SELECTOR);
  updateCounter(counterElement, contactsContainer);

  // Сохраняем контакт в хранилище
  contactsStorage.set(`${name.toLowerCase()}|${position.toLowerCase()}|${phone}`, { name, position, phone });

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

  // Обновляем данные в основном списке
  const firstLetter = name[0].toUpperCase();
  const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest(COLUMN_ELEMENT_SELECTOR);

  if (letterElement) {
    const contactsContainer = letterElement.querySelector(CONTACTS_SELECTOR);
    const contactElements = contactsContainer.querySelectorAll('.element__message');

    contactElements.forEach((contact) => {
      const contactName = contact.querySelector(MESSAGE_NAME_SELECTOR).textContent;
      const contactPosition = contact.querySelector(MESSAGE_POSITION_SELECTOR).textContent;
      const contactPhone = contact.querySelector(MESSAGE_PHONE_SELECTOR).textContent;

      // Удаляем только нужный контакт
      if (contactName === name && contactPosition === position && contactPhone === phone) {
        contact.remove();
      }
    });

    // Обновляем счётчик для буквы
    const counterElement = letterElement.querySelector(COUNTER_SELECTOR);
    updateCounter(counterElement, contactsContainer);
  }


  // Обновляем данные в localStorage
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

export { getContactElement, addContactToStorage, deleteContact };
