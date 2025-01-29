import { Counter } from './counter.js';
import { COLUMN_ELEMENT_SELECTOR, CONTACT_DELETE_BTN, CONTACT_EDIT_BTN, CONTACT_TABLE, CONTACTS_OPEN_SELECTOR, CONTACTS_SELECTOR, COUNTER_SELECTOR, ELEMENT_MESSAGE_SELECTOR, ELEMENT_SELECTOR, MESSAGE_NAME_SELECTOR, MESSAGE_PHONE_SELECTOR, MESSAGE_POSITION_SELECTOR, MESSAGE_SELECTOR, MESSAGE_TEMPLATE_SELECTOR } from './constants.js';
import { addContactToStorage, deleteContactToStorage, getContacts } from './contact-manager.js';
import { openEditPopup } from './edit-form.js';

const counters = {}; // Хранилище для счетчиков

function renderContactElement(name, position, phone) {
  const letterTemplate = document.querySelector(MESSAGE_TEMPLATE_SELECTOR).content.querySelector(MESSAGE_SELECTOR);
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

    // Если счетчик для этой буквы еще не создан, создаем его
    if (!counters[letter]) {
      counters[letter] = new Counter(counterElement, contactsContainer);
    }

    // Обновляем счетчик на основе текущего количества контактов
    counters[letter].count = contacts.length;
    counters[letter].update();
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
  const contactMessage = event.target.closest(MESSAGE_SELECTOR);
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
    const contactElements = contactsContainer.querySelectorAll(ELEMENT_MESSAGE_SELECTOR);

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
    const currentBtn = event.target.closest(ELEMENT_SELECTOR);
    const currentContent = currentBtn.querySelector(CONTACTS_SELECTOR);

    currentContent.classList.toggle(CONTACTS_OPEN_SELECTOR);

    if (currentContent.classList.contains(CONTACTS_OPEN_SELECTOR)) {
      currentContent.style.maxHeight = `${currentContent.scrollHeight}px`;
    } else {
      currentContent.style.maxHeight = 0;
    }
  }
}

document.querySelector(CONTACT_TABLE).addEventListener('click', (e) => {

  if (e.target.closest(CONTACT_DELETE_BTN)) {
    deleteContact(e);
    return;
  }

  if (e.target.closest(CONTACT_EDIT_BTN)) {
    const contactElement = e.target.closest(MESSAGE_SELECTOR);
    openEditPopup(contactElement);
    return;
  }

  openContactInfo(e);
});

document.querySelector(CONTACT_TABLE).addEventListener('keydown', (evt) => {
  if (evt.keyCode === 32 || evt.key === 'Enter') {
    evt.preventDefault();

    if (evt.target.matches(CONTACT_DELETE_BTN)) {
      deleteContact(evt);
      return;
    }

    if (evt.target.matches(CONTACT_EDIT_BTN)) {
      const contactElement = evt.target.closest(MESSAGE_SELECTOR);
      openEditPopup(contactElement);
      return;
    }

    openContactInfo(evt);
  }
});

export { renderContactElement, addContact, deleteContact, renderContacts, updateContact };
