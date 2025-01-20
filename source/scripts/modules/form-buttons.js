import { validateEmptyValues, validateSameValues, validateLetterValues, validatePhoneValues } from './validat.js';
import { saveContacts } from './local-storage.js';
import { updateCounter } from './counter.js';
import { closeSearchModal, searchModal } from './search-modal.js';
import { COLUMN_ELEMENT_SELECTOR, CONTACTS_SELECTOR, COUNTER_SELECTOR } from './constants.js';
import { isEscapeKey } from './util.js';
import { addContact } from './contact.js';
import { getContacts } from './contact-manager.js';

const nameInput = document.getElementById('name');
const positionInput = document.getElementById('position');
const phoneInput = document.getElementById('phone');

// Функция добавления контакта по кнопке ADD
function addContactToList() {
  const name = nameInput.value.trim();
  const position = positionInput.value.trim();
  const phone = phoneInput.value.trim();

  const errorMessage = document.querySelector('.form__error');
  const inputs = [nameInput, positionInput, phoneInput];

  // Проверка пустых значений
  if (!validateEmptyValues(inputs, errorMessage)) {
    return;
  }

  // Проверка идентичных значений
  if (validateSameValues(getContacts(), name, position, phone, errorMessage)) {
    return;
  }

  // Проверка имени и должности
  if (!validateLetterValues(nameInput, errorMessage) || !validateLetterValues(positionInput, errorMessage)) {
    return;
  }

  // Проверка телефона
  if (!validatePhoneValues(phoneInput, errorMessage)) {
    return;
  }

  const firstLetter = name[0].toUpperCase(); // Извлекаем первую букву имени
  const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest(COLUMN_ELEMENT_SELECTOR);

  addContact(name, position, phone, letterElement);

  // Очищаем поля ввода
  nameInput.value = '';
  positionInput.value = '';
  phoneInput.value = '';
}

// Функция очищения всего списка
function clearAllContacts() {
  document.querySelectorAll(COLUMN_ELEMENT_SELECTOR).forEach((letterElement) => {
    const contactsContainer = letterElement.querySelector(CONTACTS_SELECTOR);

    // Удаляем все контакты
    contactsContainer.innerHTML = '';

    // Обновляем счётчик
    const counterElement = letterElement.querySelector(COUNTER_SELECTOR);
    updateCounter(counterElement, contactsContainer);
  });

  // Очищаем хранилище
  const contactsStorage = getContacts();
  contactsStorage.length = 0;

  // Сохраняем обновленное состояние в localStorage
  saveContacts(contactsStorage);
}

// Функция открытия модального окна поиска
function openSearchModal() {
  searchModal.classList.add('modal--open');
  document.querySelector('.body').style.overflow = 'hidden';
  searchModal.querySelector('input').focus(); // Перемещаем фокус на первое поле ввода
  document.addEventListener('keydown', onDocumentKeydown);
}

document.querySelector('.form__buttons').addEventListener('click', (e) => {

  // Обработчик для кнопки ADD
  if (e.target.matches('.js-add-contact-button')) {
    e.preventDefault();
    addContactToList();
  }

  // Обработчик на кнопку Clear List
  if (e.target.matches('.js-clear-contact-button')) {
    clearAllContacts();
  }

  // Обработчик на кнопку Search
  if (e.target.matches('.js-search-contact-button')) {
    openSearchModal();
  }

});

// Закрытие модального окна через Escape
function onDocumentKeydown (evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeSearchModal();
  }
}

export { nameInput, positionInput, phoneInput };
