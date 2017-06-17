'use strict';

import append from './utils/append';

import Dropzone from './Dropzone';
import Song from './Song';
import './App.css';

append(document.body, Dropzone);

const initialTitle = document.title;

window.addEventListener('blur', function() {
	document.title = Song.currentSong || initialTitle;
});

window.addEventListener('focus', function() {
	document.title = initialTitle;
});