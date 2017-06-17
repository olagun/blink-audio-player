'use strict';

import style from './Dropzone.css';
import { read } from './vendor/jsmediatags';
import Song from './Song';

/**
 * Audio file dropzone area.
 * @returns {HTMLElement}   Song container element
 */
function Dropzone() {
    'use strict';

    this.element = document.createElement('div');
    this.element.classList.add(style.dropzone);

    this.element.addEventListener('dragover', this.handleDragOver.bind(this));
    this.element.addEventListener('drop', this.handleDrop.bind(this));


    return this.element;
};

/**
 * Prevents default behavior on drag over event.
 * 
 * @param   {Object} e Drag Over Event
 */
Dropzone.prototype.handleDragOver = function(e) {
    'use strict';

    e.preventDefault();
    e.stopPropagation();
};

/**
 * Handles audio file drop.
 * @param   {Object} e Drop Event 
 */
Dropzone.prototype.handleDrop = async function(e) {
    'use strict';

    e.preventDefault();
    e.stopPropagation();

    let inputFile,
        data = e.dataTransfer.items;

    if (data) {
        inputFile = data[0].webkitGetAsEntry();

        inputFile = await new Promise((resolve, reject) => {
            inputFile.file(file =>
                file.type.slice(0, 5) === 'audio' ?
                resolve(file) :
                undefined
            );
        });
    }

    if (inputFile) {
        read(inputFile, {
            onSuccess: metadata => {
                this.element.insertAdjacentElement('beforeend', new Song(inputFile, metadata));
            }
        });
    }
};

export default new Dropzone;