import { COLUMN_ELEMENT_SELECTOR, CONTACTS_SELECTOR, MESSAGE_NAME_SELECTOR, MESSAGE_PHONE_SELECTOR, MESSAGE_POSITION_SELECTOR } from './constants.js';
import { getContacts, searchContacts, updateContactInStorage } from './contact-manager.js';
import { renderContactElement } from './contact.js';
import { initPhoneInput } from './phone-mask.js';
import { isEscapeKey } from './util.js';
import { validateEmptyValues, validateLetterValues, validatePhoneValues, validateSameValues } from './validat.js';

// Элементы модалки
const modal = document.querySelector('.modal');

// Переменные для шаблонов
const searchModalTemplate = document.querySelector('#search-modal-content');
const editPopupTemplate = document.querySelector('#edit-popup-content');

// Элементы попапа редактирования
const popupNameInput = editPopupTemplate.content.querySelector('#popup-name');
const popupPositionInput = editPopupTemplate.content.querySelector('#popup-position');
const popupPhoneInput = editPopupTemplate.content.querySelector('#popup-phone');

let currentContactElement = null; // Контакт, который редактируется

// Отображение результатов поиска
function displaySearchResults(results, area) {
  area.innerHTML = ''; // Очищаем область результатов

  if (results.length === 0) {
    area.textContent = 'No results found';
    return;
  }

  results.forEach(({ name, position, phone }) => {
    const contactElement = renderContactElement(name, position, phone);
    area.appendChild(contactElement);
  });
}

// Функция открытия модального окна поиска
function openSearchModal() {
  openModal(searchModalTemplate);
  const searchInput = modal.querySelector('.modal__input');
  const searchArea = modal.querySelector('.modal__search-area');

  // Обработчик для ввода поиска
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
      const results = searchContacts(query); // Ищем контакты по запросу
      displaySearchResults(results, searchArea); // Отображаем результаты
    } else {
      searchArea.innerHTML = ''; // Очищаем, если строка поиска пуста
    }
  });

  modal.querySelector('.modal__button-show').addEventListener('click', showAllContacts);
}

// Открытие модального окна (поиск или редактирование)
function openModal(template) {
  modal.classList.add('modal--open');
  document.querySelector('.body').style.overflow = 'hidden';

  const modalBody = modal.querySelector('.modal__body');
  modalBody.innerHTML = ''; // Очистить текущее содержимое модалки

  // Клонируем шаблон в модалку
  const content = template.content.cloneNode(true);
  modalBody.appendChild(content);

  // Слушаем закрытие модалки
  modal.addEventListener('click', closeModalHandler);

  document.addEventListener('keydown', onDocumentKeydown);
}

// Функция для кнопки "Show All" в модальном окне
function showAllContacts() {
  const allContacts = getContacts(); // Получаем все контакты из localStorage
  const searchArea = modal.querySelector('.modal__search-area');
  displaySearchResults(allContacts, searchArea); // Отображаем все контакты
  modal.querySelector('input').focus(); // Ставим фокус обратно на поле ввода
}

// Функция для открытия модалки редактирования
function openEditPopup(contactElement) {
  const editTitle = modal.querySelector('.modal__title');
  editTitle.textContent = 'Edit contact';
  currentContactElement = contactElement;

  // Заполняем поля попапа текущими данными контакта
  popupNameInput.value = contactElement.querySelector(MESSAGE_NAME_SELECTOR).textContent;
  popupPositionInput.value = contactElement.querySelector(MESSAGE_POSITION_SELECTOR).textContent;
  popupPhoneInput.value = contactElement.querySelector(MESSAGE_PHONE_SELECTOR).textContent;

  openModal(editPopupTemplate);

  // Удаляем старый обработчик
  const saveButton = modal.querySelector('.form__button--popup-save');
  saveButton.removeEventListener('click', saveEditPopup);

  // Добавляем новый обработчик
  saveButton.addEventListener('click', saveEditPopup);

  modal.querySelector('input').focus(); // Перемещаем фокус на первое поле ввода
  document.addEventListener('keydown', onDocumentKeydown);
}

// Закрытие модалки
function closeModal() {
  modal.classList.remove('modal--open');
  document.querySelector('.body').style.overflow = 'auto';
  document.removeEventListener('keydown', onDocumentKeydown);

  // Удаляем обработчик на закрытие, чтобы избежать утечек памяти
  modal.removeEventListener('click', closeModalHandler);
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

  // Работа с телефоном
  initPhoneInput(popupPhoneInput);

  // Проверка пустых значений
  if (!validateEmptyValues(inputs, errorMessage)) {
    return;
  }

  // Проверка идентичных значений
  if (validateSameValues(getContacts(), newName, newPosition, newPhone, errorMessage)) {
    return;
  }

  // Проверка имени и должности
  if (!validateLetterValues(popupNameInput, errorMessage) || !validateLetterValues(popupPositionInput, errorMessage)) {
    return;
  }

  // Проверка телефона
  if (!validatePhoneValues(popupPhoneInput, errorMessage)) {
    return;
  }

  // Создаем объект старого контакта для сравнения и нового контакта
  const oldContact = { name: oldName, position: oldPosition, phone: oldPhone };
  const newContact = { name: newName, position: newPosition, phone: newPhone };

  // Обновляем контакт в хранилище
  updateContactInStorage(oldContact, newContact);


  // Обновляем данные в DOM
  currentContactElement.querySelector(MESSAGE_NAME_SELECTOR).textContent = newName;
  currentContactElement.querySelector(MESSAGE_POSITION_SELECTOR).textContent = newPosition;
  currentContactElement.querySelector(MESSAGE_PHONE_SELECTOR).textContent = newPhone;

  // Обновляем данные в основном списке через взаимодействие в попапе
  const firstLetter = oldName[0].toUpperCase();
  const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest(COLUMN_ELEMENT_SELECTOR);

  if (letterElement) {
    const contactsContainer = letterElement.querySelector(CONTACTS_SELECTOR);
    const contactElements = contactsContainer.querySelectorAll('.element__message');

    contactElements.forEach((contact) => {
      const contactName = contact.querySelector(MESSAGE_NAME_SELECTOR).textContent;
      const contactPosition = contact.querySelector(MESSAGE_POSITION_SELECTOR).textContent;
      const contactPhone = contact.querySelector(MESSAGE_PHONE_SELECTOR).textContent;

      // Обновляем только нужный контакт
      if (contactName === oldName && contactPosition === oldPosition && contactPhone === oldPhone) {
        contact.querySelector(MESSAGE_NAME_SELECTOR).textContent = newName;
        contact.querySelector(MESSAGE_POSITION_SELECTOR).textContent = newPosition;
        contact.querySelector(MESSAGE_PHONE_SELECTOR).textContent = newPhone;
      }
    });
  }

  closeModal();
}

// Обработчики действий по клику
document.querySelector('.modal').addEventListener('click', (e) => {

  // Обработчки на конпку ShowAll
  if (e.target.matches('.modal__button-show')) {
    showAllContacts();
  }

  // Сохранение изменений
  if (e.target.matches('.form__button--popup-save')) {
    saveEditPopup();
  }

  // Редактирования контакта по кнопке
  if (e.target.closest('.js-edit-contact-button')) {
    const contactElement = e.target.closest('.message');
    openEditPopup(contactElement);
    return;
  }

  // Закрытие модального окна по клику на кнопку закрытия
  if (e.target.closest('.modal__close-button')) {
    closeModal();
  }

  // Закрытие модального окна по клику на свободную область
  if (e.target.matches('.modal__overlay')) {
    closeModal();
  }
});

// Закрытие модального окна через Escape
function onDocumentKeydown (evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
}

// Обработчик закрытия модалки
function closeModalHandler(e) {
  if (e.target.matches('.modal__overlay') || e.target.closest('.modal__close-button')) {
    closeModal();
  }
}

export { openSearchModal, openEditPopup };
