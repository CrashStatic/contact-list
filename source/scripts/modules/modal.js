import { BODY_SELECTOR, MODAL_BODY, MODAL_SELECTOR } from './constants';
import { isEscapeKey } from './util';

const modal = document.querySelector(MODAL_SELECTOR);

function openModal(template) {
  modal.showModal();
  document.querySelector(BODY_SELECTOR).style.overflow = 'hidden';

  const modalBody = modal.querySelector(MODAL_BODY);
  modalBody.innerHTML = '';

  const content = template.content.cloneNode(true);
  modalBody.appendChild(content);

  modal.querySelector('input').focus();

  document.addEventListener('keydown', onDocumentKeydown);
}

function closeModal() {
  modal.close();
  document.querySelector(BODY_SELECTOR).style.overflow = 'auto';
  document.removeEventListener('keydown', onDocumentKeydown);
}

function onDocumentKeydown (evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
}

export { modal, openModal, closeModal, onDocumentKeydown };
