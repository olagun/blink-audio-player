'use strict';

import { read } from './vendor/jsmediatags';
import append from './utils/append';
import create from './utils/create';
import style from './utils/style';

import Song from './Song';
import styles from './Dropzone.css';

/**
 * Audio file dropzone area.
 * @return {HTMLElement}   Song container element
 */
function Dropzone() {
    'use strict';

    this.element = create('div');
    style(this.element, styles.dropzone);

    this.element.addEventListener('dragover', this._handleDragOver.bind(this));
    this.element.addEventListener('drop', this._handleDrop.bind(this));

    return this.element;
};


/**
 * Prevents default behavior on drag over event.
 * 
 * @param   {Object} e Drag Over Event
 */
Dropzone.prototype._handleDragOver = function(e) {
    'use strict';

    e.preventDefault();
    e.stopPropagation();
};

/**
 * _handles audio file drop.
 * @param   {Object} e Drop Event 
 */
Dropzone.prototype._handleDrop = async function(e) {
    'use strict';

    e.preventDefault();
    e.stopPropagation();

    let inputFile;
    let data = e.dataTransfer.items;

    if (data) {
        // Only parse one entry at a time
        inputFile = data[0].webkitGetAsEntry();

        // Await inputFile
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
                append(this.element, new Song(inputFile, metadata));
            }
        });
    }
};

export default new Dropzone;