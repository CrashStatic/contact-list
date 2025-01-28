import { deleteContact } from './contact';
import { openEditPopup, saveEditPopup } from './edit-form';
import { showAllContacts } from './search';
import { isEscapeKey } from './util';

const modal = document.querySelector('.modal');

function openModal(template) {
  modal.classList.add('modal--open');
  document.querySelector('.body').style.overflow = 'hidden';

  const modalBody = modal.querySelector('.modal__body');
  modalBody.innerHTML = '';

  const content = template.content.cloneNode(true);
  modalBody.appendChild(content);

  modal.querySelector('input').focus();

  document.addEventListener('keydown', onDocumentKeydown);
}

function closeModal() {
  modal.classList.remove('modal--open');
  document.querySelector('.body').style.overflow = 'auto';
  document.removeEventListener('keydown', onDocumentKeydown);

  // modal.removeEventListener('click', closeModalHandler);

  // // Возвращаем фокус на редактируемый контакт - на кнопку редактирования
  // if (currentContactElement) {
  //   const editButton = currentContactElement.querySelector('.js-edit-contact-button');
  //   if (editButton) {
  //     editButton.focus();
  //   }
  // }

  // currentContactElement = null;
}

function onDocumentKeydown (evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
}
document.querySelector('.modal').addEventListener('click', (e) => {
  if (e.target.matches('.modal__button-show')) {
    showAllContacts();
  }

  if (e.target.matches('.form__button--popup-save')) {
    saveEditPopup();
  }

  if (e.target.closest('.js-delete-contact-button')) {
    deleteContact(e);
    return;
  }

  if (e.target.closest('.js-edit-contact-button')) {
    const contactElement = e.target.closest('.message');
    openEditPopup(contactElement);
    return;
  }

  if (e.target.closest('.modal__close-button')) {
    closeModal();
  }

  if (e.target.matches('.modal__overlay')) {
    closeModal();
  }
});

export { modal, openModal, closeModal, onDocumentKeydown };
