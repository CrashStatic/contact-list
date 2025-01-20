import { COLUMN_ELEMENT_SELECTOR, CONTACTS_SELECTOR, MESSAGE_NAME_SELECTOR, MESSAGE_PHONE_SELECTOR, MESSAGE_POSITION_SELECTOR } from './constants.js';
import { contactsStorage, saveContactsToLocalStorage } from './local-storage.js';
import { initPhoneInput } from './phone-mask.js';
import { isEscapeKey } from './util.js';
import { validateEmptyValues, validateLetterValues, validatePhoneValues, validateSameValues } from './validat.js';

// Элементы попапа
const editPopup = document.querySelector('#edit-popup');
const popupNameInput = editPopup.querySelector('#popup-name');
const popupPositionInput = editPopup.querySelector('#popup-position');
const popupPhoneInput = editPopup.querySelector('#popup-phone');

let currentContactElement = null; // Контакт, который редактируется

// Открытие попапа
function openEditPopup(contactElement) {
  currentContactElement = contactElement;

  // Заполняем поля попапа текущими данными контакта
  popupNameInput.value = contactElement.querySelector(MESSAGE_NAME_SELECTOR).textContent;
  popupPositionInput.value = contactElement.querySelector(MESSAGE_POSITION_SELECTOR).textContent;
  popupPhoneInput.value = contactElement.querySelector(MESSAGE_PHONE_SELECTOR).textContent;

  editPopup.classList.add('popup--open');
  editPopup.querySelector('input').focus(); // Перемещаем фокус на первое поле ввода
  document.addEventListener('keydown', onDocumentKeydown);
}

// Закрытие попапа
function closeEditPopup() {
  editPopup.classList.remove('popup--open');

  // Возвращаем фокус на редактируемый контакт - на кнопку редактирования
  if (currentContactElement) {
    const editButton = currentContactElement.querySelector('.message__edit');
    if (editButton) {
      editButton.focus(); // Устанавливаем фокус на кнопку редактирования
    }
  }

  currentContactElement = null;
}

// Сохранение изменений в попапе
function saveEditPopup() {
  const newName = popupNameInput.value.trim();
  const newPosition = popupPositionInput.value.trim();
  const newPhone = popupPhoneInput.value;

  const oldName = currentContactElement.querySelector(MESSAGE_NAME_SELECTOR).textContent;
  const oldPosition = currentContactElement.querySelector(MESSAGE_POSITION_SELECTOR).textContent;
  const oldPhone = currentContactElement.querySelector(MESSAGE_PHONE_SELECTOR).textContent;

  const inputs = [popupNameInput, popupPositionInput, popupPhoneInput];
  const errorMessage = document.querySelector('.popup__error');

  // Работа с телефоном
  initPhoneInput(popupPhoneInput);

  // Проверка пустых значений
  if (!validateEmptyValues(inputs, errorMessage)) {
    return;
  }

  // Проверка идентичных значений
  if (validateSameValues(contactsStorage, newName, newPosition, newPhone, errorMessage)) {
    return;
  }

  // Проверка имени и должности
  if (!validateLetterValues(popupNameInput, errorMessage) || !validateLetterValues(popupPositionInput, errorMessage)) {
    return;
  }

  // Проверка телефона
  if (!validatePhoneValues(popupPhoneInput, errorMessage)) {
    return;
  }

  // Удаляем старый контакт из хранилища
  const oldIndex = contactsStorage.findIndex((contact) =>
    contact.name === oldName && contact.position === oldPosition && contact.phone === oldPhone
  );

  if (oldIndex !== -1) {
    contactsStorage.splice(oldIndex, 1); // Удаляем старый контакт
  }

  // Добавляем обновленный контакт в хранилище
  contactsStorage.push({ name: newName, position: newPosition, phone: newPhone });

  // Обновляем данные в DOM
  currentContactElement.querySelector(MESSAGE_NAME_SELECTOR).textContent = newName;
  currentContactElement.querySelector(MESSAGE_POSITION_SELECTOR).textContent = newPosition;
  currentContactElement.querySelector(MESSAGE_PHONE_SELECTOR).textContent = newPhone;

  // Обновляем данные в основном списке через взаимодействие в попапе
  const firstLetter = oldName[0].toUpperCase();
  const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest(COLUMN_ELEMENT_SELECTOR);

  if (letterElement) {
    const contactsContainer = letterElement.querySelector(CONTACTS_SELECTOR);
    const contactElements = contactsContainer.querySelectorAll('.element__message');

    contactElements.forEach((contact) => {
      const contactName = contact.querySelector(MESSAGE_NAME_SELECTOR).textContent;
      const contactPosition = contact.querySelector(MESSAGE_POSITION_SELECTOR).textContent;
      const contactPhone = contact.querySelector(MESSAGE_PHONE_SELECTOR).textContent;

      // Обновляем только нужный контакт
      if (contactName === oldName && contactPosition === oldPosition && contactPhone === oldPhone) {
        contact.querySelector(MESSAGE_NAME_SELECTOR).textContent = newName;
        contact.querySelector(MESSAGE_POSITION_SELECTOR).textContent = newPosition;
        contact.querySelector(MESSAGE_PHONE_SELECTOR).textContent = newPhone;
      }
    });
  }

  // Сохраняем изменения в localStorage
  saveContactsToLocalStorage();

  closeEditPopup();
}

// Обработчики действий
document.querySelector('.popup').addEventListener('click', (e) => {

  // Сохранение изменений
  if (e.target.matches('.form__button--popup-save')) {
    saveEditPopup();
  }

  // Закрытие попапа по клику на свободную область
  if (e.target.matches('.popup__overlay')) {
    closeEditPopup();
  }

  // Отмена редактирования и закрытие попапа
  if (e.target.closest('.popup__button-cancel')) {
    closeEditPopup();
  }
});

// Закрфтие попапа через Escape
function onDocumentKeydown (evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeEditPopup();
  }
}

export { openEditPopup };
