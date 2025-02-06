import { ContactInfo } from '../types/contact';
import { CONTACT_EDIT_BTN,
  EDIT_POPUP,
  EDIT_POPUP_ERROR,
  EDIT_POPUP_NAME,
  EDIT_POPUP_PHONE,
  EDIT_POPUP_POSITION,
  MESSAGE_SELECTOR,
  MODAL_TITLE } from './constants';
import { updateContact } from './contact';
import { getContacts, updateContactInStorage } from './contact-manager';
import { closeModal, modal, onDocumentKeydown, openModal } from './modal';
import { initPhoneInput } from './phone-mask';
import { showError, validateForm } from './validat';
import {Validate} from '../types/validate';

const editPopupTemplate = document.querySelector(EDIT_POPUP) as HTMLTemplateElement | null;
let popupNameInput: HTMLInputElement | null;
let popupPositionInput: HTMLInputElement | null;
let popupPhoneInput: HTMLInputElement | null;

let currentContactElement: ContactInfo | null = null; // Контакт, который редактируется

function openEditPopup(contactElement: ContactInfo): void {
  if (editPopupTemplate) {
    openModal(editPopupTemplate);
  }

  const editTitle = modal.querySelector(MODAL_TITLE);
  if (editTitle) {
    editTitle.textContent = 'Edit contact';
  }

  currentContactElement = contactElement;

  // Заполняем поля данными контакта
  popupNameInput = modal.querySelector(EDIT_POPUP_NAME) as HTMLInputElement | null;
  popupPositionInput = modal.querySelector(EDIT_POPUP_POSITION) as HTMLInputElement | null;
  popupPhoneInput = modal.querySelector(EDIT_POPUP_PHONE) as HTMLInputElement | null;

  if (popupNameInput && popupPositionInput && popupPhoneInput) {
    popupNameInput.value = contactElement.name;
    popupPositionInput.value = contactElement.position;
    popupPhoneInput.value = contactElement.phone;
  }

  const input = modal.querySelector('input') as HTMLInputElement;
  input.focus();

  document.addEventListener('keydown', onDocumentKeydown);
}

function saveEditPopup() {
  const newName = popupNameInput?.value.trim() ?? '';
  const newPosition = popupPositionInput?.value.trim() ?? '';
  const newPhone = popupPhoneInput?.value ?? '';

  if (!currentContactElement) {
    return;
  }

  const oldName = currentContactElement.name;
  const oldPosition = currentContactElement.position;
  const oldPhone = currentContactElement.phone;

  if (!popupNameInput || !popupPositionInput || !popupPhoneInput) {
    return;
  }

  const inputs = [popupNameInput, popupPositionInput, popupPhoneInput];
  const errorMessage = document.querySelector(EDIT_POPUP_ERROR) as HTMLElement;

  if (popupPhoneInput) {
    initPhoneInput(popupPhoneInput);
  }

  // Валидация
  const storage: ContactInfo[] = getContacts();
  const { isValid, errors }: Validate = validateForm({inputs, storage, errorMessage});

  if (!isValid) {
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

  if (currentContactElement) {
    // Найдем элемент контакта, используя его имя, позицию или другой уникальный идентификатор
    const contactElement = document.querySelector(`[data-id="${currentContactElement.name[0].toUpperCase()}"]`)
      ?.querySelector(MESSAGE_SELECTOR);

    if (contactElement) {
      const editButton = contactElement.querySelector(CONTACT_EDIT_BTN) as HTMLElement;
      if (editButton) {
        editButton.focus();
      }
    }
  }

  currentContactElement = null;
}

export { openEditPopup, saveEditPopup };
