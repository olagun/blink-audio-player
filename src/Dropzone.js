'use strict';

import style from './Dropzone.css';
import { read } from './vendor/jsmediatags';
import Song from './Song';

/**
 * @constructor                 Dropzone
 * @description                 Audio file dropzone area.
 * @returns     {HTMLElement}   Song container element
 */
class Dropzone {
    constructor() {
        'use strict';

        this.element = document.createElement('div');
        this.element.classList.add(style.dropzone);

        this.element.addEventListener('dragover', this.handleDragOver.bind(this));
        this.element.addEventListener('drop', this.handleDrop.bind(this));


        return this.element;
    }

    /**
     * @description            Prevents default behavior on drag over event.
     * @param       {Object} e Drag Over Event 
     */
    handleDragOver(e) {
        'use strict';

        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * @description            Handles audio file drop.
     * @param       {Object} e Drop Event 
     */
    async handleDrop(e) {
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
                onSuccess: metadata =>
                    this.element.insertAdjacentElement('beforeend', new Song(inputFile, metadata)),
                onError: err => document.write('Song cannot be read.')
            });
        } else {
            console.log('Not audio media')
        }
    }
}

export default new Dropzone;