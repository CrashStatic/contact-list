import { CONTACT_EDIT_BTN, EDIT_POPUP, EDIT_POPUP_ERROR, EDIT_POPUP_NAME, EDIT_POPUP_PHONE, EDIT_POPUP_POSITION, MESSAGE_NAME_SELECTOR, MESSAGE_PHONE_SELECTOR, MESSAGE_POSITION_SELECTOR, MODAL_TITLE } from './constants';
import { updateContact } from './contact';
import { getContacts, updateContactInStorage } from './contact-manager';
import { closeModal, modal, onDocumentKeydown, openModal } from './modal';
import { initPhoneInput } from './phone-mask';
import { showError, validateForm } from './validat';

const editPopupTemplate = document.querySelector(EDIT_POPUP);
let popupNameInput;
let popupPositionInput;
let popupPhoneInput;

let currentContactElement = null; // Контакт, который редактируется

function openEditPopup(contactElement) {
  openModal(editPopupTemplate);

  const editTitle = modal.querySelector(MODAL_TITLE);
  editTitle.textContent = 'Edit contact';

  currentContactElement = contactElement;

  // Заполняем поля данными контакта
  popupNameInput = modal.querySelector(EDIT_POPUP_NAME);
  popupPositionInput = modal.querySelector(EDIT_POPUP_POSITION);
  popupPhoneInput = modal.querySelector(EDIT_POPUP_PHONE);

  popupNameInput.value = contactElement.querySelector(MESSAGE_NAME_SELECTOR).textContent;
  popupPositionInput.value = contactElement.querySelector(MESSAGE_POSITION_SELECTOR).textContent;
  popupPhoneInput.value = contactElement.querySelector(MESSAGE_PHONE_SELECTOR).textContent;

  modal.querySelector('input').focus();
  document.addEventListener('keydown', onDocumentKeydown);
}

function saveEditPopup() {
  const newName = popupNameInput.value.trim();
  const newPosition = popupPositionInput.value.trim();
  const newPhone = popupPhoneInput.value;

  const oldName = currentContactElement.querySelector(MESSAGE_NAME_SELECTOR).textContent;
  const oldPosition = currentContactElement.querySelector(MESSAGE_POSITION_SELECTOR).textContent;
  const oldPhone = currentContactElement.querySelector(MESSAGE_PHONE_SELECTOR).textContent;

  const inputs = [popupNameInput, popupPositionInput, popupPhoneInput];
  const errorMessage = document.querySelector(EDIT_POPUP_ERROR);

  initPhoneInput(popupPhoneInput);

  // Валидация
  const { ok, errors } = validateForm(inputs, getContacts(), errorMessage);

  if (!ok) {
    // Если есть ошибки, отображаем их
    errors.forEach(({ input, message }) => {
      if (input) {
        showError(input, errorMessage, message);
      } else {
        errorMessage.textContent = message;
      }
    });
    return;
  }

  const oldContact = { name: oldName, position: oldPosition, phone: oldPhone };
  const newContact = { name: newName, position: newPosition, phone: newPhone };

  updateContactInStorage(oldContact, newContact);

  updateContact(oldContact, newContact);

  closeModal();

  // Возвращаем фокус на редактируемый контакт - на кнопку редактирования
  if (currentContactElement) {
    const editButton = currentContactElement.querySelector(CONTACT_EDIT_BTN);
    if (editButton) {
      editButton.focus();
    }
  }

  currentContactElement = null;
}

export { openEditPopup, saveEditPopup };
