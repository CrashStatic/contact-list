import { MESSAGE_NAME_SELECTOR, MESSAGE_PHONE_SELECTOR, MESSAGE_POSITION_SELECTOR } from './constants.js';
import { getContacts, searchContacts, updateContactInStorage } from './contact-manager.js';
import { deleteContact, renderContactElement, updateContact } from './contact.js';
import { initPhoneInput } from './phone-mask.js';
import { isEscapeKey } from './util.js';
import { validateEmptyValues, validateLetterValues, validatePhoneValues, validateSameValues } from './validat.js';

const modal = document.querySelector('.modal');
const searchModalTemplate = document.querySelector('#search-modal-content');
const editPopupTemplate = document.querySelector('#edit-popup-content');
let popupNameInput;
let popupPositionInput;
let popupPhoneInput;

let currentContactElement = null; // Контакт, который редактируется

function displaySearchResults(results, area) {
  area.innerHTML = '';

  if (results.length === 0) {
    area.textContent = 'No results found';
    return;
  }

  results.forEach(({ name, position, phone }) => {
    const contactElement = renderContactElement(name, position, phone);
    area.appendChild(contactElement);
  });
}

function listenSearchInput(element, area) {
  element.addEventListener('input', () => {
    const query = element.value.trim().toLowerCase();
    if (query) {
      const results = searchContacts(query);
      displaySearchResults(results, area);
    } else {
      area.innerHTML = '';
    }
  });
}

function openSearchModal() {
  openModal(searchModalTemplate);
  const searchInput = modal.querySelector('.modal__input');
  const searchArea = modal.querySelector('.modal__search-area');

  listenSearchInput(searchInput, searchArea);

  modal.querySelector('.modal__button-show').addEventListener('click', showAllContacts);
}

function openModal(template) {
  modal.classList.add('modal--open');
  document.querySelector('.body').style.overflow = 'hidden';

  const modalBody = modal.querySelector('.modal__body');
  modalBody.innerHTML = '';

  const content = template.content.cloneNode(true);
  modalBody.appendChild(content);

  popupNameInput = modal.querySelector('#popup-name');
  popupPositionInput = modal.querySelector('#popup-position');
  popupPhoneInput = modal.querySelector('#popup-phone');

  modal.querySelector('input').focus();

  document.addEventListener('keydown', onDocumentKeydown);
}

function showAllContacts() {
  const allContacts = getContacts(); // Получаем все контакты из localStorage
  const searchArea = modal.querySelector('.modal__search-area');
  displaySearchResults(allContacts, searchArea);
  modal.querySelector('input').focus();
}

function openEditPopup(contactElement) {
  const editTitle = modal.querySelector('.modal__title');
  editTitle.textContent = 'Edit contact';
  currentContactElement = contactElement;

  openModal(editPopupTemplate);

  popupNameInput.value = contactElement.querySelector(MESSAGE_NAME_SELECTOR).textContent;
  popupPositionInput.value = contactElement.querySelector(MESSAGE_POSITION_SELECTOR).textContent;
  popupPhoneInput.value = contactElement.querySelector(MESSAGE_PHONE_SELECTOR).textContent;

  modal.querySelector('input').focus();
  document.addEventListener('keydown', onDocumentKeydown);
}

function closeModal() {
  modal.classList.remove('modal--open');
  document.querySelector('.body').style.overflow = 'auto';
  document.removeEventListener('keydown', onDocumentKeydown);

  modal.removeEventListener('click', closeModalHandler);

  // Возвращаем фокус на редактируемый контакт - на кнопку редактирования
  if (currentContactElement) {
    const editButton = currentContactElement.querySelector('.js-edit-contact-button');
    if (editButton) {
      editButton.focus();
    }
  }

  currentContactElement = null;
}

function saveEditPopup() {
  const newName = popupNameInput.value.trim();
  const newPosition = popupPositionInput.value.trim();
  const newPhone = popupPhoneInput.value;

  const oldName = currentContactElement.querySelector(MESSAGE_NAME_SELECTOR).textContent;
  const oldPosition = currentContactElement.querySelector(MESSAGE_POSITION_SELECTOR).textContent;
  const oldPhone = currentContactElement.querySelector(MESSAGE_PHONE_SELECTOR).textContent;

  const inputs = [popupNameInput, popupPositionInput, popupPhoneInput];
  const errorMessage = document.querySelector('.popup__error');

  initPhoneInput(popupPhoneInput);

  if (!validateEmptyValues(inputs, errorMessage)) {
    return;
  }

  if (validateSameValues(getContacts(), newName, newPosition, newPhone, errorMessage)) {
    return;
  }

  if (!validateLetterValues(popupNameInput, errorMessage) || !validateLetterValues(popupPositionInput, errorMessage)) {
    return;
  }

  if (!validatePhoneValues(popupPhoneInput, errorMessage)) {
    return;
  }

  const oldContact = { name: oldName, position: oldPosition, phone: oldPhone };
  const newContact = { name: newName, position: newPosition, phone: newPhone };

  updateContactInStorage(oldContact, newContact);

  updateContact(oldContact, newContact);

  closeModal();
}

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

  if (e.target.closest('.modal__close-button')) {
    closeModal();
  }

  if (e.target.matches('.modal__overlay')) {
    closeModal();
  }
});

function onDocumentKeydown (evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
}

function closeModalHandler(e) {
  if (e.target.matches('.modal__overlay') || e.target.closest('.modal__close-button')) {
    closeModal();
  }
}

export { openSearchModal, openEditPopup };
