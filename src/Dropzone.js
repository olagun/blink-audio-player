'use strict';

import { read } from './vendor/jsmediatags';
import append from './utils/append';
import create from './utils/create';
import style from './utils/style';

import Song from './Song';
import styles from './Dropzone.css';

/**
 * @class Dropzone
 * @classdesc Audio file dropzone area.
 * @returns {HTMLElement} Song container element
 */
export default class Dropzone {
    constructor() {
        this.element = document.createElement('section');
        this.element.classList.add(styles.dropzone);

        this.element.addEventListener('dragover', this._handleDragOver);
        this.element.addEventListener('drop', this._handleDrop);

        return this.element;
    }

    /** @param {DragEvent} e */
    _handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    /** @param {DragEvent} e */
    async _handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        const { items } = e.dataTransfer;
        const [item, ] = items;
        const entry = item.webkitGetAsEntry();

        const file = await new Promise(entry.file);

        if (!(/^audio/.test(file.type))) return;

        const metadata = await new Promise((resolve, reject) => {
            read(file, { onSuccess: resolve, onError: reject });
        });

        const song = new Song(file, metadata);

        Song.currentSong = song.title;
        Song.songList.push(song);

        this.element.insertAdjacentElement('beforeend', song.element);
    }
}