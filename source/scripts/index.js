import './modules/form-buttons.js';
import { createColumn } from './modules/column.js';
import { ALPHABET_A_M, ALPHABET_N_Z } from './modules/mock.js';
import { phoneInput } from './modules/form-buttons.js';
import { initPhoneInput } from './modules/phone-mask.js';
import { getContacts } from './modules/contact-manager.js';
import { COLUMN_ELEMENT_SELECTOR } from './modules/constants.js';
import { addContact, deleteContact } from './modules/contact.js';
import { showAllContacts } from './modules/search.js';
import { openEditPopup, saveEditPopup } from './modules/edit-form.js';
import { closeModal } from './modules/modal.js';

document.addEventListener('DOMContentLoaded', () => {
  const containerLeft = document.querySelector('.column-left');
  const containerRight = document.querySelector('.column-right');

  createColumn(ALPHABET_A_M, containerLeft);
  createColumn(ALPHABET_N_Z, containerRight);

  // Используем getContacts, чтобы получить актуальные данные
  const contacts = getContacts();

  contacts.forEach(({ name, position, phone }) => {
    const firstLetter = name[0].toUpperCase();
    const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest(COLUMN_ELEMENT_SELECTOR);

    if (letterElement) {
      addContact(name, position, phone, letterElement, false);
    }
  });

  initPhoneInput(phoneInput);

  // Обработка кликов внутри модального окна
  document.querySelector('.modal').addEventListener('click', (e) => {
    if (e.target.matches('.modal__button-show')) {
      showAllContacts();
    }

    if (e.target.matches('.form__button--popup-save')) {
      saveEditPopup();
    }

    if (e.target.closest('.js-delete-contact-button')) {
      deleteContact(e);
      return;
    }

    if (e.target.closest('.js-edit-contact-button')) {
      const contactElement = e.target.closest('.message');
      openEditPopup(contactElement);
      return;
    }

    if (e.target.closest('.modal__close-button') || e.target.matches('.modal__overlay')) {
      closeModal();
    }
  });
});
