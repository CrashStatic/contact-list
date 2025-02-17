import './modules/form-buttons';
import { createColumn } from './modules/column';
import { ALPHABET_A_M, ALPHABET_N_Z } from './modules/alphabet';
import { phoneInput } from './modules/form-buttons';
import { initPhoneInput } from './modules/phone-mask';
import { getContacts } from './modules/contact-manager';
import { COLUMN_ELEMENT_SELECTOR,
  CONTACT_DELETE_BTN,
  CONTACT_EDIT_BTN,
  FORM_BTN_SAVE,
  MESSAGE_NAME_SELECTOR,
  MESSAGE_PHONE_SELECTOR,
  MESSAGE_POSITION_SELECTOR,
  MESSAGE_SELECTOR,
  MODAL_CLOSE_BTN,
  MODAL_OVERLAY,
  MODAL_SHOW_BTN } from './modules/constants';
import { addContact, deleteContact } from './modules/contact';
import { showAllContacts } from './modules/search';
import { openEditPopup, saveEditPopup } from './modules/edit-form';
import { closeModal, modal } from './modules/modal';
import { ContactInfo } from './types/contact';

document.addEventListener('DOMContentLoaded', () => {
  const containerLeft = document.querySelector('.column-left') as HTMLElement;
  const containerRight = document.querySelector('.column-right') as HTMLElement;

  createColumn(ALPHABET_A_M, containerLeft);
  createColumn(ALPHABET_N_Z, containerRight);

  // Используем getContacts, чтобы получить актуальные данные
  const contacts: ContactInfo[] = getContacts();

  contacts.forEach(({ name, position, phone }) => {
    const firstLetter = name[0].toUpperCase();
    const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest(COLUMN_ELEMENT_SELECTOR) as HTMLElement;

    if (letterElement) {
      const contact = {name, position, phone};
      addContact({ contact, letterElement, shouldSave: false});
    }
  });

  initPhoneInput(phoneInput);

  // Обработка кликов внутри модального окна
  modal.addEventListener('click', (e: Event) => {
    const target = e.target as Element;

    if (target.matches(MODAL_SHOW_BTN)) {
      showAllContacts();
    }

    if (target.matches(FORM_BTN_SAVE)) {
      saveEditPopup();
    }

    if (target.closest(CONTACT_DELETE_BTN)) {
      deleteContact(e);
      return;
    }

    if (target.closest(CONTACT_EDIT_BTN)) {
      const contactElement = target.closest(MESSAGE_SELECTOR) as HTMLElement;

      // Получаем данные из contactElement
      const name = contactElement.querySelector(MESSAGE_NAME_SELECTOR)?.textContent ?? '';
      const position = contactElement.querySelector(MESSAGE_POSITION_SELECTOR)?.textContent ?? '';
      const phone = contactElement.querySelector(MESSAGE_PHONE_SELECTOR)?.textContent ?? '';

      // Передаем объект ContactInfo в openEditPopup
      const contactInfo: ContactInfo = { name, position, phone };
      openEditPopup(contactInfo);
    }

    if (target.closest(MODAL_CLOSE_BTN) || target.matches(MODAL_OVERLAY)) {
      closeModal();
    }
  });
});
