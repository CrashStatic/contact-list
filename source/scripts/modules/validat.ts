import { ContactInfo } from '../types/contact';
import { Error } from '../types/error';
import {Validate} from '../types/validate';
import {FormValidate} from '../types/form-validate';

const MINIMUM_LENGTH: number = 3;

const errorClass: string = 'input--error';

function resetErrors(inputs: HTMLInputElement[], errorMessage: HTMLElement): void {
  inputs.forEach((input: HTMLInputElement) => {
    input.classList.remove(errorClass);
  });
  errorMessage.textContent = '';
}

function showError(input: HTMLInputElement, errorMessage: HTMLElement, textErrorMessage: string): void {
  input.classList.add(errorClass);
  errorMessage.textContent = textErrorMessage;
}

function validateEmptyFields(inputs: HTMLInputElement[]): Error[] {
  const errors: Error[] = [];
  inputs.forEach((input: HTMLInputElement) => {
    if (!input.value.trim()) {
      errors.push({ input, message: 'Fill in all fields!' });
    }
  });

  return errors;
}

function validateContactUniqueness(storage: ContactInfo[], { name, position, phone }: ContactInfo): Error[] {
  const existingContact = storage.some((contact: ContactInfo) => (
    (contact.name?.toLowerCase() === name.toLowerCase()) &&
      (contact.position?.toLowerCase() === position.toLowerCase()) &&
      (contact.phone === phone)
  ));

  return existingContact
    ? [{ input: null, message: 'This contact has already been recorded!' }]
    : [];
}

function validateLetters(input: HTMLInputElement, minLength: number): Error[] {
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

function validatePhone(phone: HTMLInputElement): Error[] {
  const regNumbers = /^\+7 \d{3} \d{3} \d{2} \d{2}$/;
  return !regNumbers.test(phone.value)
    ? [{ input: phone, message: 'Wrong number!' }]
    : [];
}

function validateForm({inputs, storage, errorMessage}: FormValidate): Validate {
  const [name, position, phone] = inputs;

  resetErrors(inputs, errorMessage);

  const emptyFieldsErrors = validateEmptyFields(inputs);
  if (emptyFieldsErrors.length > 0) {
    return { isValid: false, errors: emptyFieldsErrors };
  }

  const contactToValidate: ContactInfo = { name: name.value, position: position.value, phone: phone.value };

  const uniquenessErrors = validateContactUniqueness(storage, contactToValidate);
  if (uniquenessErrors.length > 0) {
    return { isValid: false, errors: uniquenessErrors };
  }

  const nameErrors = validateLetters(name, MINIMUM_LENGTH);
  if (nameErrors.length > 0) {
    return { isValid: false, errors: nameErrors };
  }

  const positionErrors = validateLetters(position, MINIMUM_LENGTH);
  if (positionErrors.length > 0) {
    return { isValid: false, errors: positionErrors };
  }

  const phoneErrors = validatePhone(phone);
  if (phoneErrors.length > 0) {
    return { isValid: false, errors: phoneErrors };
  }

  // Если все проверки пройдены
  return { isValid: true, errors: [] };
}

export { showError, validateForm };
