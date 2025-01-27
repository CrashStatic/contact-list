const MINIMUM_LENGTH = 3;

const errorClass = 'input--error';

function resetErrors(inputs, errorMessage) {
  inputs.forEach((input) => {
    input.classList.remove(errorClass);
  });
  errorMessage.textContent = '';
}

function showError(input, errorMessage, textErrorMessage) {
  input.classList.add(errorClass);
  errorMessage.textContent = textErrorMessage;
}

function validateForm(inputs, storage, errorMessage) {
  const errors = [];

  // Сброс ошибок перед новой проверкой
  resetErrors(inputs, errorMessage);

  // Проверка на пустые значения
  inputs.forEach((input) => {
    if (!input.value.trim()) {
      errors.push({ input, message: 'Fill in all fields!' });
    }
  });

  // Проверка на существующие контакты
  const [name, position, phone] = inputs;
  const existingContact = storage.some((contact) =>
    contact.name.toLowerCase() === name.value.toLowerCase() &&
    contact.position.toLowerCase() === position.value.toLowerCase() &&
    contact.phone === phone.value
  );

  if (existingContact) {
    errors.push({ input: null, message: 'This contact has already been recorded!' });
  }

  // Проверка на допустимые символы в имени и должности
  const regLetters = /[a-zA-Z ]/gmi;
  if (name.value.length <= MINIMUM_LENGTH) {
    errors.push({ input: name, message: `Value cannot be shorter than ${MINIMUM_LENGTH} letters!` });
  }
  if (!regLetters.test(name.value)) {
    errors.push({ input: name, message: 'Value must contain English letters!' });
  }
  if (position.value.length <= MINIMUM_LENGTH) {
    errors.push({ input: position, message: `Value cannot be shorter than ${MINIMUM_LENGTH} letters!` });
  }
  if (!regLetters.test(position.value)) {
    errors.push({ input: position, message: 'Value must contain English letters!' });
  }

  // Проверка на номер телефона
  const regNumbers = /^\+7 \d{3} \d{3} \d{2} \d{2}$/;
  if (!regNumbers.test(phone.value)) {
    errors.push({ input: phone, message: 'Wrong number!' });
  }

  // Возвращаем результат валидации
  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}

export { showError, validateForm };
