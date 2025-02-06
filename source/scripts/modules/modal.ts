import { BODY_SELECTOR, MODAL_BODY, MODAL_SELECTOR } from './constants';
import { isEscapeKey } from './utils';

const modal = document.querySelector(MODAL_SELECTOR) as HTMLDialogElement;
const body = document.querySelector(BODY_SELECTOR) as HTMLElement;

function openModal(template: HTMLTemplateElement) {
  modal.showModal();
  body.style.overflow = 'hidden';

  const modalBody = modal.querySelector(MODAL_BODY) as HTMLElement;
  modalBody.innerHTML = '';

  const content = template.content.cloneNode(true);
  modalBody.appendChild(content);

  const input = modal.querySelector('input') as HTMLInputElement;
  input.focus();

  document.addEventListener('keydown', onDocumentKeydown);
}

function closeModal() {
  modal.close();
  body.style.overflow = 'auto';
  document.removeEventListener('keydown', onDocumentKeydown);
}

function onDocumentKeydown (evt: KeyboardEvent) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
}

export { modal, openModal, closeModal, onDocumentKeydown };
