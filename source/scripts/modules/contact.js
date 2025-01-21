import { updateCounter } from './counter.js';
import { COLUMN_ELEMENT_SELECTOR, CONTACTS_SELECTOR, COUNTER_SELECTOR, MESSAGE_NAME_SELECTOR, MESSAGE_PHONE_SELECTOR, MESSAGE_POSITION_SELECTOR } from './constants.js';
import { addContactToStorage, deleteContactToStorage, getContacts } from './contact-manager.js';
import { openEditPopup } from './search-modal.js';

function renderContactElement(name, position, phone) {
  const letterTemplate = document.querySelector('#message').content.querySelector('.message');
  const contactElement = letterTemplate.cloneNode(true);
  contactElement.querySelector(MESSAGE_NAME_SELECTOR).textContent = name;
  contactElement.querySelector(MESSAGE_POSITION_SELECTOR).textContent = position;
  contactElement.querySelector(MESSAGE_PHONE_SELECTOR).textContent = phone;
  return contactElement;
}

function renderContacts(contacts, container) {
  container.innerHTML = '';
  contacts.forEach(({ name, position, phone }) => {
    const contactElement = renderContactElement(name, position, phone);
    container.append(contactElement);
  });
}

function renderColumn(letter, contacts) {
  const columnElement = document.querySelector(`[data-id="${letter.toLowerCase()}"]`)?.closest(COLUMN_ELEMENT_SELECTOR);

  if (columnElement) {
    const contactsContainer = columnElement.querySelector(CONTACTS_SELECTOR);
    renderContacts(contacts, contactsContainer);

    const counterElement = columnElement.querySelector(COUNTER_SELECTOR);
    updateCounter(counterElement, contactsContainer);
  }
}

function addContact(name, position, phone, letterElement, shouldSave = true) {
  // Если необходимо, добавляем контакт в хранилище
  if (shouldSave) {
    addContactToStorage(name, position, phone);
  }

  const letter = letterElement.querySelector('[data-id]').textContent.toUpperCase();

  // Обновляем колонку, фильтруем контакты по первой букве имени
  const updatedContacts = getContacts().filter((contact) => contact.name[0].toUpperCase() === letter);
  renderColumn(letter, updatedContacts);
}

function deleteContact(event) {
  const contactMessage = event.target.closest('.message');
  const name = contactMessage.querySelector(MESSAGE_NAME_SELECTOR).textContent;
  const position = contactMessage.querySelector(MESSAGE_POSITION_SELECTOR).textContent;
  const phone = contactMessage.querySelector(MESSAGE_PHONE_SELECTOR).textContent;

  deleteContactToStorage(name, position, phone);

  contactMessage.remove();

  // Рендерим колонку заново
  const firstLetter = name[0].toUpperCase();
  const updatedContacts = getContacts().filter((contact) => contact.name[0].toUpperCase() === firstLetter);
  renderColumn(firstLetter, updatedContacts);
}

function updateContact(oldContact, newContact) {
  const firstLetter = oldContact.name[0].toUpperCase();
  const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest(COLUMN_ELEMENT_SELECTOR);

  if (letterElement) {
    const contactsContainer = letterElement.querySelector(CONTACTS_SELECTOR);
    const contactElements = contactsContainer.querySelectorAll('.element__message');

    contactElements.forEach((contact) => {
      const contactName = contact.querySelector(MESSAGE_NAME_SELECTOR).textContent;
      const contactPosition = contact.querySelector(MESSAGE_POSITION_SELECTOR).textContent;
      const contactPhone = contact.querySelector(MESSAGE_PHONE_SELECTOR).textContent;

      if (contactName === oldContact.name && contactPosition === oldContact.position && contactPhone === oldContact.phone) {
        contact.querySelector(MESSAGE_NAME_SELECTOR).textContent = newContact.name;
        contact.querySelector(MESSAGE_POSITION_SELECTOR).textContent = newContact.position;
        contact.querySelector(MESSAGE_PHONE_SELECTOR).textContent = newContact.phone;
      }
    });
  }
}

function openContactInfo(event) {
  if (event.target.closest(COLUMN_ELEMENT_SELECTOR)) {
    const currentBtn = event.target.closest('.element');
    const currentContent = currentBtn.querySelector(CONTACTS_SELECTOR);

    currentContent.classList.toggle('element__contacts--open');

    if (currentContent.classList.contains('element__contacts--open')) {
      currentContent.style.maxHeight = `${currentContent.scrollHeight}px`;
    } else {
      currentContent.style.maxHeight = 0;
    }
  }
}

document.querySelector('.contact-table').addEventListener('click', (e) => {

  if (e.target.closest('.js-delete-contact-button')) {
    deleteContact(e);
    return;
  }

  if (e.target.closest('.js-edit-contact-button')) {
    const contactElement = e.target.closest('.message');
    openEditPopup(contactElement);
    return;
  }

  openContactInfo(e);
});

document.querySelector('.contact-table').addEventListener('keydown', (evt) => {
  if (evt.keyCode === 32 || evt.key === 'Enter') {
    evt.preventDefault();

    if (evt.target.matches('.js-delete-contact-button')) {
      deleteContact(evt);
      return;
    }

    if (evt.target.matches('.js-edit-contact-button')) {
      const contactElement = evt.target.closest('.message');
      openEditPopup(contactElement);
      return;
    }

    openContactInfo(evt);
  }
});

export { renderContactElement, addContact, deleteContact, renderContacts, updateContact };
