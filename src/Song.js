'use strict';

import rebound from 'rebound';

import Dropzone from './Dropzone';
import style from './Song.css';
import base64 from './utils/base64';

/** @protected */
const BLUR = 60;
const springSystem = new rebound.SpringSystem();

/** @protected */
// Create auxillary canvas only once
let canvas = document.createElement('canvas');;
let ctx = canvas.getContext('2d');
canvas.classList.add(style.canvas);
document.body.insertAdjacentElement('afterbegin', canvas);

/**
 * Song class
 * @param file Blob containing the audio information
 * @param {Object} metadata Metadata object returned by the media module.
 * @return {HTMLElement} Song container element.
 */
function Song(file, metadata) {
    'use strict';

    this.file = file;
    this.metadata = metadata;

    this.title = this.metadata.tags.title;
    this.imageData = this.metadata.tags.picture.data;
    this.imageType = this.metadata.tags.picture.type;

    this.element = document.createElement('div');
    this.element.classList.add(style.song);

    if (this.imageData) {
        // Create and mount thumbnail
        this.thumbnail = new Image();
        this.thumbnail.classList.add(style.thumbnail);
        this.thumbnail.src = `data:image/${this.imageType};base64,${base64(data)}`;
        this.element.insertAdjacentElement('afterbegin', this.thumbnail);

        // Create thumbnail spring instance
        this.spring = springSystem.createSpring(50, 3);
        this.spring.addListener({
            onSpringUpdate: spring => {
                let value = spring.getCurrentValue();
                this.thumbnail.style.transform = `scale(${value})`;
            }
        });

        // Immediately animate spring
        this.spring.setEndValue(1);

        // Performantly display blurred image
        this.blurredImage = new Image();
        this.blurredImage.src = this.thumbnail.src;
        this.blurredImage.addEventListener('load', this._handleImageLoad.bind(this), {
            once: true
        });
    }

    return this.element;
};
/**
 * @protected
 */
Song.prototype._handlePlayback = function() {
    'use strict';

    if (this.audio.paused) {
        this.audio.play();
        this.spring.setEndValue(1);
    } else {
        this.audio.pause();
        this.spring.setEndValue(.6);
    }
};

/**
 * Uses the newly created image to creates a new blurred image
 * and mounts it to the DOM. This is much more efficient hard
 * ware wise than using CSS filters.
 * 
 * @protected
 */
Song.prototype._handleImageLoad = function() {
    'use strict';

    const {
        width: canvasWidth,
        height: canvasHeight
    } = canvas;

    const image = this.blurredImage,
        scaledWidth = canvasWidth,
        scale = scaledWidth / image.width,
        scaledHeight = image.height * scale;

    ctx.filter = `blur(${BLUR}px)`;
    ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);


    image.src = canvas.toDataURL('image/png');
    image.classList.add(style.bg);
    this.audio = new Audio(URL.createObjectURL(this.file));
    this.element.addEventListener('click', this._handlePlayback.bind(this));
    this.audio.play();

    Dropzone.insertAdjacentElement('afterbegin', image);

    this.element.insertAdjacentHTML('beforeend', `<p class="${style.name}">${this.title}</p>`);

    // Reset canvas
    ctx.filter = 'none';
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
};

export default Song;