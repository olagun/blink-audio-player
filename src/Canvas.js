'use strict';

class Canvas {
    constructor() {
        this.element = document.createElement('canvas');


        this.element.addEventListener('mousescroll', this.handleMouseScroll.bind(this));

    }

    handleMouseScroll() {

    }


}

export default new Canvas();