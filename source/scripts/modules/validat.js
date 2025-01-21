const MINIMUM_LENGTH = 3;

const errorClass = 'input--error';

function resetErrors(input, errorMessage) {
  input.addEventListener('input', () => {
    input.classList.remove(errorClass);

    errorMessage.textContent = '';
  });
}

function showError(input, errorMessage, textErrorMessage) {
  resetErrors(input, errorMessage);

  input.classList.add(errorClass);
  errorMessage.textContent = textErrorMessage;
}

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
    errorMessage.textContent = 'This contact has already been recorded!';
    return true;
  }

  return false;
}

function validateLetterValues(name, errorMessage) {
  resetErrors(name, errorMessage);
  const regLetters = /[a-zA-Z ]/gmi;

  if (name.value.length <= MINIMUM_LENGTH) {
    showError(name, errorMessage, `Value cannot be shorter than ${MINIMUM_LENGTH} letters!`);
    return false;
  }

  if (!regLetters.test(name.value)) {
    showError(name, errorMessage, 'Value must contain English letters!');
    return false;
  }

  return true;
}

function validatePhoneValues(phone, errorMessage) {
  resetErrors(phone, errorMessage);
  const regNumbers = /^\+7 \d{3} \d{3} \d{2} \d{2}$/;

  if (!regNumbers.test(phone.value)) {
    showError(phone, errorMessage, 'Wrong number!');
    return false;
  }

  return true;
}

export { validateEmptyValues, validateSameValues, validateLetterValues, validatePhoneValues };
