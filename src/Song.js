'use strict';

import DampedSpring from './vendor/damped-spring.min';
import Dropzone from './Dropzone';
import style from './Song.css';

/** @protected */
const BLUR = 60;

/** @protected */
let canvas,
    ctx,
    list = [];

/**
 * @constructor                 Song
 * @description                 Song class
 * @returns     {HTMLElement}   Song container element
 */
export default class Song {
    static get list() {
        'use strict';
        return list;
    }

    constructor(file, metadata) {
        'use strict';

        this.file = file;

        this.spring = new DampedSpring({
            stiffness: 0.1,
            damping: .4
        });

        this.element = document.createElement('div');
        this.element.classList.add(style.song);

        const {
            tags: {
                title: title,
                picture: {
                    data: data,
                    type: type
                }
            }
        } = metadata;

        this.title = title;
        this.data = data;
        this.type = type;

        this.addPreloader();

        if (data) {
            const base64 = data.reduce((acc, curr) =>
                acc + String.fromCharCode(curr), '');

            this.image = new Image();
            this.image.classList.add(style.img);
            this.image.src = `data:image/${type};base64,${btoa(base64)}`;
            this.element.insertAdjacentElement('afterbegin', this.image);

            if (!canvas) {
                canvas = document.createElement('canvas');
                canvas.classList.add(style.canvas);
                ctx = canvas.getContext('2d');
                document.body.insertAdjacentElement('afterbegin', canvas);
            }

            this.blurredImage = new Image(); // .cloneNode()?
            this.blurredImage.src = this.image.src;
            this.blurredImage.addEventListener('load', this.handleImageLoad.bind(this), {
                once: true
            });
        }

        list.push(this.element);
        return this.element;
    }

    handlePlayback() {
        'use strict';

        if (this.audio.paused) {
            this.audio.play();

            this.spring(x => {
                this.element.style.transform = `scale(${x})`;
            }, .4, 1);
        } else {
            this.audio.pause();

            this.spring(x => {
                this.element.style.transform = `scale(${x})`;
            }, 1, .4);
        }
    }

    /**
     * @description Uses the newly created image to creates a new blurred image
     *              and mounts it to the DOM. This is much more efficient hard
     *              ware wise than using CSS filters.
     */
    handleImageLoad() {
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
        this.element.addEventListener('click', this.handlePlayback.bind(this));
        this.audio.play();

        this.removePreloader();
        Dropzone.insertAdjacentElement('afterbegin', image);

        this.element.insertAdjacentHTML('beforeend', `<p class="${style.name}">${this.title}</p>`);
        this.element.insertAdjacentElement('beforeend', this.createVolumeScrubber());

        this.element.insertAdjacentElement('beforeend', this.volumeScrubber);

        // Reset canvas
        ctx.filter = 'none';
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    get volume() { return this.audio.volume; };

    set volume(volume) { this.audio.volume = volume; };

    createVolumeScrubber() {
        'use strict';

        this.volumeScrubber = document.createElement('input');
        this.volumeScrubber.setAttribute('type', 'range');
        this.volumeScrubber.classList.add(style.volumeScrubber);
        this.volumeScrubber.value = this.volume;

        this.volumeScrubber.addEventListener('value', this.handleVolumeScrub.bind(this));

        return this.volumeScrubber;
    };

    handleVolumeScrub(e) {
        console.log(e);
        this.volume = e.target.value;
    };

    addPreloader() {

    }

    removePreloader() {

    }
}