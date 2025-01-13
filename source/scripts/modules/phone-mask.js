// Маска телефона
let oldLength = 0;

const initPhoneInput = (phone) => {
  phone.addEventListener('input', () => {
    const value = phone.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
    const currentLength = phone.value.length;

    if (currentLength < oldLength) {
      oldLength--;
      return;
    }

    phone.value = '+7 ';

    if (currentLength > 1) {
      phone.value += value.substring(1, 4);
    }

    if (currentLength >= 4) {
      phone.value += ` ${value.substring(4, 7)}`;
    }

    if (currentLength >= 7) {
      phone.value += `${value.substring(7, 9)}`;
    }

    if (currentLength >= 9) {
      phone.value += `${value.substring(9, 11)}`;
    }

    oldLength++;
  });
};

export { initPhoneInput };
