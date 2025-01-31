import { COUNTER_ACTIVE_SELECTOR, ELEMENT_ACTIVE_SELECTOR } from './constants.ts';

class Counter {
  counterElement: HTMLElement;
  contactsContainer: HTMLElement;
  count: number;

  constructor(counterElement: HTMLElement, contactsContainer: HTMLElement) {
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
    const element = this.contactsContainer.parentElement as HTMLElement | null;

    if (element) {
      if (this.count > 0) {
        this.counterElement.classList.add(COUNTER_ACTIVE_SELECTOR);
        element.classList.add(ELEMENT_ACTIVE_SELECTOR);
      } else {
        this.counterElement.classList.remove(COUNTER_ACTIVE_SELECTOR);
        element.classList.remove(ELEMENT_ACTIVE_SELECTOR);
      }
    }

    this.counterElement.textContent = this.count.toString();
  }
}

export { Counter };
