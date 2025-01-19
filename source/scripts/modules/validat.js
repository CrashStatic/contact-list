const MINIMUM_LENGTH = 3;

const errorClass = 'input--error'; // CSS-класс для выделения ошибок

function showErrorEmptyValue(input, errorMessage) {
  if (!input.classList.contains(errorClass)) {
    input.classList.add(errorClass);
    errorMessage.textContent = 'Fill in all fields!';
  }
}

// Валидация на пустые значения
function validateInputs(inputs, errorMessage) {
  let isValid = true;

  inputs.forEach((input) => {
    resetErrors(input, errorMessage); // Сначала сбрасываем предыдущие ошибки

    if (!input.value.trim()) {
      showErrorEmptyValue(input, errorMessage);
      isValid = false;
    }
  });

  return isValid;
}

// Функция для сброса ошибок
function resetErrors(input, errorMessage) {
  input.addEventListener('input', () => {
    input.classList.remove(errorClass); // Убираем класс ошибки

    // Удаляем сообщение об ошибке, если оно есть
    errorMessage.textContent = '';
  });
}

// Проверка на существование контакта
function isContactExist(storage, name, position, phone) {
  return storage.find((contact) =>
    contact.name.toLowerCase() === name.toLowerCase() &&
    contact.position.toLowerCase() === position.toLowerCase() &&
    contact.phone === phone
  ) !== undefined;
}

// Функция вывода ошибки при добавлении уже существующего контакта
function showErrorSameValue(errorMessage) {
  errorMessage.textContent = 'This contact has already been recorded!';
}

// Функция валидации имени и должности
function checkedValue(name, errorMessage) {
  resetErrors(name, errorMessage); // Сначала сбрасываем предыдущие ошибки
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
function checkedPhone(phone, errorMessage) {
  resetErrors(phone, errorMessage); // Сначала сбрасываем предыдущие ошибки
  const regNumbers = /^\+7 \d{3} \d{3} \d{2} \d{2}$/;

  if (!regNumbers.test(phone.value)) {
    phone.classList.add(errorClass);
    errorMessage.textContent = 'Wrong number!';
    return false;
  }

  return true;
}

export { validateInputs, showErrorSameValue, isContactExist, checkedValue, checkedPhone };
