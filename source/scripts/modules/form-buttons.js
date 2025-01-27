import { validateForm, showError } from './validat.js';
import { updateCounter } from './counter.js';
import { openSearchModal } from './search-modal.js';
import { COLUMN_ELEMENT_SELECTOR, CONTACTS_SELECTOR, COUNTER_SELECTOR } from './constants.js';
import { addContact } from './contact.js';
import { clearAllContactsInStorage, getContacts } from './contact-manager.js';

const nameInput = document.getElementById('name');
const positionInput = document.getElementById('position');
const phoneInput = document.getElementById('phone');

function addContactToList() {
  const name = nameInput.value.trim();
  const position = positionInput.value.trim();
  const phone = phoneInput.value.trim();

  const errorMessage = document.querySelector('.form__error');
  const inputs = [nameInput, positionInput, phoneInput];

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

  const firstLetter = name[0].toUpperCase(); // Извлекаем первую букву имени
  const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest(COLUMN_ELEMENT_SELECTOR);

  addContact(name, position, phone, letterElement);

  nameInput.value = '';
  positionInput.value = '';
  phoneInput.value = '';
}

function clearAllContacts() {
  document.querySelectorAll(COLUMN_ELEMENT_SELECTOR).forEach((letterElement) => {
    const contactsContainer = letterElement.querySelector(CONTACTS_SELECTOR);

    contactsContainer.innerHTML = '';

    const counterElement = letterElement.querySelector(COUNTER_SELECTOR);
    updateCounter(counterElement, contactsContainer);
  });

  clearAllContactsInStorage();
}

document.querySelector('.form__buttons').addEventListener('click', (e) => {
  if (e.target.matches('.js-add-contact-button')) {
    e.preventDefault();
    addContactToList();
  }

  if (e.target.matches('.js-clear-contact-button')) {
    clearAllContacts();
  }

  if (e.target.matches('.js-search-contact-button')) {
    openSearchModal();
  }

});

export { nameInput, positionInput, phoneInput };
