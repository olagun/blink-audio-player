'use strict';

import rebound from 'rebound';
import base64 from './utils/base64';
import prepend from './utils/prepend';
import append from './utils/append';
import create from './utils/create';
import style from './utils/style';

import Dropzone from './Dropzone';
import styles from './Song.css';

let _canvas, _ctx;

Song.prototype.springSystem = new rebound.SpringSystem();
Song.prototype.blur = 2;
Song.prototype.brightness = 30;
Song.prototype.quality = .7;
Song.prototype.canvas = _canvas = new OffscreenCanvas(0, 0);
Song.prototype.ctx = _ctx = _canvas.getContext('2d');

style(_canvas, styles.canvas);
prepend(document.body, _canvas);

Song.currentSong = undefined;
Song.songList = [];

Song.prototype.resetCanvas = function() {
    this.ctx.filter = 'none';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

/**
 * Constructor for mounting and creating song elements.
 * 
 * @param file Blob containing the audio information.
 * @param {Object} metadata Metadata object returned by the media module.
 * @return {HTMLElement} Song container element.
 */
function Song(file, metadata) {
    'use strict';

    this.file = file;
    this.metadata = metadata;

    this.title = this.metadata.tags.title;
    this.artist = this.metadata.tags.artist;
    this.imageData = this.metadata.tags.picture.data;
    this.imageType = this.metadata.tags.picture.type;

    this.element = create('div');
    style(this.element, styles.song);
    append(Dropzone, this.element);

    this.metaElements = [];

    if (this.imageData) {
        // Create and mount thumbnail
        this.thumbnail = new Image();
        style(this.thumbnail, styles.thumbnail);
        this.thumbnail.src = `data:image/${this.imageType};base64,${base64(this.imageData)}`;
        prepend(this.element, this.thumbnail);

        // Create thumbnail spring instance
        this.thumbnailSpring = this.springSystem.createSpring(50, 3);
        this.thumbnailSpring.addListener({
            // Async for perf
            onSpringUpdate: async spring => {
                let value = spring.getCurrentValue();
                this.thumbnail.style.transform = `scale(${value})`;
            }
        });

        // Immediately animate spring
        this.thumbnailSpring.setEndValue(1);

        // Performantly display blurred image
        this.blurredImage = new Image();
        this.blurredImage.src = this.thumbnail.src;
        this.blurredImage.addEventListener('load', this._handleImageLoad.bind(this), {
            once: true
        });

        // Create bg spring instance
        this.bgSpring = this.springSystem.createSpring(2, 8);
        this.bgSpring.addListener({
            onSpringUpdate: async spring => {
                let value = spring.getCurrentValue();
                this.blurredImage.style.transform = `scale(${value})`;
            }
        });

        // Metadata Springs
        this.metaOpacitySpring = this.springSystem.createSpring(2, 8);
        this.metaOpacitySpring.addListener({
            onSpringUpdate: async spring => {
                for (let i = 0; i in this.metaElements; i++) {
                    let metaElement = this.metaElements[i];

                    // TODO: Delay opacity change
                    metaElement.style.opacity = `${spring.getCurrentValue()}`;
                }
            }
        });

        this.metaTransformSpring = this.springSystem.createSpring(2, 8);
        this.metaTransformSpring.addListener({
            onSpringUpdate: async spring => {
                for (let i = 0; i in this.metaElements; i++) {
                    let metaElement = this.metaElements[i];

                    // TODO: Delay transform
                    metaElement.style.transform = `translateY(${spring.getCurrentValue()}px)`;
                }
            }
        });
    }
};
/**
 * Handle the playback asychronously as not
 * to block any other operations or animations.
 * 
 * @protected
 */
Song.prototype._handlePlayback = async function() {
    'use strict';

    if (this.audio.paused) {
        this.audio.play();
        this.showMetadata();

        this.thumbnailSpring.setEndValue(1);
        this.bgSpring.setEndValue(1.2);
    } else {
        this.audio.pause();
        this.hideMetadata();
        this.thumbnailSpring.setEndValue(.8);
        this.bgSpring.setEndValue(1);
    }
};

Song.prototype.showMetadata = function() {
    this.metaTransformSpring.setEndValue(0);
    this.metaOpacitySpring.setEndValue(1);
};

Song.prototype.hideMetadata = function() {
    this.metaTransformSpring.setEndValue(30);
    this.metaOpacitySpring.setEndValue(0);
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

    const { width: canvasWidth } = this.canvas;

    // Find scaled image sizes
    const scaledWidth = canvasWidth;
    const scale = scaledWidth / this.blurredImage.width;
    const scaledHeight = this.blurredImage.height * scale;

    // Blur canvas and draw image
    this.ctx.filter = `blur(${this.blur}px) brightness(${this.brightness}%)`;
    this.ctx.drawImage(this.blurredImage, 0, 0, scaledWidth, scaledHeight);

    // Set blurredImage src
    this.blurredImage.src = this.canvas.toDataURL('image/png', this.quality);
    style(this.blurredImage, styles.bg);
    this.bgSpring.setEndValue(1.2);

    // Play audio
    this.audio = new Audio(URL.createObjectURL(this.file));
    this.thumbnail.addEventListener('click', this._handlePlayback.bind(this));
    this.audio.play();

    prepend(this.element, this.blurredImage);

    // Create and add metadata elements
    const meta = create('div');
    style(meta, styles.metadata);

    // TODO: Safety check

    // Create title
    const title = create('p');
    const artist = create('p');

    append(title, this.title);
    append(artist, this.artist);

    style(title, styles.title);
    style(artist, styles.artist);

    this.metaElements.push(title);
    this.metaElements.push(artist);

    append(meta, title);
    append(meta, artist);

    append(this.element, meta);
    this.showMetadata();

    // Perf
    this.resetCanvas();
};

export default Song;
