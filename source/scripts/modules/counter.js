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
      this.counterElement.classList.add('element__counter--active');
      element.classList.add('element--active');
    } else {
      this.counterElement.classList.remove('element__counter--active');
      element.classList.remove('element--active');
      // this.counterElement.textContent = 0;
    }

    this.counterElement.textContent = this.count;
  }
}

export { Counter };
