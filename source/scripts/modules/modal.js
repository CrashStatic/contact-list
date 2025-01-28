import { isEscapeKey } from './util';

const modal = document.querySelector('.modal');

function openModal(template) {
  modal.showModal();
  document.querySelector('.body').style.overflow = 'hidden';

  const modalBody = modal.querySelector('.modal__body');
  modalBody.innerHTML = '';

  const content = template.content.cloneNode(true);
  modalBody.appendChild(content);

  modal.querySelector('input').focus();

  document.addEventListener('keydown', onDocumentKeydown);
}

function closeModal() {
  modal.close();
  document.querySelector('.body').style.overflow = 'auto';
  document.removeEventListener('keydown', onDocumentKeydown);
}

function onDocumentKeydown (evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
}

export { modal, openModal, closeModal, onDocumentKeydown };
