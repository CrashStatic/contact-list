// Маска телефона
const initPhoneInput = (phone) => {
  let oldValue = '';

  phone.addEventListener('input', () => {
    let value = phone.value.replace(/\D/g, ''); // Удаляем все нецифровые символы

    // Если длина значения меньше предыдущего — это удаление, ничего не делаем
    if (value.length < oldValue.length) {
      oldValue = value;
      return;
    }

    // Добавляем префикс только если это первый ввод
    if (value.length === 1 && value[0] !== '7') {
      value = `7${ value}`; // Добавляем '7', если это первый ввод
    }

    // Форматируем номер
    let formattedValue = '+7 ';

    if (value.length > 1) {
      formattedValue += value.substring(1, 4);
    }
    if (value.length > 4) {
      formattedValue += ` ${value.substring(4, 7)}`;
    }
    if (value.length > 7) {
      formattedValue += ` ${value.substring(7, 9)}`;
    }
    if (value.length > 9) {
      formattedValue += ` ${value.substring(9, 11)}`;
    }

    phone.value = formattedValue; // Обновляем поле ввода
    oldValue = value; // Обновляем старое значение
  });
};

export { initPhoneInput };
