import { MODAL_INPUT, MODAL_SEARCH_AREA, MODAL_SHOW_BTN, MODAL_TEMPLATE_SELECTOR } from './constants';
import { renderContactElement } from './contact';
import { getContacts, searchContacts } from './contact-manager';
import { modal, openModal } from './modal';

const searchModalTemplate = document.querySelector(MODAL_TEMPLATE_SELECTOR);

function displaySearchResults(results, area) {
  area.innerHTML = '';

  if (results.length === 0) {
    area.textContent = 'No results found';
    return;
  }

  results.forEach(({ name, position, phone }) => {
    const contactElement = renderContactElement(name, position, phone);
    area.appendChild(contactElement);
  });
}

function listenSearchInput(element, area) {
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
  // const content = searchModalTemplate.content.cloneNode(true);
  openModal(searchModalTemplate);

  const searchInput = modal.querySelector(MODAL_INPUT);
  const searchArea = modal.querySelector(MODAL_SEARCH_AREA);

  listenSearchInput(searchInput, searchArea);

  modal.querySelector(MODAL_SHOW_BTN).addEventListener('click', showAllContacts);
}

function showAllContacts() {
  const allContacts = getContacts(); // Получаем все контакты из localStorage
  const searchArea = modal.querySelector(MODAL_SEARCH_AREA);
  displaySearchResults(allContacts, searchArea);
  modal.querySelector('input').focus();
}

export { openSearchModal, showAllContacts };
