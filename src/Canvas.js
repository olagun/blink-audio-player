'use strict';

class Canvas {
    constructor() {
        this.element = document.createElement('canvas');

        this.element.addEventListener('mousescroll', this.handleMouseScroll);
        this.element.addEventListener('dragstart', this.handleMouseScroll);
        this.element.addEventListener('mousescroll', this.handleMouseScroll);
        this.element.addEventListener('mousescroll', this.handleMouseScroll);
    }

    handleMouseScroll() {

    }
}

export default new Canvas();