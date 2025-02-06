import { Counter } from './counter';
import { COLUMN_ELEMENT_SELECTOR,
  CONTACT_DELETE_BTN,
  CONTACT_EDIT_BTN,
  CONTACT_TABLE,
  CONTACTS_OPEN_SELECTOR,
  CONTACTS_SELECTOR,
  COUNTER_SELECTOR,
  ELEMENT_MESSAGE_SELECTOR,
  ELEMENT_SELECTOR,
  MESSAGE_NAME_SELECTOR,
  MESSAGE_PHONE_SELECTOR,
  MESSAGE_POSITION_SELECTOR,
  MESSAGE_SELECTOR,
  MESSAGE_TEMPLATE_SELECTOR } from './constants';
import { addContactToStorage, deleteContactToStorage, getContacts } from './contact-manager';
import { openEditPopup } from './edit-form';
import { ContactInfo } from '../types/contact';
import {AddContactParams} from '../types/add-contact';

const counters: { [key: string]: Counter} = {}; // Хранилище для счетчиков

function renderContactElement({ name, position, phone }: ContactInfo) {
  const letterTemplate = document.querySelector(MESSAGE_TEMPLATE_SELECTOR) as HTMLTemplateElement;
  const content = letterTemplate.content.querySelector(MESSAGE_SELECTOR);

  const contactElement = content?.cloneNode(true) as HTMLElement;

  if (!contactElement) {
    return;
  }
  const nameElement = contactElement.querySelector(MESSAGE_NAME_SELECTOR) as HTMLElement;
  const positionElement = contactElement.querySelector(MESSAGE_POSITION_SELECTOR) as HTMLElement;
  const phoneElement = contactElement.querySelector(MESSAGE_PHONE_SELECTOR) as HTMLElement;

  if (!nameElement || !positionElement || !phoneElement) {
    return null;
  }

  // Обновляем все поля для нового контакта
  nameElement.textContent = name;
  positionElement.textContent = position;
  phoneElement.textContent = phone;
  return contactElement;
}

function renderContacts(contacts: ContactInfo[], container: HTMLElement) {
  container.innerHTML = '';
  contacts.forEach(({ name, position, phone }) => {
    const contactElement = renderContactElement({ name, position, phone });
    if (!contactElement) {
      return;
    }
    container.append(contactElement);
  });
}

function renderColumn(letter: string, contacts: ContactInfo[]): void {
  const columnElement = document.querySelector(`[data-id="${letter.toLowerCase()}"]`)?.closest(COLUMN_ELEMENT_SELECTOR);

  if (columnElement) {
    const contactsContainer = columnElement.querySelector(CONTACTS_SELECTOR) as HTMLElement;
    renderContacts(contacts, contactsContainer);

    const counterElement = columnElement.querySelector(COUNTER_SELECTOR) as HTMLElement;

    // Если счетчик для этой буквы еще не создан, создаем его
    if (!counters[letter]) {
      counters[letter] = new Counter(counterElement, contactsContainer);
    }

    // Обновляем счетчик на основе текущего количества контактов
    counters[letter].count = contacts.length;
    counters[letter].update();
  }
}

function addContact({ contact, letterElement, shouldSave = true }: AddContactParams): void {
  // Если необходимо, добавляем контакт в хранилище
  if (shouldSave) {
    addContactToStorage(contact);
  }

  const letter = letterElement.querySelector('[data-id]')?.textContent?.toUpperCase() ?? '';

  // Обновляем колонку, фильтруем контакты по первой букве имени
  const updatedContacts = getContacts().filter((item) => item.name[0].toUpperCase() === letter);
  renderColumn(letter, updatedContacts);
}


function deleteContact(event: Event): void {
  const target = event.target as Element;
  const contactMessage = target.closest(MESSAGE_SELECTOR);

  if (!contactMessage) {
    return;
  }

  const name = contactMessage.querySelector(MESSAGE_NAME_SELECTOR)?.textContent ?? '';
  const position = contactMessage.querySelector(MESSAGE_POSITION_SELECTOR)?.textContent ?? '';
  const phone = contactMessage.querySelector(MESSAGE_PHONE_SELECTOR)?.textContent ?? '';

  deleteContactToStorage({name, position, phone});

  contactMessage.remove();

  // Рендерим колонку заново
  const firstLetter = name[0].toUpperCase();
  const updatedContacts = getContacts().filter((contact) => contact.name[0].toUpperCase() === firstLetter);
  renderColumn(firstLetter, updatedContacts);
}

function updateContact(oldContact: ContactInfo, newContact: ContactInfo): void {
  const firstLetter = oldContact.name[0].toUpperCase();
  const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest(COLUMN_ELEMENT_SELECTOR);

  if (letterElement) {
    const contactsContainer = letterElement.querySelector(CONTACTS_SELECTOR) as HTMLElement;
    const contactElements = contactsContainer.querySelectorAll(ELEMENT_MESSAGE_SELECTOR);

    contactElements.forEach((contact: Element) => {
      const contactName = contact.querySelector(MESSAGE_NAME_SELECTOR)?.textContent ?? '';
      const contactPosition = contact.querySelector(MESSAGE_POSITION_SELECTOR)?.textContent ?? '';
      const contactPhone = contact.querySelector(MESSAGE_PHONE_SELECTOR)?.textContent ?? '';

      if (contactName === oldContact.name && contactPosition === oldContact.position && contactPhone === oldContact.phone) {
        const nameElement = contact.querySelector(MESSAGE_NAME_SELECTOR);
        const positionElelemnt = contact.querySelector(MESSAGE_POSITION_SELECTOR);
        const messageElement = contact.querySelector(MESSAGE_PHONE_SELECTOR);

        if (nameElement && positionElelemnt && messageElement) {
          nameElement.textContent = newContact.name;
          positionElelemnt.textContent = newContact.position;
          messageElement.textContent = newContact.phone;
        }
      }
    });
  }
}

function openContactInfo(event: Event): void {
  const target = event.target as Element;
  if (target.closest(COLUMN_ELEMENT_SELECTOR)) {
    const currentBtn = target.closest(ELEMENT_SELECTOR);

    if (!currentBtn) {
      return;
    }

    const currentContent = currentBtn.querySelector(CONTACTS_SELECTOR) as HTMLElement | null;

    if (!currentContent) {
      return;
    }

    currentContent.classList.toggle(CONTACTS_OPEN_SELECTOR);

    if (currentContent.classList.contains(CONTACTS_OPEN_SELECTOR)) {
      currentContent.style.maxHeight = `${currentContent.scrollHeight}px`;
    } else {
      currentContent.style.maxHeight = '0';
    }
  }
}

document.querySelector(CONTACT_TABLE)?.addEventListener('click', (e: Event) => {
  const target = e.target as Element;

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

  openContactInfo(e);
});

document.querySelector(CONTACT_TABLE)?.addEventListener('keydown', (event: Event) => {
  const keyboardEvent = event as KeyboardEvent;

  if (keyboardEvent.key === ' ' || keyboardEvent.key === 'Enter') {
    event.preventDefault();

    const target = event.target as Element;

    if (target.matches(CONTACT_DELETE_BTN)) {
      deleteContact(event);
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

    openContactInfo(event);
  }
});

export { renderContactElement, addContact, deleteContact, renderContacts, updateContact };
