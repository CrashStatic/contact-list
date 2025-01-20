const MINIMUM_LENGTH = 3;

const errorClass = 'input--error'; // CSS-класс для выделения ошибок

// Функция для сброса ошибок
function resetErrors(input, errorMessage) {
  input.addEventListener('input', () => {
    input.classList.remove(errorClass); // Убираем класс ошибки

    // Удаляем сообщение об ошибке, если оно есть
    errorMessage.textContent = '';
  });
}

function showError(input, errorMessage, textErrorMessage) {
  resetErrors(input, errorMessage); // Сначала сбрасываем предыдущие ошибки

  input.classList.add(errorClass);
  errorMessage.textContent = textErrorMessage;
}

// Валидация на пустые значения
function validateEmptyValues(inputs, errorMessage) {
  let isValid = true;

  inputs.forEach((input) => {
    const error = validateInputEmpty(input, errorMessage); // Валидация с отображением ошибки
    if (error) {
      isValid = false;
    }
  });

  return isValid;
}

// Валидация для пустых полей
function validateInputEmpty(input, errorMessage) {
  if (!input.value.trim()) {
    showError(input, errorMessage, 'Fill in all fields!');
    return true;
  }
  return false;
}

function validateSameValues(storage, name, position, phone, errorMessage) {
  const existingContact = storage.some((contact) =>
    contact.name.toLowerCase() === name.toLowerCase() &&
    contact.position.toLowerCase() === position.toLowerCase() &&
    contact.phone === phone
  );

  if (existingContact) {
    // Если контакт найден, показываем одну общую ошибку
    errorMessage.textContent = 'This contact has already been recorded!';
    return true;
  }

  return false;
}

// Функция валидации имени и должности
function validateLetterValues(name, errorMessage) {
  resetErrors(name, errorMessage); // Сначала сбрасываем предыдущие ошибки
  const regLetters = /[a-zA-Z ]/gmi;

  // Проверяем длину введенного значения
  if (name.value.length <= MINIMUM_LENGTH) {
    showError(name, errorMessage, `Value cannot be shorter than ${MINIMUM_LENGTH} letters!`);
    return false;
  }

  // Проверяем формат введенного значения
  if (!regLetters.test(name.value)) {
    showError(name, errorMessage, 'Value must contain English letters!');
    return false;
  }

  return true;
}

// Функция валидации телефона
function validatePhoneValues(phone, errorMessage) {
  resetErrors(phone, errorMessage); // Сначала сбрасываем предыдущие ошибки
  const regNumbers = /^\+7 \d{3} \d{3} \d{2} \d{2}$/;

  if (!regNumbers.test(phone.value)) {
    showError(phone, errorMessage, 'Wrong number!');
    return false;
  }

  return true;
}

export { validateEmptyValues, validateSameValues, validateLetterValues, validatePhoneValues };
