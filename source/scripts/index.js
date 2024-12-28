import { createColumn } from './modules/column.js';
import { ALPHABET_A_M, ALPHABET_N_Z } from './modules/mock.js';

const MINIMUM_LENGTH = 3;
const PHONE_LENGTH_MIN = 11;
const PHONE_LENGTH_MAX = 16;

document.addEventListener('DOMContentLoaded', () => {
  const containerLeft = document.querySelector('.column__left');
  const containerRight = document.querySelector('.column__right');

  createColumn(ALPHABET_A_M, containerLeft);
  createColumn(ALPHABET_N_Z, containerRight);

  // Селекторы элементов
  const nameInput = document.getElementById('name');
  const positionInput = document.getElementById('position');
  const phoneInput = document.getElementById('phone');
  const addButton = document.querySelector('.buttons__button--add');

  const contactsStorage = new Map(); // Хранилище контактов

  // Загрузка контактов из localStorage
  function loadContactsFromLocalStorage() {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      try {
        const contacts = JSON.parse(savedContacts); // Преобразуем строку в массив
        if (Array.isArray(contacts)) {
          contacts.forEach(({ name, position, phone }) => {
            const firstLetter = name[0].toUpperCase();
            const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest('.column__element');
            if (letterElement) {
              addContactToStorage(name, position, phone, letterElement);
            }
          });
        }
      } catch (error) {
        console.error('Ошибка парсинга данных из localStorage:', error);
      }
    }
  }

  // Сохранение контактов в localStorage
  function saveContactsToLocalStorage() {
    const contactsArray = Array.from(contactsStorage.values());
    localStorage.setItem('contacts', JSON.stringify(contactsArray));
  }

  // Проверка на существование контакта
  function isContactExist(name, position, phone) {
    return contactsStorage.has(`${name.toLowerCase()}|${position.toLowerCase()}|${phone}`);
  }


  // Функция создания контакта
  const getContactElement = (name, position, phone) => {
    const letterTemplate = document.querySelector('#message').content.querySelector('.message');
    const contactElement = letterTemplate.cloneNode(true);
    contactElement.querySelector('.message__name').textContent = name;
    contactElement.querySelector('.message__position').textContent = position;
    contactElement.querySelector('.message__phone').textContent = phone;
    return contactElement;
  };


  // Добавление контакта в DOM и запись в хранилище
  function addContactToStorage(name, position, phone, letterElement, saveToLocal = true) {

    // Заполняем контакт
    const contactElement = getContactElement(name, position, phone);

    // Добавляем контакт в DOM
    const contactsContainer = letterElement.querySelector('.element__contacts');
    contactsContainer.append(contactElement); // Добавляем контакт

    // Обновляем счётчик
    updateCounter(letterElement);

    // Сохраняем контакт в хранилище
    contactsStorage.set(`${name.toLowerCase()}|${position.toLowerCase()}|${phone}`, { name, position, phone });

    // Сохраняем в localStorage, если нужно
    if (saveToLocal) {
      saveContactsToLocalStorage();
    }
  }


  // Обработчик для кнопки ADD
  addButton.addEventListener('click', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const position = positionInput.value.trim();
    const phone = phoneInput.value.trim();

    const inputs = [nameInput, positionInput, phoneInput];

    // Проверка пустых значений
    if (!validateInputs(inputs)) {
      return;
    }

    // Проверка идентичных значений
    if (isContactExist(name, position, phone)) {
      showErrorSameValue();
      return;
    }

    // Проверка имени и должности
    if (!checkedValue(nameInput) || !checkedValue(positionInput)) {
      return;
    }

    // Проверка телефона
    if (!checkedPhone(phoneInput)) {
      return;
    }

    const firstLetter = name[0].toUpperCase(); // Извлекаем первую букву имени
    const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest('.column__element');

    addContactToStorage(name, position, phone, letterElement);

    // Очищаем поля ввода
    nameInput.value = '';
    positionInput.value = '';
    phoneInput.value = '';
  });


  // Раскрывающееся меню с контактами при клике на букву
  const letterElements = document.querySelectorAll('.element__container');

  letterElements.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      const currentBtn = e.target.closest('.element');
      const currentContent = currentBtn.querySelector('.element__contacts');

      currentContent.classList.toggle('element__contacts--open');

      if (currentContent.classList.contains('element__contacts--open')) {
        currentContent.style.maxHeight = `${currentContent.scrollHeight}px`;
      } else {
        currentContent.style.maxHeight = 0;
      }
    });
  });


  // Функция для обновления счётчика
  function updateCounter(letterContainer) {
    const counterElement = letterContainer.querySelector('.element__counter');
    const contactsContainer = letterContainer.querySelector('.element__contacts');

    const count = contactsContainer.children.length; // Количество контактов

    if (count > 0) {
      counterElement.classList.add('element__counter--active');
      counterElement.textContent = count;
    } else {
      counterElement.classList.remove('element__counter--active');
      counterElement.textContent = 0;
    }
  }


  // Функция удвления контакта из списка
  const handleDeleteContact = (event) => {
    const deleteButton = event.target.closest('.message__delete');
    if (!deleteButton) {
      return;
    }

    const contactMessage = deleteButton.closest('.message');
    const name = contactMessage.querySelector('.message__name').textContent;
    const position = contactMessage.querySelector('.message__position').textContent;
    const phone = contactMessage.querySelector('.message__phone').textContent;

    // Удаляем из хранилища
    contactsStorage.delete(`${name.toLowerCase()}|${position.toLowerCase()}|${phone}`);

    if (contactMessage) {

      // Удаляем из DOM
      contactMessage.remove();

      // Обновляем данные в основном списке
      const firstLetter = name[0].toUpperCase();
      const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest('.column__element');

      if (letterElement) {
        const contactsContainer = letterElement.querySelector('.element__contacts');
        const contactElements = contactsContainer.querySelectorAll('.element__message');

        contactElements.forEach((contact) => {
          const contactName = contact.querySelector('.message__name').textContent;
          const contactPosition = contact.querySelector('.message__position').textContent;
          const contactPhone = contact.querySelector('.message__phone').textContent;

          // Удаляем только нужный контакт
          if (contactName === name && contactPosition === position && contactPhone === phone) {
            contact.remove();
          }
        });

        // Обновляем счётчик для буквы
        updateCounter(letterElement);
      }

      // Удаляем контакт из модального окна
      contactMessage.remove();

      // Обновляем данные в localStorage
      saveContactsToLocalStorage();
    }
  };

  // Вешаем обработчик событий на весь документ для динамических элементов
  document.addEventListener('click', handleDeleteContact);


  // Функция очищения всего списка
  const clearButton = document.querySelector('.buttons__button--clear');

  const clearAllContacts = () => {
    document.querySelectorAll('.column__element').forEach((letterElement) => {
      const contactsContainer = letterElement.querySelector('.element__contacts');

      // Удаляем все контакты
      contactsContainer.innerHTML = '';

      // Обновляем счётчик
      updateCounter(letterElement);
    });

    // Очищаем хранилище
    contactsStorage.clear();

    // Обновляем данные в localStorage
    saveContactsToLocalStorage();
  };

  // Обработчик на кнопку Clear List
  clearButton.addEventListener('click', clearAllContacts);


  // Загрузка контактов при старте
  loadContactsFromLocalStorage();


  // Элементы попапа
  const editPopup = document.querySelector('#edit-popup');
  const popupNameInput = editPopup.querySelector('.popup__input--name');
  const popupPositionInput = editPopup.querySelector('.popup__input--position');
  const popupPhoneInput = editPopup.querySelector('.popup__input--phone');
  const popupSaveButton = editPopup.querySelector('.popup__button-save');
  const popupCancelButton = editPopup.querySelector('.popup__button-cancel');
  const popupOverlay = document.querySelector('.popup__overlay');

  let currentContactElement = null; // Контакт, который редактируется

  // Открытие попапа
  function openEditPopup(contactElement) {
    currentContactElement = contactElement;

    // Заполняем поля попапа текущими данными контакта
    popupNameInput.value = contactElement.querySelector('.message__name').textContent;
    popupPositionInput.value = contactElement.querySelector('.message__position').textContent;
    popupPhoneInput.value = contactElement.querySelector('.message__phone').textContent;

    editPopup.classList.add('popup--open');
  }

  // Закрытие попапа
  function closeEditPopup() {
    editPopup.classList.remove('popup--open');
    currentContactElement = null;
  }

  // Сохранение изменений в попапе
  popupSaveButton.addEventListener('click', () => {
    const newName = popupNameInput.value.trim();
    const newPosition = popupPositionInput.value.trim();
    const newPhone = popupPhoneInput.value.trim();

    const oldName = currentContactElement.querySelector('.message__name').textContent;
    const oldPosition = currentContactElement.querySelector('.message__position').textContent;
    const oldPhone = currentContactElement.querySelector('.message__phone').textContent;

    // Удаляем старый контакт из хранилища
    contactsStorage.delete(`${oldName.toLowerCase()}|${oldPosition.toLowerCase()}|${oldPhone}`);

    // Обновляем контакт в хранилище
    contactsStorage.set(`${newName.toLowerCase()}|${newPosition.toLowerCase()}|${newPhone}`, { name: newName, position: newPosition, phone: newPhone });

    // Обновляем данные в DOM
    currentContactElement.querySelector('.message__name').textContent = newName;
    currentContactElement.querySelector('.message__position').textContent = newPosition;
    currentContactElement.querySelector('.message__phone').textContent = newPhone;

    // Обновляем данные в основном списке через взаимодействие в модальном окне
    const firstLetter = oldName[0].toUpperCase();
    const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest('.column__element');

    if (letterElement) {
      const contactsContainer = letterElement.querySelector('.element__contacts');
      const contactElements = contactsContainer.querySelectorAll('.element__message');

      contactElements.forEach((contact) => {
        const contactName = contact.querySelector('.message__name').textContent;
        const contactPosition = contact.querySelector('.message__position').textContent;
        const contactPhone = contact.querySelector('.message__phone').textContent;

        // Обновляем только нужный контакт
        if (contactName === oldName && contactPosition === oldPosition && contactPhone === oldPhone) {
          contact.querySelector('.message__name').textContent = newName;
          contact.querySelector('.message__position').textContent = newPosition;
          contact.querySelector('.message__phone').textContent = newPhone;
        }
      });
    }

    // Сохраняем изменения в localStorage
    saveContactsToLocalStorage();

    closeEditPopup();
  });

  // Закрытие попапа по клику на свободную область
  popupOverlay.addEventListener('click', closeEditPopup);

  // Отмена редактирования и закрытие попапа
  popupCancelButton.addEventListener('click', closeEditPopup);

  // Добавляем обработчик на кнопку "Edit"
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('message__edit')) {
      const contactElement = e.target.closest('.message');
      openEditPopup(contactElement);
    }
  });

  // Элементы модального окна поиска
  const searchButton = document.querySelector('.buttons__button--search');
  const searchModal = document.querySelector('.modal');
  const searchInput = searchModal.querySelector('.modal__input');
  const searchArea = searchModal.querySelector('.modal__search-area');
  const searchCloseButton = searchModal.querySelector('.modal__button-cancel');
  const searchOverlay = searchModal.querySelector('.modal__overlay');
  const showAllButton = searchModal.querySelector('.modal__button-show');

  // Открытие модального окна
  searchButton.addEventListener('click', () => {
    searchModal.classList.add('modal--open');
    document.querySelector('.body').style.overflow = 'hidden';
  });

  // Функция поиска контактов
  function searchContacts(query) {
    const results = [];
    contactsStorage.forEach(({ name, position, phone }) => {
      if (
        name.toLowerCase().includes(query) ||
        position.toLowerCase().includes(query) ||
        phone.includes(query)
      ) {
        results.push({ name, position, phone });
      }
    });
    return results;
  }

  // Отображение результатов поиска
  function displaySearchResults(results) {
    searchArea.innerHTML = ''; // Очищаем область результатов

    if (results.length === 0) {
      searchArea.textContent = 'No results found';
      return;
    }

    results.forEach(({ name, position, phone }) => {
      const contactElement = getContactElement(name, position, phone);
      searchArea.appendChild(contactElement);
    });
  }

  // Обработчик для ввода поиска
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
      const results = searchContacts(query);
      displaySearchResults(results);
    } else {
      searchArea.innerHTML = ''; // Очищаем, если строка поиска пуста
    }
  });

  // Обработчик для кнопки Delete в модальном окне
  searchArea.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.message__delete');
    if (deleteButton) {
      const contactMessage = deleteButton.closest('.element__message');
      if (contactMessage) {
        const name = contactMessage.querySelector('.message__name').textContent;
        const position = contactMessage.querySelector('.message__position').textContent;
        const phone = contactMessage.querySelector('.message__phone').textContent;

        // Удаляем из хранилища
        contactsStorage.delete(`${name.toLowerCase()}|${position.toLowerCase()}|${phone}`);

        // Удаляем из модального окна
        contactMessage.remove();

        // Обновляем основной список
        const firstLetter = name[0].toUpperCase();
        const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest('.column__element');
        if (letterElement) {
          updateCounter(letterElement);
        }
      }
    }
  });

  // Обработчик для кнопки Edit в модальном окне
  searchArea.addEventListener('click', (event) => {
    const editButton = event.target.closest('.message__edit');
    if (editButton) {
      const contactElement = editButton.closest('.element__message');
      if (contactElement) {
        openEditPopup(contactElement);
      }
    }
  });

  // Обработчик для кнопки "Show All"
  showAllButton.addEventListener('click', () => {
    const allContacts = Array.from(contactsStorage.values());
    displaySearchResults(allContacts);
  });

  // Функция закрытие модального окна поиска
  function closeSearchModal() {
    searchModal.classList.remove('modal--open');
    searchInput.value = '';
    searchArea.innerHTML = '';
    document.querySelector('.body').style.overflow = 'auto';
  }

  // Обработчик на закрытие модального окна
  searchCloseButton.addEventListener('click', closeSearchModal);

  // Закрытие попапа по клику на свободную область
  searchOverlay.addEventListener('click', closeSearchModal);


  // Функция вывода ошибки при пустых значениях
  const errorMessage = document.querySelector('.interaction__error');
  const errorClass = 'input--error'; // CSS-класс для выделения ошибок

  function showErrorEmptyValue(input) {
    if (!input.classList.contains(errorClass)) {
      input.classList.add(errorClass);
      errorMessage.textContent = 'Fill in all fields!';
    }
  }

  // Валидация на пустые значения
  function validateInputs(inputs) {
    let isValid = true;

    inputs.forEach((input) => {
      resetErrors(input); // Сначала сбрасываем предыдущие ошибки

      if (!input.value.trim()) {
        showErrorEmptyValue(input);
        isValid = false;
      }
    });

    return isValid;
  }

  // Функция для сброса ошибок
  function resetErrors(input) {
    input.addEventListener('input', () => {
      input.classList.remove(errorClass); // Убираем класс ошибки

      // Удаляем сообщение об ошибке, если оно есть
      errorMessage.textContent = '';
    });
  }

  // Функция вывода ошибки при добавлении уже существующего контакта
  function showErrorSameValue() {
    errorMessage.textContent = 'This contact has already been recorded!';
  }

  // Функция валидации имени и должности
  function checkedValue(name) {
    resetErrors(name); // Сначала сбрасываем предыдущие ошибки
    const regLetters = /[a-zA-Z ]/gmi;

    // Проверяем длину введенного значения
    if (name.value.length <= MINIMUM_LENGTH) {
      name.classList.add(errorClass);
      errorMessage.textContent = 'Value cannot be shorter than 3 letters!';
      return false;
    }

    // Проверяем формат введенного значения
    if (!regLetters.test(name.value)) {
      name.classList.add(errorClass);
      errorMessage.textContent = 'Value must contain English letters!';
      return false;
    }

    return true;
  }

  // Функция валидации телефона
  function checkedPhone(phone) {
    resetErrors(phone); // Сначала сбрасываем предыдущие ошибки

    // Проверяем длину телефона
    if (phone.value.length < PHONE_LENGTH_MIN || phone.value.length > PHONE_LENGTH_MAX) {
      phone.classList.add(errorClass);
      errorMessage.textContent = `The length should be from ${PHONE_LENGTH_MIN} to ${PHONE_LENGTH_MAX} characters!`;
      return false;
    }

    return true;
  }

  // Ввод в поле телефона только цифр
  function isNumericKeyEvent(event) {
    const key = event.keyCode;
    return ((key >= 48 && key <= 57) || // Цифры
      (key >= 96 && key <= 109) || // Numpad
      (key === 8 || key === 9 || key === 187 || key === 189 || key === 32 || key === 37 || key === 39)); // Backspace, Tab, +, -, стрелки
  }

  phoneInput.addEventListener('keydown', (evt) => {
    if (!isNumericKeyEvent(evt)) {
      evt.preventDefault();
    }
  });
});
