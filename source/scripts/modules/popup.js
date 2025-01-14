import { contactsStorage, saveContactsToLocalStorage } from './local-storage.js';

import { initPhoneInput } from './phone-mask.js';

import { validateInputs, checkedValue, checkedPhone, isContactExist, showErrorSameValue } from './validat.js';

// Элементы попапа
const editPopup = document.querySelector('#edit-popup');
const popupNameInput = editPopup.querySelector('.popup__input--name');
const popupPositionInput = editPopup.querySelector('.popup__input--position');
const popupPhoneInput = editPopup.querySelector('.popup__input--phone');
const popupSaveButton = editPopup.querySelector('.popup__button-save');
const popupCancelButton = editPopup.querySelector('.popup__button-cancel');
const popupOverlay = document.querySelector('.popup__overlay');

let currentContactElement = null; // Контакт, который редактируется


// Открытие попапа
function openEditPopup(contactElement) {
  currentContactElement = contactElement;

  // Заполняем поля попапа текущими данными контакта
  popupNameInput.value = contactElement.querySelector('.message__name').textContent;
  popupPositionInput.value = contactElement.querySelector('.message__position').textContent;
  popupPhoneInput.value = contactElement.querySelector('.message__phone').textContent;

  editPopup.classList.add('popup--open');
}

// Закрытие попапа
function closeEditPopup() {
  editPopup.classList.remove('popup--open');
  currentContactElement = null;
}

// Сохранение изменений в попапе
popupSaveButton.addEventListener('click', () => {
  const newName = popupNameInput.value.trim();
  const newPosition = popupPositionInput.value.trim();
  const newPhone = popupPhoneInput.value;

  const oldName = currentContactElement.querySelector('.message__name').textContent;
  const oldPosition = currentContactElement.querySelector('.message__position').textContent;
  const oldPhone = currentContactElement.querySelector('.message__phone').textContent;

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
  currentContactElement.querySelector('.message__name').textContent = newName;
  currentContactElement.querySelector('.message__position').textContent = newPosition;
  currentContactElement.querySelector('.message__phone').textContent = newPhone;

  // Обновляем данные в основном списке через взаимодействие в модальном окне
  const firstLetter = oldName[0].toUpperCase();
  const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest('.column__element');

  if (letterElement) {
    const contactsContainer = letterElement.querySelector('.element__contacts');
    const contactElements = contactsContainer.querySelectorAll('.element__message');

    contactElements.forEach((contact) => {
      const contactName = contact.querySelector('.message__name').textContent;
      const contactPosition = contact.querySelector('.message__position').textContent;
      const contactPhone = contact.querySelector('.message__phone').textContent;

      // Обновляем только нужный контакт
      if (contactName === oldName && contactPosition === oldPosition && contactPhone === oldPhone) {
        contact.querySelector('.message__name').textContent = newName;
        contact.querySelector('.message__position').textContent = newPosition;
        contact.querySelector('.message__phone').textContent = newPhone;
      }
    });
  }

  // Сохраняем изменения в localStorage
  saveContactsToLocalStorage();

  closeEditPopup();
});

// Закрытие попапа по клику на свободную область
popupOverlay.addEventListener('click', closeEditPopup);

// Отмена редактирования и закрытие попапа
popupCancelButton.addEventListener('click', closeEditPopup);

export { openEditPopup };
