import './modules/form-buttons.js';
import './modules/search-modal.js';
import { createColumn } from './modules/column.js';
import { ALPHABET_A_M, ALPHABET_N_Z } from './modules/mock.js';
import { phoneInput } from './modules/form-buttons.js';


// import { updateCounter } from './modules/counter.js';
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

  // const nameInput = document.getElementById('name');
  // const positionInput = document.getElementById('position');
  // // const phoneInput = document.getElementById('phone');
  // const addButton = document.querySelector('.buttons__button--add');


  // // Обработчик для кнопки ADD
  // addButton.addEventListener('click', (e) => {
  //   e.preventDefault();

  //   const name = nameInput.value.trim();
  //   const position = positionInput.value.trim();
  //   const phone = phoneInput.value.trim();

  //   const errorMessage = document.querySelector('.interaction__error');
  //   const inputs = [nameInput, positionInput, phoneInput];

  //   // Проверка пустых значений
  //   if (!validateInputs(inputs, errorMessage)) {
  //     return;
  //   }

  //   // Проверка идентичных значений
  //   if (isContactExist(contactsStorage, name, position, phone)) {
  //     showErrorSameValue(errorMessage);
  //     return;
  //   }

  //   // Проверка имени и должности
  //   if (!checkedValue(nameInput, errorMessage) || !checkedValue(positionInput, errorMessage)) {
  //     return;
  //   }

  //   // Проверка телефона
  //   if (!checkedPhone(phoneInput, errorMessage)) {
  //     return;
  //   }

  //   const firstLetter = name[0].toUpperCase(); // Извлекаем первую букву имени
  //   const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest('.column__element');

  //   addContactToStorage(name, position, phone, letterElement);

  //   // Очищаем поля ввода
  //   nameInput.value = '';
  //   positionInput.value = '';
  //   phoneInput.value = '';
  // });


  // // Функция очищения всего списка
  // const clearButton = document.querySelector('.buttons__button--clear');

  // const clearAllContacts = () => {
  //   document.querySelectorAll('.column__element').forEach((letterElement) => {
  //     const contactsContainer = letterElement.querySelector('.element__contacts');

  //     // Удаляем все контакты
  //     contactsContainer.innerHTML = '';

  //     // Обновляем счётчик
  //     const counterElement = letterElement.querySelector('.element__counter');
  //     updateCounter(counterElement, contactsContainer);
  //   });

  //   // Очищаем хранилище
  //   contactsStorage.clear();

  //   // Обновляем данные в localStorage
  //   saveContactsToLocalStorage();
  // };

  // // Обработчик на кнопку Clear List
  // clearButton.addEventListener('click', clearAllContacts);
});
