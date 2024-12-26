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

  const contactsStorage = new Set(); // Хранилище контактов

  // Проверка на существование контакта
  // const isContactExist = (name, phone, position) => contactsStorage.some(
  //   (contact) => contact.name.toLowerCase() === name.toLowerCase() && contact.phone === phone && contact.position.toLowerCase() === position.toLowerCase());


  function isContactExist(name, position, phone) {
    let notExists = true;
    for (let contact of contactsStorage.keys()) {
      if (contact.name === name && contact.position === position && contact.phone === phone) {
        notExists = false;
      }
    }
    return notExists;
  }
  // const isContactExist = (name, phone, position) => contactsStorage.some(
  //   (contact) => contact.name.toLowerCase() === name.toLowerCase() && contact.phone === phone && contact.position.toLowerCase() === position.toLowerCase());

  // Функция создания контакта
  const getContactElement = (name, position, phone) => {
    const letterTemplate = document.querySelector('#message').content.querySelector('.message');
    const contactElement = letterTemplate.cloneNode(true);
    contactElement.querySelector('.message__name').textContent = name;
    contactElement.querySelector('.message__position').textContent = position;
    contactElement.querySelector('.message__phone').textContent = phone;
    return contactElement;
  };

  // function checkEqualsInGlobalSet(contact) {
  //   let notEquals = true;
  //   for (let contactE of contactsStorage.keys()) {
  //     if (contactE.name === contact.name && contactE.vacancy === contact.vacancy && contactE.phone === contact.phone) {
  //       notEquals = false;
  //     }
  //   }
  //   return notEquals;
  // }

  // // Функция добавления контакта в нужную колонку
  // const addContactToColumn = (contactElement, firstLetter) => {
  //   // Определяем, куда добавить букву
  //   const targetContainer =
  //     ALPHABET_A_M.some((item) => item.letter === firstLetter)
  //       ? containerLeft
  //       : containerRight;

  //   // Ищем соответствующую букву
  //   const letterContainer = [...targetContainer.children].find(
  //     (child) => child.querySelector('.element__letter').dataset.id === firstLetter.toLowerCase()
  //   );

  //   if (letterContainer) {
  //     const contactsContainer = letterContainer.querySelector('.element__contacts');
  //     contactsContainer.append(contactElement); // Добавляем контакт
  //     updateCounter(letterContainer); // Обновляем счётчик
  //   } else {
  //     alert(`Буква "${firstLetter}" не найдена в таблице.`);
  //   }
  // };

  // Добавление контакта
  const addContactToStorage = (name, position, phone, letterElement) => {
    // const messageTemplate = document.querySelector('#message').content.querySelector('.element__message');
    // const newContactElement = messageTemplate.cloneNode(true);

    // // Заполняем контакт
    // newContactElement.querySelector('.message__name').textContent = name;
    // newContactElement.querySelector('.message__position').textContent = position;
    // newContactElement.querySelector('.message__phone').textContent = phone;

    // Заполняем контакт
    const contactElement = getContactElement(name, position, phone);

    // Добавляем контакт в DOM
    const contactsContainer = letterElement.querySelector('.element__contacts');
    contactsContainer.append(contactElement); // Добавляем контакт
    updateCounter(letterElement); // Обновляем счётчик

    // // Обновляем счётчик
    // const counter = letterElement.querySelector('.element__counter');
    // counter.textContent = contactsContainer.querySelectorAll('.element__message').length;

    // // Сохраняем контакт в хранилище
    // contactsStorage.add(contactElement);
  };


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

    // if (isContactExist(name, position, phone)) {
    //   alert('Этот контакт уже записан!');
    //   return;
    // }

    // const contactElement = {name, position, phone};
    if (!isContactExist(name, position, phone)) {
      alert('Этот контакт уже записан!');
      return;
    } else {
      // Сохраняем контакт в хранилище
      contactsStorage.add({name, position, phone});
    }

    const firstLetter = name[0].toUpperCase(); // Извлекаем первую букву имени
    const letterElement = document.querySelector(`[data-id="${firstLetter.toLowerCase()}"]`)?.closest('.column__element');
    // const contactElement = getContactElement(name, position, phone); // Создаём контакт

    addContactToStorage(name, position, phone, letterElement);
    // addContactToColumn(contactElement, firstLetter); // Добавляем контакт под нужную букву

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
      contactMessage.remove(); // Удаляем сообщение из DOM
      updateCounter(letterElement); // Обновляем счётчик для буквы
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
  };

  // Обработчик на кнопку Clear List
  clearButton.addEventListener('click', clearAllContacts);
});


// Функция очищения всего списка
// clearButton.addEventListener('click', (e) => {
//   e.preventDefault();
//   containerLeft.querySelector('.element__contacts').remove();
//   containerRight.querySelector('.element__contacts').remove();
// });

// document.querySelector('.buttons__button--add').addEventListener('click', () => {
//   let contact = new Object();
//   let nameInput = document.querySelector('#name');
//   let vacancyInput = document.querySelector('#position');
//   let phoneInput = document.querySelector('#phone');

//   //If all inputs not empty, creating new object, else - printing error ang highlights incorrect inputs
//   contact.name = nameInput.value.trim();
//   contact.vacancy = vacancyInput.value.trim();
//   contact.phone = phoneInput.value.trim();

//   //getting first letter of name - will be key of object array - adding to table, list
//   let firstLetter = nameInput.value.trim()[0].toLowerCase();
//   addToTable(contact, firstLetter);
// });


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
