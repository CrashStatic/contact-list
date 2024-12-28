const MINIMUM_LENGTH = 3;
const PHONE_LENGTH_MIN = 11;
const PHONE_LENGTH_MAX = 16;

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


export { validateInputs, showErrorSameValue, checkedValue, checkedPhone };
