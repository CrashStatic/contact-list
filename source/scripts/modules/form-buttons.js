import { validateForm, showError } from './validat.js';
import { Counter } from './counter.js';
import { COLUMN_ELEMENT_SELECTOR, CONTACT_CLEAR_BTN, CONTACT_SEARCH_BTN, CONTACTS_SELECTOR, COUNTER_SELECTOR, FORM_BTNS, FORM_ERROR, FORM_NAME_ID, FORM_PHONE_ID, FORM_POSITION_ID, FORM_SELECTOR } from './constants.js';
import { addContact } from './contact.js';
import { clearAllContactsInStorage, getContacts } from './contact-manager.js';
import { openSearchModal } from './search.js';

const nameInput = document.getElementById(FORM_NAME_ID);
const positionInput = document.getElementById(FORM_POSITION_ID);
const phoneInput = document.getElementById(FORM_PHONE_ID);

function addContactToList() {
  const name = nameInput.value.trim();
  const position = positionInput.value.trim();
  const phone = phoneInput.value.trim();

  const errorMessage = document.querySelector(FORM_ERROR);
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
    const counter = new Counter(counterElement, contactsContainer);
    counter.reset();
  });

  clearAllContactsInStorage();
}

document.querySelector(FORM_SELECTOR).addEventListener('submit', (e) => {
  e.preventDefault();
  addContactToList();
});

document.querySelector(FORM_BTNS).addEventListener('click', (e) => {
  if (e.target.matches(CONTACT_CLEAR_BTN)) {
    clearAllContacts();
  }

  if (e.target.matches(CONTACT_SEARCH_BTN)) {
    openSearchModal();
  }

});

export { nameInput, positionInput, phoneInput };
