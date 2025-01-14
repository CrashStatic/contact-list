import { updateCounter } from './counter.js';
import { contactsStorage, saveContactsToLocalStorage } from './local-storage.js';
import { openEditPopup } from './edit-popup.js';

// Функция создания контакта
const getContactElement = (name, position, phone) => {
  const letterTemplate = document.querySelector('#message').content.querySelector('.message');
  const contactElement = letterTemplate.cloneNode(true);
  contactElement.querySelector('.message__name').textContent = name;
  contactElement.querySelector('.message__position').textContent = position;
  contactElement.querySelector('.message__phone').textContent = phone;
  return contactElement;
};


// Добавление контакта в DOM и запись в хранилище
function addContactToStorage(name, position, phone, letterElement, saveToLocal = true) {

  // Заполняем контакт
  const contactElement = getContactElement(name, position, phone);

  // Добавляем контакт в DOM
  const contactsContainer = letterElement.querySelector('.element__contacts');
  contactsContainer.append(contactElement); // Добавляем контакт

  // Обновляем счётчик
  const counterElement = letterElement.querySelector('.element__counter');
  updateCounter(counterElement, contactsContainer);

  // Сохраняем контакт в хранилище
  contactsStorage.set(`${name.toLowerCase()}|${position.toLowerCase()}|${phone}`, { name, position, phone });

  // Сохраняем в localStorage, если нужно
  if (saveToLocal) {
    saveContactsToLocalStorage();
  }
}

// Функция удаления контакта из списка
function deleteContact() {
  const contactMessage = event.target.closest('.message');
  const name = contactMessage.querySelector('.message__name').textContent;
  const position = contactMessage.querySelector('.message__position').textContent;
  const phone = contactMessage.querySelector('.message__phone').textContent;

  // Удаляем из хранилища
  contactsStorage.delete(`${name.toLowerCase()}|${position.toLowerCase()}|${phone}`);

  // Удаляем из DOM
  contactMessage.remove();

  // Обновляем данные в основном списке
  const firstLetter = name[0].toUpperCase();
  const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest('.column__element');

  if (letterElement) {
    const contactsContainer = letterElement.querySelector('.element__contacts');
    const contactElements = contactsContainer.querySelectorAll('.element__message');

    contactElements.forEach((contact) => {
      const contactName = contact.querySelector('.message__name').textContent;
      const contactPosition = contact.querySelector('.message__position').textContent;
      const contactPhone = contact.querySelector('.message__phone').textContent;

      // Удаляем только нужный контакт
      if (contactName === name && contactPosition === position && contactPhone === phone) {
        contact.remove();
      }
    });

    // Обновляем счётчик для буквы
    const counterElement = letterElement.querySelector('.element__counter');
    updateCounter(counterElement, contactsContainer);
  }

  // Удаляем контакт из модального окна
  contactMessage.remove();

  // Обновляем данные в localStorage
  saveContactsToLocalStorage();
}

// Раскрывающееся меню с контактами при взаимодействии с буквой
function openContactInfo(event) {
  if (event.target.closest('.column__element')) {
    const currentBtn = event.target.closest('.element');
    const currentContent = currentBtn.querySelector('.element__contacts');

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

  // Открытие информации о контактах по клику/табу
  openContactInfo(e);

  // Удаление контакта по кнопке
  if (e.target.matches('.message__delete')) {
    deleteContact();
  }

  // Редактирования контакта по кнопке
  if (e.target.matches('.message__edit')) {
    const contactElement = e.target.closest('.message');
    openEditPopup(contactElement);
  }
});


// Обработчики действий по табу
document.querySelector('.contact-table').addEventListener('keydown', (evt) => {
  if (evt.keyCode === 32 || evt.key === 'Enter') {
    evt.preventDefault();
    openContactInfo(evt);

    // Удаление контакта по кнопке
    if (evt.target.matches('.message__delete')) {
      deleteContact();
    }

    // Редактирования контакта по кнопке
    if (evt.target.matches('.message__edit')) {
      const contactElement = evt.target.closest('.message');
      openEditPopup(contactElement);
    }
  }
});

export { getContactElement, addContactToStorage };
