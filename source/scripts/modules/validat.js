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

function validateEmptyFields(inputs) {
  const errors = [];
  inputs.forEach((input) => {
    if (!input.value.trim()) {
      errors.push({ input, message: 'Fill in all fields!' });
    }
  });

  return errors;
}

function validateContactUniqueness(storage, name, position, phone) {
  const existingContact = storage.some((contact) =>
    contact.name.toLowerCase() === name.toLowerCase() &&
    contact.position.toLowerCase() === position.toLowerCase() &&
    contact.phone === phone
  );

  return existingContact
    ? [{ input: null, message: 'This contact has already been recorded!' }]
    : [];
}

function validateLetters(input, minLength) {
  const errors = [];
  const regLetters = /^[a-zA-Z]+$/;

  if (input.value.length < minLength) {
    errors.push({ input, message: `Value cannot be shorter than ${minLength} letters!` });
  }
  if (!regLetters.test(input.value)) {
    errors.push({ input, message: 'Value must contain English letters!' });
  }
  return errors;
}

function validatePhone(phone) {
  const regNumbers = /^\+7 \d{3} \d{3} \d{2} \d{2}$/;
  return !regNumbers.test(phone.value)
    ? [{ input: phone, message: 'Wrong number!' }]
    : [];
}

function validateForm(inputs, storage, errorMessage) {
  const [name, position, phone] = inputs;

  resetErrors(inputs, errorMessage);

  const emptyFieldsErrors = validateEmptyFields(inputs);
  if (emptyFieldsErrors.length > 0) {
    return { ok: false, errors: emptyFieldsErrors };
  }

  const uniquenessErrors = validateContactUniqueness(storage, name.value, position.value, phone.value);
  if (uniquenessErrors.length > 0) {
    return { ok: false, errors: uniquenessErrors };
  }

  const nameErrors = validateLetters(name, MINIMUM_LENGTH);
  if (nameErrors.length > 0) {
    return { ok: false, errors: nameErrors };
  }

  const positionErrors = validateLetters(position, MINIMUM_LENGTH);
  if (positionErrors.length > 0) {
    return { ok: false, errors: positionErrors };
  }

  const phoneErrors = validatePhone(phone);
  if (phoneErrors.length > 0) {
    return { ok: false, errors: phoneErrors };
  }

  // Если все проверки пройдены
  return { ok: true, errors: [] };
}

export { showError, validateForm };
