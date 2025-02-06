import { ContactInfo } from '../types/contact';
import { MODAL_INPUT, MODAL_SEARCH_AREA, MODAL_SHOW_BTN, MODAL_TEMPLATE_SELECTOR } from './constants';
import { renderContactElement } from './contact';
import { getContacts, searchContacts } from './contact-manager';
import { modal, openModal } from './modal';

const searchModalTemplate = document.querySelector(MODAL_TEMPLATE_SELECTOR) as HTMLTemplateElement;

function displaySearchResults(results: ContactInfo[], area: HTMLElement) {
  area.innerHTML = '';

  if (results.length === 0) {
    area.textContent = 'No results found';
    return;
  }

  results.forEach(({ name, position, phone }) => {
    const contactElement = renderContactElement({ name, position, phone });
    if (!contactElement) {
      return;
    }
    area.appendChild(contactElement);
  });
}

function listenSearchInput(element: HTMLInputElement, area: HTMLElement) {
  element.addEventListener('input', () => {
    const query = element.value.trim().toLowerCase();
    if (query) {
      const results = searchContacts(query);
      displaySearchResults(results, area);
    } else {
      area.innerHTML = '';
    }
  });
}

function openSearchModal() {
  openModal(searchModalTemplate);

  const searchInput = modal.querySelector(MODAL_INPUT) as HTMLInputElement;
  const searchArea = modal.querySelector(MODAL_SEARCH_AREA) as HTMLElement;

  listenSearchInput(searchInput, searchArea);

  const showButton = modal.querySelector(MODAL_SHOW_BTN) as HTMLButtonElement;
  showButton.addEventListener('click', showAllContacts);
}

function showAllContacts() {
  const allContacts = getContacts(); // Получаем все контакты из localStorage
  const searchArea = modal.querySelector(MODAL_SEARCH_AREA) as HTMLElement;
  displaySearchResults(allContacts, searchArea);

  const input = modal.querySelector('input') as HTMLInputElement;
  input.focus();
}

export { openSearchModal, showAllContacts };
