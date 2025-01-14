import './modules/form-buttons.js';
import './modules/search-modal.js';
import { createColumn } from './modules/column.js';
import { ALPHABET_A_M, ALPHABET_N_Z } from './modules/mock.js';
import { phoneInput } from './modules/form-buttons.js';
import { loadContactsFromLocalStorage } from './modules/local-storage.js';
import { initPhoneInput } from './modules/phone-mask.js';

document.addEventListener('DOMContentLoaded', () => {
  // Заполняем столбцы буквами
  const containerLeft = document.querySelector('.column__left');
  const containerRight = document.querySelector('.column__right');

  createColumn(ALPHABET_A_M, containerLeft);
  createColumn(ALPHABET_N_Z, containerRight);

  // Загрузка контактов при старте
  loadContactsFromLocalStorage();

  // Работа с телефоном
  initPhoneInput(phoneInput);
});
