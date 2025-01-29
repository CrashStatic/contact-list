import { COUNTER_ACTIVE_SELECTOR, ELEMENT_ACTIVE_SELECTOR } from './constants';

class Counter {
  constructor(counterElement, contactsContainer) {
    this.counterElement = counterElement;
    this.contactsContainer = contactsContainer;
    this.count = 0;
  }

  increase() {
    this.count++;
    this.update();
  }

  decrease() {
    if (this.count > 0) {
      this.count--;
      this.update();
    }
  }

  reset() {
    this.count = 0;
    this.update();
  }

  update() {
    const element = this.contactsContainer.parentElement;

    if (this.count > 0) {
      this.counterElement.classList.add(COUNTER_ACTIVE_SELECTOR);
      element.classList.add(ELEMENT_ACTIVE_SELECTOR);
    } else {
      this.counterElement.classList.remove(COUNTER_ACTIVE_SELECTOR);
      element.classList.remove(ELEMENT_ACTIVE_SELECTOR);
    }

    this.counterElement.textContent = this.count;
  }
}

export { Counter };
