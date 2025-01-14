import { validateInputs, showErrorSameValue, isContactExist, checkedValue, checkedPhone } from './validat.js';
import { addContactToStorage } from './contact.js';
import { contactsStorage, saveContactsToLocalStorage } from './local-storage.js';
import { updateCounter } from './counter.js';
import { searchModal } from './search-modal.js';

const nameInput = document.getElementById('name');
const positionInput = document.getElementById('position');
const phoneInput = document.getElementById('phone');

// Функция добавления контакта по кнопке ADD
function addContactToList() {
  const name = nameInput.value.trim();
  const position = positionInput.value.trim();
  const phone = phoneInput.value.trim();

  const errorMessage = document.querySelector('.interaction__error');
  const inputs = [nameInput, positionInput, phoneInput];

  // Проверка пустых значений
  if (!validateInputs(inputs, errorMessage)) {
    return;
  }

  // Проверка идентичных значений
  if (isContactExist(contactsStorage, name, position, phone)) {
    showErrorSameValue(errorMessage);
    return;
  }

  // Проверка имени и должности
  if (!checkedValue(nameInput, errorMessage) || !checkedValue(positionInput, errorMessage)) {
    return;
  }

  // Проверка телефона
  if (!checkedPhone(phoneInput, errorMessage)) {
    return;
  }

  const firstLetter = name[0].toUpperCase(); // Извлекаем первую букву имени
  const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest('.column__element');

  addContactToStorage(name, position, phone, letterElement);

  // Очищаем поля ввода
  nameInput.value = '';
  positionInput.value = '';
  phoneInput.value = '';
}

// Функция очищения всего списка
function clearAllContacts() {
  document.querySelectorAll('.column__element').forEach((letterElement) => {
    const contactsContainer = letterElement.querySelector('.element__contacts');

    // Удаляем все контакты
    contactsContainer.innerHTML = '';

    // Обновляем счётчик
    const counterElement = letterElement.querySelector('.element__counter');
    updateCounter(counterElement, contactsContainer);
  });

  // Очищаем хранилище
  contactsStorage.clear();

  // Обновляем данные в localStorage
  saveContactsToLocalStorage();
}

// Функция открытия модального окна поиска
function openSearchModal() {
  searchModal.classList.add('modal--open');
  document.querySelector('.body').style.overflow = 'hidden';
  searchModal.querySelector('input').focus(); // Перемещаем фокус на первое поле ввода
}

document.querySelector('.buttons').addEventListener('click', (e) => {

  // Обработчик для кнопки ADD
  if (e.target.matches('.buttons__button--add')) {
    e.preventDefault();
    addContactToList();
  }

  // Обработчик на кнопку Clear List
  if (e.target.matches('.buttons__button--clear')) {
    clearAllContacts();
  }

  // Обработчик на кнопку Search
  if (e.target.matches('.buttons__button--search')) {
    openSearchModal();
  }

});

export { phoneInput };
