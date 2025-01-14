import { COLUMN_ELEMENT_SELECTOR, CONTACTS_SELECTOR, MESSAGE_NAME_SELECTOR, MESSAGE_PHONE_SELECTOR, MESSAGE_POSITION_SELECTOR } from './constants.js';
import { contactsStorage, saveContactsToLocalStorage } from './local-storage.js';
import { initPhoneInput } from './phone-mask.js';
import { validateInputs, checkedValue, checkedPhone, isContactExist, showErrorSameValue } from './validat.js';

// Элементы попапа
const editPopup = document.querySelector('#edit-popup');
const popupNameInput = editPopup.querySelector('.popup__input--name');
const popupPositionInput = editPopup.querySelector('.popup__input--position');
const popupPhoneInput = editPopup.querySelector('.popup__input--phone');

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
  if (!validateInputs(inputs, errorMessage)) {
    return;
  }

  // Проверка идентичных значений
  if (isContactExist(contactsStorage, newName, newPosition, newPhone)) {
    showErrorSameValue(errorMessage);
    return;
  }

  // Проверка имени и должности
  if (!checkedValue(popupNameInput, errorMessage) || !checkedValue(popupPositionInput, errorMessage)) {
    return;
  }

  // Проверка телефона
  if (!checkedPhone(popupPhoneInput, errorMessage)) {
    return;
  }

  // Удаляем старый контакт из хранилища
  contactsStorage.delete(`${oldName.toLowerCase()}|${oldPosition.toLowerCase()}|${oldPhone}`);

  // Обновляем контакт в хранилище
  contactsStorage.set(`${newName.toLowerCase()}|${newPosition.toLowerCase()}|${newPhone}`, { name: newName, position: newPosition, phone: newPhone });

  // Обновляем данные в DOM
  currentContactElement.querySelector(MESSAGE_NAME_SELECTOR).textContent = newName;
  currentContactElement.querySelector(MESSAGE_POSITION_SELECTOR).textContent = newPosition;
  currentContactElement.querySelector(MESSAGE_PHONE_SELECTOR).textContent = newPhone;

  // Обновляем данные в основном списке через взаимодействие в модальном окне
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
  if (e.target.matches('.popup__button-save')) {
    saveEditPopup();
  }

  // Закрытие попапа по клику на свободную область
  if (e.target.matches('.popup__overlay')) {
    closeEditPopup();
  }

  // Отмена редактирования и закрытие попапа
  if (e.target.matches('.popup__button-cancel')) {
    closeEditPopup();
  }
});

export { openEditPopup };
