import './modules/form-buttons.js';
import './modules/search-modal.js';
import { createColumn } from './modules/column.js';
import { ALPHABET_A_M, ALPHABET_N_Z } from './modules/mock.js';
import { phoneInput } from './modules/form-buttons.js';
import { initPhoneInput } from './modules/phone-mask.js';
import { getContacts } from './modules/contact-manager.js';
import { COLUMN_ELEMENT_SELECTOR } from './modules/constants.js';
import { addContact } from './modules/contact.js';

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
});
