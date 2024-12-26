// import './modules/contact.js';
import { createColumn } from './modules/column.js';
import { ALPHABET_A_M, ALPHABET_N_Z } from './modules/mock.js';

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

    if (!name || !position || !phone) {
      alert('Заполните все поля');
      return;
    }

    if (isContactExist(name, position, phone)) {
      alert('Этот контакт уже записан!');
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

    const contactMessage = deleteButton.closest('.element__message');
    const letterElement = deleteButton.closest('.column__element');

    if (contactMessage && letterElement) {
      const name = contactMessage.querySelector('.message__name').textContent;
      const position = contactMessage.querySelector('.message__position').textContent;
      const phone = contactMessage.querySelector('.message__phone').textContent;

      // Удаляем из DOM
      contactMessage.remove();

      // Удаляем из хранилища
      contactsStorage.delete(`${name.toLowerCase()}|${position.toLowerCase()}|${phone}`);

      // Обновляем данные в localStorage
      saveContactsToLocalStorage();

      // Обновляем счётчик для буквы
      updateCounter(letterElement);
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
      const counter = letterElement.querySelector('.element__counter');
      counter.classList.remove('element__counter--active');
      counter.textContent = '0';
    });

    // Очищаем хранилище
    contactsStorage.clear();
    // localStorage.removeItem('contacts');

    // Обновляем данные в localStorage
    saveContactsToLocalStorage();
  };

  // Загрузка контактов при старте
  loadContactsFromLocalStorage();

  // Элементы попапа
  const editPopup = document.querySelector('#edit-popup');
  const popupNameInput = editPopup.querySelector('.popup__input--name');
  const popupPositionInput = editPopup.querySelector('.popup__input--position');
  const popupPhoneInput = editPopup.querySelector('.popup__input--phone');
  const saveButton = editPopup.querySelector('.popup__button-save');
  const cancelButton = editPopup.querySelector('.popup__button-cancel');
  const overlay = document.querySelector('.popup__overlay');

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

  // Сохранение изменений
  saveButton.addEventListener('click', () => {
    const newName = popupNameInput.value.trim();
    const newPosition = popupPositionInput.value.trim();
    const newPhone = popupPhoneInput.value.trim();

    if (!newName || !newPosition || !newPhone) {
      alert('Заполните все поля');
      return;
    }

    const oldName = currentContactElement.querySelector('.message__name').textContent;
    const oldPosition = currentContactElement.querySelector('.message__position').textContent;
    const oldPhone = currentContactElement.querySelector('.message__phone').textContent;

    // Проверяем уникальность контакта
    if (
      (newName !== oldName || newPosition !== oldPosition || newPhone !== oldPhone) &&
      isContactExist(newName, newPosition, newPhone)
    ) {
      alert('Этот контакт уже записан!');
      return;
    }

    // Удаляем старый контакт из хранилища
    contactsStorage.delete(`${oldName.toLowerCase()}|${oldPosition.toLowerCase()}|${oldPhone}`);

    // Обновляем контакт в хранилище
    contactsStorage.set(`${newName.toLowerCase()}|${newPosition.toLowerCase()}|${newPhone}`, { name: newName, position: newPosition, phone: newPhone });

    // Обновляем данные в DOM
    currentContactElement.querySelector('.message__name').textContent = newName;
    currentContactElement.querySelector('.message__position').textContent = newPosition;
    currentContactElement.querySelector('.message__phone').textContent = newPhone;

    // Сохраняем изменения в localStorage
    saveContactsToLocalStorage();

    closeEditPopup();
  });

  // Закрытие попапа по клику на свободную область
  overlay.addEventListener('click', closeEditPopup);

  // Отмена редактирования
  cancelButton.addEventListener('click', closeEditPopup);

  // Добавляем обработчик на кнопку "Edit"
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('message__edit')) {
      const contactElement = e.target.closest('.message');
      openEditPopup(contactElement);
    }
  });


  // Обработчик на кнопку Clear List
  clearButton.addEventListener('click', clearAllContacts);
});


// let contactSet = new Set();
// let letterContactsObj = {};

// function addToTable(contact, firstLetter) {
//   //Set list of all elements of contact list
//   if (checkEqualsInGlobalSet(contact)) {
//     contactSet.add(contact);
//     //If object hasn't this property, creating array at this property
//     if (!Object.prototype.hasOwnProperty.call(letterContactsObj, firstLetter)) {
//       letterContactsObj[firstLetter] = new Array();
//     }
//     letterContactsObj[firstLetter].push(contact);
//     // changeCounter(firstLetter);
//     addInfoToLetter(firstLetter, contact);
//   }
// }

// function checkEqualsInGlobalSet(contact) {
//   let notEquals = true;
//   for (let contactE of contactSet.keys()) {
//       if (contactE.name == contact.name && contactE.vacancy == contact.vacancy && contactE.phone == contact.phone) {
//           notEquals = false;
//       }
//   }
//   return notEquals;
// }

// function addInfoToLetter(firstLetter, contact) {
//   let letter = document.querySelector('.element__letter[data-id=' + firstLetter + ']');
//   //Create and add contact's info to page
//   for (let i = 1; i < letter.parentNode.children.length; i++) {
//       letter.parentNode.children[i].classList.remove('letter__info_active');
//   }
//   let div = document.createElement('div');
//   div.className = 'letter__info js-letter-info';
//   div.innerText = `Name: ${contact.name}\n  Vacancy: ${contact.vacancy}\n  Phone: ${contact.phone}\n`;

//   //Create and add window close symbol (button)
//   let closeWindow = document.createElement('i');
//   closeWindow.className = 'fa fa-window-close contact__delete js-delete-element';
//   closeWindow.setAttribute('aria-hidden', true);
//   letter.after(div);

//   div.appendChild(closeWindow);
// }


// const getContactsFromLocalStorage = () => JSON.parse(localStorage.getItem('contacts')) || [];

// const saveContactsToLocalStorage = (contact) => {
//   localStorage.setItem('contacts', JSON.stringify(contact));
// };

// const contacts = getContactsFromLocalStorage();

// const updateAddressBook = () => {
//   containerLeft.innerHTML = '';
//   containerRight.innerHTML = '';
//   createColumn(ALPHABET_A_M, containerLeft);
//   createColumn(ALPHABET_N_Z, containerRight);
//   contacts.forEach((contact) => {
//     const firstLetter = contact.name[0].toUpperCase();
//     const targetColumn = firstLetter < 'N' ? containerLeft : containerRight;
//     const letterElement = targetColumn.querySelector(`[data-id="${firstLetter}"]`);
//     if (letterElement) {
//       const contactDiv = document.createElement('div');
//       contactDiv.textContent = `${contact.name}: ${contact.phone}`;
//       letterElement.appendChild(contactDiv);
//     }
//   });
// };

// document.addEventListener('DOMContentLoaded', () => {
//   createColumn(ALPHABET_A_M, containerLeft);
//   createColumn(ALPHABET_N_Z, containerRight);
//   updateAddressBook();
// });


// document.querySelector('.buttons__button--add').addEventListener('submit', (event) => {
//   event.preventDefault();
//   const name = document.querySelector('#name').value;
//   const phone = document.querySelector('#phone').value;
//   const newContact = { name, phone };
//   contacts.push(newContact);
//   saveContactsToLocalStorage(contacts);
//   document.querySelector('#name').value = '';
//   document.querySelector('#phone').value = '';
//   updateAddressBook();
// });

// const containerLeft = document.querySelector('.column__left');
// const containerRight = document.querySelector('.column__right');
// const addContactInput = document.querySelector('#name'); // Поле ввода имени контакта
// const addContactButton = document.querySelector('.buttons__button--add'); // Кнопка добавления контакта


// const getContactsFromLocalStorage = () => JSON.parse(localStorage.getItem('contact-table')) || [];

// const saveContactsToLocalStorage = (contact) => {
//   localStorage.setItem('contact-table', JSON.stringify(contact));
// };

// const contacts = getContactsFromLocalStorage();

// const updateAddressBook = () => {
//   containerLeft.innerHTML = '';
//   containerRight.innerHTML = '';

//   createColumn(ALPHABET_A_M, containerLeft);
//   createColumn(ALPHABET_N_Z, containerRight);

//   const sortedContacts = Object.keys(contacts).sort();
//   const leftAlphabet = sortedContacts.filter((letter) => letter < 'N');
//   const rightAlphabet = sortedContacts.filter((letter) => letter >= 'N');

//   leftAlphabet.forEach((letter) => createColumn(contacts[letter], containerLeft));
//   rightAlphabet.forEach((letter) => createColumn(contacts[letter], containerRight));
// };

// const updateAddressBook = () => {
//   containerLeft.innerHTML = '';
//   containerRight.innerHTML = '';
//   createColumn(ALPHABET_A_M, containerLeft);
//   createColumn(ALPHABET_N_Z, containerRight);
//   contacts.forEach((contact) => {
//     const firstLetter = contact.name[0].toUpperCase();
//     const targetColumn = firstLetter < 'N' ? containerLeft : containerRight;
//     const letterElement = targetColumn.querySelector(`[data-id="${firstLetter}"]`);
//     if (letterElement) {
//       const contactDiv = document.createElement('div');
//       contactDiv.textContent = `${contact.name}: ${contact.phone}`;
//       letterElement.appendChild(contactDiv);
//     }
//   });
// };

// document.addEventListener('DOMContentLoaded', () => {
//   createColumn(ALPHABET_A_M, containerLeft);
//   createColumn(ALPHABET_N_Z, containerRight);
//   updateAddressBook();
// });


// function updateAddressBook () {
//   containerLeft.innerHTML = '';
//   containerRight.innerHTML = '';
//   createColumn(ALPHABET_A_M, containerLeft);
//   createColumn(ALPHABET_N_Z, containerRight);
//   contacts.forEach((contact) => {
//     const firstLetter = contact.name[0].toUpperCase();
//     const targetColumn = firstLetter < 'N' ? containerLeft : containerRight;
//     const letterElement = targetColumn.querySelector(`[data-id="${firstLetter}"]`);
//     if (letterElement) {
//       const contactDiv = document.createElement('div');
//       contactDiv.textContent = `${contact.name}: ${contact.phone}`;
//       letterElement.appendChild(contactDiv);
//     }
//   });
// };

// document.addEventListener('DOMContentLoaded', () => {
//   createColumn(ALPHABET_A_M, containerLeft);
//   createColumn(ALPHABET_N_Z, containerRight);
//   updateAddressBook();
// });

// const addContact = () => {
//   const contactName = addContactInput.value.trim();

//   // if (contactName === '') {
//   //   console.log('Имя контакта не может быть пустым!');
//   //   return;
//   // }

//   const firstLetter = contactName[0].toUpperCase();

//   if (!contacts[firstLetter]) {
//     contacts[firstLetter] = [];
//   }

//   contacts[firstLetter].push({ letter: contactName, id: contacts[firstLetter].length + 1 });
//   contacts[firstLetter].sort((a, b) => a.letter.localeCompare(b.letter));

//   saveContactsToLocalStorage(contacts);
//   updateAddressBook();
//   addContactInput.value = '';
// };

// addContactButton.addEventListener('click', addContact);

// // Инициализация колонок при загрузке
// updateAddressBook();


// const addButton = document.querySelector('.buttons__button--add');
// const clearButton = document.querySelector('.buttons__button--clear');
// const searchButton = document.querySelector('.buttons__button--search');

// const nameInput = document.querySelector('#name');
// const positionInput = document.querySelector('#position');
// const phoneInput = document.querySelector('#phone');

// const getContactElement = ({ letter, id, name, position, phone }) => {
//   const contactElement = document.createElement('div');
//   contactElement.classList.add('element');
//   contactElement.innerHTML = `
//     <div class="element__letter">${letter}</div>
//     <div class="element__details">
//       <div class="element__name">${name}</div>
//       <div class="element__position">${position}</div>
//       <div class="element__phone">${phone}</div>
//     </div>
//   `;
//   contactElement.querySelector('.element__letter').dataset.id = id;
//   contactElement.setAttribute('tabindex', '0');

//   return contactElement;
// };

// const addContact = () => {
//   const name = nameInput.value.trim();
//   const position = positionInput.value.trim();
//   const phone = phoneInput.value.trim();
//   if (name && position && phone) {
//     const letter = name[0].toUpperCase();
//     const contact = { letter, id: name.toLowerCase(), name, position, phone };

//     if (letter <= 'M') {
//       ALPHABET_A_M.push(contact);
//       ALPHABET_A_M.sort((a, b) => {
//         if (a.name && b.name) {
//           return a.name.localeCompare(b.name);
//         }
//         return 0;
//       });
//       updateColumn(ALPHABET_A_M, containerLeft);
//     } else {
//       ALPHABET_N_Z.push(contact);
//       ALPHABET_N_Z.sort((a, b) => {
//         if (a.name && b.name) {
//           return a.name.localeCompare(b.name);
//         }
//         return 0;
//       });

//       updateColumn(ALPHABET_N_Z, containerRight);
//     }
//     // Очистка полей ввода nameInput.value = '';
//     positionInput.value = '';
//     phoneInput.value = '';
//   } else {
//     alert('Пожалуйста, заполните все поля.');
//   }
// };

// const clearContacts = () => {
//   ALPHABET_A_M.length = 0;
//   ALPHABET_N_Z.length = 0;
//   containerLeft.innerHTML = '';
//   containerRight.innerHTML = '';
// };

// const searchContacts = () => {
//   const searchQuery = nameInput.value.toLowerCase();
//   const results = ALPHABET_A_M.concat(ALPHABET_N_Z).filter((contact) => contact.name.toLowerCase().includes(searchQuery));
//   containerLeft.innerHTML = '';
//   containerRight.innerHTML = '';
//   updateColumn(results, containerLeft);
// };

// function updateColumn (alphabet, container) {
//   // const existingContacts = Array.from(container.querySelectorAll('.element__letter')).map((el) => el.dataset.id);
//   // const fragmentElement = document.createDocumentFragment();
//   alphabet.forEach((element) => {
//     let letterGroup = container.querySelector(`[data-letter="${element.letter}"]`);

//     if (!letterGroup) {
//       letterGroup = document.createElement('div');
//       letterGroup.classList.add('letter-group');
//       letterGroup.dataset.letter = element.letter;
//       letterGroup.innerHTML = `<div class="letter-group__title">${element.letter}</div>`;
//       container.append(letterGroup);
//     }

//     const contact = getContactElement(element);
//     letterGroup.append(contact);
//   });
// }

// addButton.addEventListener('click', addContact);
// clearButton.addEventListener('click', clearContacts);
// searchButton.addEventListener('click', searchContacts);
