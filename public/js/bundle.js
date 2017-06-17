/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(18);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Dropzone = __webpack_require__(16);

var _Dropzone2 = _interopRequireDefault(_Dropzone);

var _jsmediatags = __webpack_require__(7);

var _Song = __webpack_require__(5);

var _Song2 = _interopRequireDefault(_Song);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Audio file dropzone area.
 * @returns {HTMLElement}   Song container element
 */
function Dropzone() {
    'use strict';

    this.element = document.createElement('div');
    this.element.classList.add(_Dropzone2.default.dropzone);

    this.element.addEventListener('dragover', this.handleDragOver.bind(this));
    this.element.addEventListener('drop', this.handleDrop.bind(this));

    return this.element;
};

/**
 * Prevents default behavior on drag over event.
 * 
 * @param   {Object} e Drag Over Event
 */
Dropzone.prototype.handleDragOver = function (e) {
    'use strict';

    e.preventDefault();
    e.stopPropagation();
};

/**
 * Handles audio file drop.
 * @param   {Object} e Drop Event 
 */
Dropzone.prototype.handleDrop = async function (e) {
    'use strict';

    var _this = this;

    e.preventDefault();
    e.stopPropagation();

    var inputFile = void 0,
        data = e.dataTransfer.items;

    if (data) {
        inputFile = data[0].webkitGetAsEntry();

        inputFile = await new Promise(function (resolve, reject) {
            inputFile.file(function (file) {
                return file.type.slice(0, 5) === 'audio' ? resolve(file) : undefined;
            });
        });
    }

    if (inputFile) {
        (0, _jsmediatags.read)(inputFile, {
            onSuccess: function onSuccess(metadata) {
                _this.element.insertAdjacentElement('beforeend', new _Song2.default(inputFile, metadata));
            }
        });
    }
};

exports.default = new Dropzone();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js??ref--1-1!./App.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js??ref--1-1!./App.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Dropzone = __webpack_require__(2);

var _Dropzone2 = _interopRequireDefault(_Dropzone);

__webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.body.insertAdjacentElement('afterbegin', _Dropzone2.default);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _rebound = __webpack_require__(21);

var _rebound2 = _interopRequireDefault(_rebound);

var _Dropzone = __webpack_require__(2);

var _Dropzone2 = _interopRequireDefault(_Dropzone);

var _Song = __webpack_require__(17);

var _Song2 = _interopRequireDefault(_Song);

var _base = __webpack_require__(24);

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @protected */
var BLUR = 60;
var springSystem = new _rebound2.default.SpringSystem();

/** @protected */
// Create auxillary canvas only once
var canvas = document.createElement('canvas');;
var ctx = canvas.getContext('2d');
canvas.classList.add(_Song2.default.canvas);
document.body.insertAdjacentElement('afterbegin', canvas);

/**
 * Song class
 * @param file Blob containing the audio information
 * @param {Object} metadata Metadata object returned by the media module.
 * @return {HTMLElement} Song container element.
 */
function Song(file, metadata) {
    'use strict';

    var _this = this;

    this.file = file;
    this.metadata = metadata;

    this.title = this.metadata.tags.title;
    this.imageData = this.metadata.tags.picture.data;
    this.imageType = this.metadata.tags.picture.type;

    this.element = document.createElement('div');
    this.element.classList.add(_Song2.default.song);

    if (this.imageData) {
        // Create and mount thumbnail
        this.thumbnail = new Image();
        this.thumbnail.classList.add(_Song2.default.thumbnail);
        this.thumbnail.src = 'data:image/' + this.imageType + ';base64,' + (0, _base2.default)(data);
        this.element.insertAdjacentElement('afterbegin', this.thumbnail);

        // Create thumbnail spring instance
        this.spring = springSystem.createSpring(50, 3);
        this.spring.addListener({
            onSpringUpdate: function onSpringUpdate(spring) {
                var value = spring.getCurrentValue();
                _this.thumbnail.style.transform = 'scale(' + value + ')';
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
Song.prototype._handlePlayback = function () {
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
Song.prototype._handleImageLoad = function () {
    'use strict';

    var canvasWidth = canvas.width,
        canvasHeight = canvas.height;


    var image = this.blurredImage,
        scaledWidth = canvasWidth,
        scale = scaledWidth / image.width,
        scaledHeight = image.height * scale;

    ctx.filter = 'blur(' + BLUR + 'px)';
    ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);

    image.src = canvas.toDataURL('image/png');
    image.classList.add(_Song2.default.bg);
    this.audio = new Audio(URL.createObjectURL(this.file));
    this.element.addEventListener('click', this._handlePlayback.bind(this));
    this.audio.play();

    _Dropzone2.default.insertAdjacentElement('afterbegin', image);

    this.element.insertAdjacentHTML('beforeend', '<p class="' + _Song2.default.name + '">' + this.title + '</p>');

    // Reset canvas
    ctx.filter = 'none';
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
};

exports.default = Song;

/***/ }),
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer, process) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;var require;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (f) {
    if (( false ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
        module.exports = f();
    } else if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (f),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {
        var g;if (typeof window !== "undefined") {
            g = window;
        } else if (typeof global !== "undefined") {
            g = global;
        } else if (typeof self !== "undefined") {
            g = self;
        } else {
            g = this;
        }
        g.jsmediatags = f();
    }
})(function () {
    var define, module, exports;
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;if (!u && a) return require(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
                }var l = n[o] = { exports: {} };
                t[o][0].call(l.exports, function (e) {
                    var n = t[o][1][e];return s(n ? n : e);
                }, l, l.exports, e, t, n, r);
            }return n[o].exports;
        }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
            s(r[o]);
        }return s;
    }({
        1: [function (require, module, exports) {}, {}],
        2: [function (require, module, exports) {
            module.exports = XMLHttpRequest;
        }, {}],
        3: [function (require, module, exports) {

            'use strict';

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            function _possibleConstructorReturn(self, call) {
                if (!self) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
            }

            function _inherits(subClass, superClass) {
                if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
                }
                subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }

            var MediaFileReader = require('./MediaFileReader');

            var ArrayFileReader = function (_MediaFileReader) {
                _inherits(ArrayFileReader, _MediaFileReader);

                function ArrayFileReader(array) {
                    _classCallCheck(this, ArrayFileReader);

                    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ArrayFileReader).call(this));

                    _this._array = array;
                    _this._size = array.length;
                    _this._isInitialized = true;
                    return _this;
                }

                _createClass(ArrayFileReader, [{
                    key: 'init',
                    value: function init(callbacks) {
                        setTimeout(callbacks.onSuccess, 0);
                    }
                }, {
                    key: 'loadRange',
                    value: function loadRange(range, callbacks) {
                        setTimeout(callbacks.onSuccess, 0);
                    }
                }, {
                    key: 'getByteAt',
                    value: function getByteAt(offset) {
                        return this._array[offset];
                    }
                }], [{
                    key: 'canReadFile',
                    value: function canReadFile(file) {
                        return Array.isArray(file) || typeof Buffer === 'function' && Buffer.isBuffer(file);
                    }
                }]);

                return ArrayFileReader;
            }(MediaFileReader);

            module.exports = ArrayFileReader;
        }, { "./MediaFileReader": 10 }],
        4: [function (require, module, exports) {

            'use strict';

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            function _possibleConstructorReturn(self, call) {
                if (!self) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
            }

            function _inherits(subClass, superClass) {
                if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
                }
                subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }

            var ChunkedFileData = require('./ChunkedFileData');
            var MediaFileReader = require('./MediaFileReader');

            var BlobFileReader = function (_MediaFileReader) {
                _inherits(BlobFileReader, _MediaFileReader);

                function BlobFileReader(blob) {
                    _classCallCheck(this, BlobFileReader);

                    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BlobFileReader).call(this));

                    _this._blob = blob;
                    _this._fileData = new ChunkedFileData();
                    return _this;
                }

                _createClass(BlobFileReader, [{
                    key: '_init',
                    value: function _init(callbacks) {
                        this._size = this._blob.size;
                        setTimeout(callbacks.onSuccess, 1);
                    }
                }, {
                    key: 'loadRange',
                    value: function loadRange(range, callbacks) {
                        var self = this;
                        // $FlowIssue - flow isn't aware of mozSlice or webkitSlice
                        var blobSlice = this._blob.slice || this._blob.mozSlice || this._blob.webkitSlice;
                        var blob = blobSlice.call(this._blob, range[0], range[1] + 1);
                        var browserFileReader = new FileReader();

                        browserFileReader.onloadend = function (event) {
                            var intArray = new Uint8Array(browserFileReader.result);
                            self._fileData.addData(range[0], intArray);
                            callbacks.onSuccess();
                        };
                        browserFileReader.onerror = browserFileReader.onabort = function (event) {
                            if (callbacks.onError) {
                                callbacks.onError({ "type": "blob", "info": browserFileReader.error });
                            }
                        };

                        browserFileReader.readAsArrayBuffer(blob);
                    }
                }, {
                    key: 'getByteAt',
                    value: function getByteAt(offset) {
                        return this._fileData.getByteAt(offset);
                    }
                }], [{
                    key: 'canReadFile',
                    value: function canReadFile(file) {
                        return typeof Blob !== "undefined" && file instanceof Blob ||
                        // File extends Blob but it seems that File instanceof Blob doesn't
                        // quite work as expected in Cordova/PhoneGap.
                        typeof File !== "undefined" && file instanceof File;
                    }
                }]);

                return BlobFileReader;
            }(MediaFileReader);

            module.exports = BlobFileReader;
        }, { "./ChunkedFileData": 5, "./MediaFileReader": 10 }],
        5: [function (require, module, exports) {
            /**
             * This class represents a file that might not have all its data loaded yet.
             * It is used when loading the entire file is not an option because it's too
             * expensive. Instead, parts of the file are loaded and added only when needed.
             * From a reading point of view is as if the entire file is loaded. The
             * exception is when the data is not available yet, an error will be thrown.
             * This class does not load the data, it just manages it. It provides operations
             * to add and read data from the file.
             *
             * 
             */
            'use strict';

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            var NOT_FOUND = -1;

            var ChunkedFileData = function () {
                _createClass(ChunkedFileData, null, [{
                    key: 'NOT_FOUND',

                    // $FlowIssue - get/set properties not yet supported
                    get: function get() {
                        return NOT_FOUND;
                    }
                }]);

                function ChunkedFileData() {
                    _classCallCheck(this, ChunkedFileData);

                    this._fileData = [];
                }

                /**
                 * Adds data to the file storage at a specific offset.
                 */

                _createClass(ChunkedFileData, [{
                    key: 'addData',
                    value: function addData(offset, data) {
                        var offsetEnd = offset + data.length - 1;
                        var chunkRange = this._getChunkRange(offset, offsetEnd);

                        if (chunkRange.startIx === NOT_FOUND) {
                            this._fileData.splice(chunkRange.insertIx || 0, 0, {
                                offset: offset,
                                data: data
                            });
                        } else {
                            // If the data to add collides with existing chunks we prepend and
                            // append data from the half colliding chunks to make the collision at
                            // 100%. The new data can then replace all the colliding chunkes.
                            var firstChunk = this._fileData[chunkRange.startIx];
                            var lastChunk = this._fileData[chunkRange.endIx];
                            var needsPrepend = offset > firstChunk.offset;
                            var needsAppend = offsetEnd < lastChunk.offset + lastChunk.data.length - 1;

                            var chunk = {
                                offset: Math.min(offset, firstChunk.offset),
                                data: data
                            };

                            if (needsPrepend) {
                                var slicedData = this._sliceData(firstChunk.data, 0, offset - firstChunk.offset);
                                chunk.data = this._concatData(slicedData, data);
                            }

                            if (needsAppend) {
                                // Use the lastChunk because the slice logic is easier to handle.
                                var slicedData = this._sliceData(chunk.data, 0, lastChunk.offset - chunk.offset);
                                chunk.data = this._concatData(slicedData, lastChunk.data);
                            }

                            this._fileData.splice(chunkRange.startIx, chunkRange.endIx - chunkRange.startIx + 1, chunk);
                        }
                    }
                }, {
                    key: '_concatData',
                    value: function _concatData(dataA, dataB) {
                        // TypedArrays don't support concat.
                        if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView(dataA)) {
                            // $FlowIssue - flow thinks dataAandB is a string but it's not
                            var dataAandB = new dataA.constructor(dataA.length + dataB.length);
                            // $FlowIssue - flow thinks dataAandB is a string but it's not
                            dataAandB.set(dataA, 0);
                            // $FlowIssue - flow thinks dataAandB is a string but it's not
                            dataAandB.set(dataB, dataA.length);
                            return dataAandB;
                        } else {
                            // $FlowIssue - flow thinks dataAandB is a TypedArray but it's not
                            return dataA.concat(dataB);
                        }
                    }
                }, {
                    key: '_sliceData',
                    value: function _sliceData(data, begin, end) {
                        // Some TypeArray implementations do not support slice yet.
                        if (data.slice) {
                            return data.slice(begin, end);
                        } else {
                            // $FlowIssue - flow thinks data is a string but it's not
                            return data.subarray(begin, end);
                        }
                    }

                    /**
                     * Finds the chunk range that overlaps the [offsetStart-1,offsetEnd+1] range.
                     * When a chunk is adjacent to the offset we still consider it part of the
                     * range (this is the situation of offsetStart-1 or offsetEnd+1).
                     * When no chunks are found `insertIx` denotes the index where the data
                     * should be inserted in the data list (startIx == NOT_FOUND and endIX ==
                     * NOT_FOUND).
                     */

                }, {
                    key: '_getChunkRange',
                    value: function _getChunkRange(offsetStart, offsetEnd) {
                        var startChunkIx = NOT_FOUND;
                        var endChunkIx = NOT_FOUND;
                        var insertIx = 0;

                        // Could use binary search but not expecting that many blocks to exist.
                        for (var i = 0; i < this._fileData.length; i++, insertIx = i) {
                            var chunkOffsetStart = this._fileData[i].offset;
                            var chunkOffsetEnd = chunkOffsetStart + this._fileData[i].data.length;

                            if (offsetEnd < chunkOffsetStart - 1) {
                                // This offset range doesn't overlap with any chunks.
                                break;
                            }
                            // If it is adjacent we still consider it part of the range because
                            // we're going end up with a single block with all contiguous data.
                            if (offsetStart <= chunkOffsetEnd + 1 && offsetEnd >= chunkOffsetStart - 1) {
                                startChunkIx = i;
                                break;
                            }
                        }

                        // No starting chunk was found, meaning that the offset is either before
                        // or after the current stored chunks.
                        if (startChunkIx === NOT_FOUND) {
                            return {
                                startIx: NOT_FOUND,
                                endIx: NOT_FOUND,
                                insertIx: insertIx
                            };
                        }

                        // Find the ending chunk.
                        for (var i = startChunkIx; i < this._fileData.length; i++) {
                            var chunkOffsetStart = this._fileData[i].offset;
                            var chunkOffsetEnd = chunkOffsetStart + this._fileData[i].data.length;

                            if (offsetEnd >= chunkOffsetStart - 1) {
                                // Candidate for the end chunk, it doesn't mean it is yet.
                                endChunkIx = i;
                            }
                            if (offsetEnd <= chunkOffsetEnd + 1) {
                                break;
                            }
                        }

                        if (endChunkIx === NOT_FOUND) {
                            endChunkIx = startChunkIx;
                        }

                        return {
                            startIx: startChunkIx,
                            endIx: endChunkIx
                        };
                    }
                }, {
                    key: 'hasDataRange',
                    value: function hasDataRange(offsetStart, offsetEnd) {
                        for (var i = 0; i < this._fileData.length; i++) {
                            var chunk = this._fileData[i];
                            if (offsetEnd < chunk.offset) {
                                return false;
                            }

                            if (offsetStart >= chunk.offset && offsetEnd < chunk.offset + chunk.data.length) {
                                return true;
                            }
                        }

                        return false;
                    }
                }, {
                    key: 'getByteAt',
                    value: function getByteAt(offset) {
                        var dataChunk;

                        for (var i = 0; i < this._fileData.length; i++) {
                            var dataChunkStart = this._fileData[i].offset;
                            var dataChunkEnd = dataChunkStart + this._fileData[i].data.length - 1;

                            if (offset >= dataChunkStart && offset <= dataChunkEnd) {
                                dataChunk = this._fileData[i];
                                break;
                            }
                        }

                        if (dataChunk) {
                            return dataChunk.data[offset - dataChunk.offset];
                        }

                        throw new Error("Offset " + offset + " hasn't been loaded yet.");
                    }
                }]);

                return ChunkedFileData;
            }();

            module.exports = ChunkedFileData;
        }, {}],
        6: [function (require, module, exports) {

            'use strict';

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            function _possibleConstructorReturn(self, call) {
                if (!self) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
            }

            function _inherits(subClass, superClass) {
                if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
                }
                subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }

            var MediaTagReader = require('./MediaTagReader');
            var MediaFileReader = require('./MediaFileReader');

            var ID3v1TagReader = function (_MediaTagReader) {
                _inherits(ID3v1TagReader, _MediaTagReader);

                function ID3v1TagReader() {
                    _classCallCheck(this, ID3v1TagReader);

                    return _possibleConstructorReturn(this, Object.getPrototypeOf(ID3v1TagReader).apply(this, arguments));
                }

                _createClass(ID3v1TagReader, [{
                    key: '_loadData',
                    value: function _loadData(mediaFileReader, callbacks) {
                        var fileSize = mediaFileReader.getSize();
                        mediaFileReader.loadRange([fileSize - 128, fileSize - 1], callbacks);
                    }
                }, {
                    key: '_parseData',
                    value: function _parseData(data, tags) {
                        var offset = data.getSize() - 128;

                        var title = data.getStringWithCharsetAt(offset + 3, 30).toString();
                        var artist = data.getStringWithCharsetAt(offset + 33, 30).toString();
                        var album = data.getStringWithCharsetAt(offset + 63, 30).toString();
                        var year = data.getStringWithCharsetAt(offset + 93, 4).toString();

                        var trackFlag = data.getByteAt(offset + 97 + 28);
                        var track = data.getByteAt(offset + 97 + 29);
                        if (trackFlag == 0 && track != 0) {
                            var version = "1.1";
                            var comment = data.getStringWithCharsetAt(offset + 97, 28).toString();
                        } else {
                            var version = "1.0";
                            var comment = data.getStringWithCharsetAt(offset + 97, 30).toString();
                            track = 0;
                        }

                        var genreIdx = data.getByteAt(offset + 97 + 30);
                        if (genreIdx < 255) {
                            var genre = GENRES[genreIdx];
                        } else {
                            var genre = "";
                        }

                        var tag = {
                            "type": "ID3",
                            "version": version,
                            "tags": {
                                "title": title,
                                "artist": artist,
                                "album": album,
                                "year": year,
                                "comment": comment,
                                "genre": genre
                            }
                        };

                        if (track) {
                            // $FlowIssue - flow is not happy with adding properties
                            tag.tags.track = track;
                        }

                        return tag;
                    }
                }], [{
                    key: 'getTagIdentifierByteRange',
                    value: function getTagIdentifierByteRange() {
                        // The identifier is TAG and is at offset: -128. However, to avoid a
                        // fetch for the tag identifier and another for the data, we load the
                        // entire data since it's so small.
                        return {
                            offset: -128,
                            length: 128
                        };
                    }
                }, {
                    key: 'canReadTagFormat',
                    value: function canReadTagFormat(tagIdentifier) {
                        var id = String.fromCharCode.apply(String, tagIdentifier.slice(0, 3));
                        return id === "TAG";
                    }
                }]);

                return ID3v1TagReader;
            }(MediaTagReader);

            var GENRES = ["Blues", "Classic Rock", "Country", "Dance", "Disco", "Funk", "Grunge", "Hip-Hop", "Jazz", "Metal", "New Age", "Oldies", "Other", "Pop", "R&B", "Rap", "Reggae", "Rock", "Techno", "Industrial", "Alternative", "Ska", "Death Metal", "Pranks", "Soundtrack", "Euro-Techno", "Ambient", "Trip-Hop", "Vocal", "Jazz+Funk", "Fusion", "Trance", "Classical", "Instrumental", "Acid", "House", "Game", "Sound Clip", "Gospel", "Noise", "AlternRock", "Bass", "Soul", "Punk", "Space", "Meditative", "Instrumental Pop", "Instrumental Rock", "Ethnic", "Gothic", "Darkwave", "Techno-Industrial", "Electronic", "Pop-Folk", "Eurodance", "Dream", "Southern Rock", "Comedy", "Cult", "Gangsta", "Top 40", "Christian Rap", "Pop/Funk", "Jungle", "Native American", "Cabaret", "New Wave", "Psychadelic", "Rave", "Showtunes", "Trailer", "Lo-Fi", "Tribal", "Acid Punk", "Acid Jazz", "Polka", "Retro", "Musical", "Rock & Roll", "Hard Rock", "Folk", "Folk-Rock", "National Folk", "Swing", "Fast Fusion", "Bebob", "Latin", "Revival", "Celtic", "Bluegrass", "Avantgarde", "Gothic Rock", "Progressive Rock", "Psychedelic Rock", "Symphonic Rock", "Slow Rock", "Big Band", "Chorus", "Easy Listening", "Acoustic", "Humour", "Speech", "Chanson", "Opera", "Chamber Music", "Sonata", "Symphony", "Booty Bass", "Primus", "Porn Groove", "Satire", "Slow Jam", "Club", "Tango", "Samba", "Folklore", "Ballad", "Power Ballad", "Rhythmic Soul", "Freestyle", "Duet", "Punk Rock", "Drum Solo", "Acapella", "Euro-House", "Dance Hall"];

            module.exports = ID3v1TagReader;
        }, { "./MediaFileReader": 10, "./MediaTagReader": 11 }],
        7: [function (require, module, exports) {

            'use strict';

            var MediaFileReader = require('./MediaFileReader');

            var ID3v2FrameReader = {
                getFrameReaderFunction: function getFrameReaderFunction(frameId) {
                    if (frameId in frameReaderFunctions) {
                        return frameReaderFunctions[frameId];
                    } else if (frameId[0] === "T") {
                        // All frame ids starting with T are text tags.
                        return frameReaderFunctions["T*"];
                    } else if (frameId[0] === "W") {
                        // All frame ids starting with W are url tags.
                        return frameReaderFunctions["W*"];
                    } else {
                        return null;
                    }
                }
            };

            var frameReaderFunctions = {};

            frameReaderFunctions['APIC'] = function readPictureFrame(offset, length, data, flags, majorVersion) {
                majorVersion = majorVersion || '3';

                var start = offset;
                var charset = getTextEncoding(data.getByteAt(offset));
                switch (majorVersion) {
                    case '2':
                        var format = data.getStringAt(offset + 1, 3);
                        offset += 4;
                        break;

                    case '3':
                    case '4':
                        var format = data.getStringWithCharsetAt(offset + 1, length - 1);
                        offset += 1 + format.bytesReadCount;
                        break;

                    default:
                        throw new Error("Couldn't read ID3v2 major version.");
                }
                var bite = data.getByteAt(offset, 1);
                var type = PICTURE_TYPE[bite];
                var desc = data.getStringWithCharsetAt(offset + 1, length - (offset - start) - 1, charset);

                offset += 1 + desc.bytesReadCount;

                return {
                    "format": format.toString(),
                    "type": type,
                    "description": desc.toString(),
                    "data": data.getBytesAt(offset, start + length - offset)
                };
            };

            frameReaderFunctions['COMM'] = function readCommentsFrame(offset, length, data, flags, majorVersion) {
                var start = offset;
                var charset = getTextEncoding(data.getByteAt(offset));
                var language = data.getStringAt(offset + 1, 3);
                var shortdesc = data.getStringWithCharsetAt(offset + 4, length - 4, charset);

                offset += 4 + shortdesc.bytesReadCount;
                var text = data.getStringWithCharsetAt(offset, start + length - offset, charset);

                return {
                    language: language,
                    short_description: shortdesc.toString(),
                    text: text.toString()
                };
            };

            frameReaderFunctions['COM'] = frameReaderFunctions['COMM'];

            frameReaderFunctions['PIC'] = function (offset, length, data, flags, majorVersion) {
                return frameReaderFunctions['APIC'](offset, length, data, flags, '2');
            };

            frameReaderFunctions['PCNT'] = function readCounterFrame(offset, length, data, flags, majorVersion) {
                // FIXME: implement the rest of the spec
                return data.getLongAt(offset, false);
            };

            frameReaderFunctions['CNT'] = frameReaderFunctions['PCNT'];

            frameReaderFunctions['T*'] = function readTextFrame(offset, length, data, flags, majorVersion) {
                var charset = getTextEncoding(data.getByteAt(offset));

                return data.getStringWithCharsetAt(offset + 1, length - 1, charset).toString();
            };

            frameReaderFunctions['TXXX'] = function readTextFrame(offset, length, data, flags, majorVersion) {
                var charset = getTextEncoding(data.getByteAt(offset));

                return getUserDefinedFields(offset, length, data, charset);
            };

            frameReaderFunctions['W*'] = function readUrlFrame(offset, length, data, flags, majorVersion) {
                // charset is only defined for user-defined URL link frames (http://id3.org/id3v2.3.0#User_defined_URL_link_frame)
                // for the other URL link frames it is always iso-8859-1
                var charset = getTextEncoding(data.getByteAt(offset));

                if (charset !== undefined) {
                    return getUserDefinedFields(offset, length, data, charset);
                } else {
                    return data.getStringWithCharsetAt(offset, length, charset).toString();
                }
            };

            frameReaderFunctions['TCON'] = function readGenreFrame(offset, length, data, flags) {
                var text = frameReaderFunctions['T*'].apply(this, arguments);
                return text.replace(/^\(\d+\)/, '');
            };

            frameReaderFunctions['TCO'] = frameReaderFunctions['TCON'];

            frameReaderFunctions['USLT'] = function readLyricsFrame(offset, length, data, flags, majorVersion) {
                var start = offset;
                var charset = getTextEncoding(data.getByteAt(offset));
                var language = data.getStringAt(offset + 1, 3);
                var descriptor = data.getStringWithCharsetAt(offset + 4, length - 4, charset);

                offset += 4 + descriptor.bytesReadCount;
                var lyrics = data.getStringWithCharsetAt(offset, start + length - offset, charset);

                return {
                    language: language,
                    descriptor: descriptor.toString(),
                    lyrics: lyrics.toString()
                };
            };

            frameReaderFunctions['ULT'] = frameReaderFunctions['USLT'];

            function getTextEncoding(bite) {
                var charset;

                switch (bite) {
                    case 0x00:
                        charset = 'iso-8859-1';
                        break;

                    case 0x01:
                        charset = 'utf-16';
                        break;

                    case 0x02:
                        charset = 'utf-16be';
                        break;

                    case 0x03:
                        charset = 'utf-8';
                        break;
                }

                return charset;
            }

            // Handles reading description/data from either http://id3.org/id3v2.3.0#User_defined_text_information_frame
            // and http://id3.org/id3v2.3.0#User_defined_URL_link_frame
            function getUserDefinedFields(offset, length, data, charset) {
                var userDesc = data.getStringWithCharsetAt(offset + 1, length - 1, charset);
                var userDefinedData = data.getStringWithCharsetAt(offset + 1 + userDesc.bytesReadCount, length - 1 - userDesc.bytesReadCount);

                return {
                    user_description: userDesc.toString(),
                    data: userDefinedData.toString()
                };
            }

            var PICTURE_TYPE = ["Other", "32x32 pixels 'file icon' (PNG only)", "Other file icon", "Cover (front)", "Cover (back)", "Leaflet page", "Media (e.g. label side of CD)", "Lead artist/lead performer/soloist", "Artist/performer", "Conductor", "Band/Orchestra", "Composer", "Lyricist/text writer", "Recording Location", "During recording", "During performance", "Movie/video screen capture", "A bright coloured fish", "Illustration", "Band/artist logotype", "Publisher/Studio logotype"];

            module.exports = ID3v2FrameReader;
        }, { "./MediaFileReader": 10 }],
        8: [function (require, module, exports) {

            'use strict';

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            function _possibleConstructorReturn(self, call) {
                if (!self) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
            }

            function _inherits(subClass, superClass) {
                if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
                }
                subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }

            var MediaTagReader = require('./MediaTagReader');
            var MediaFileReader = require('./MediaFileReader');
            var ArrayFileReader = require('./ArrayFileReader');
            var ID3v2FrameReader = require('./ID3v2FrameReader');

            var ID3_HEADER_SIZE = 10;

            var ID3v2TagReader = function (_MediaTagReader) {
                _inherits(ID3v2TagReader, _MediaTagReader);

                function ID3v2TagReader() {
                    _classCallCheck(this, ID3v2TagReader);

                    return _possibleConstructorReturn(this, Object.getPrototypeOf(ID3v2TagReader).apply(this, arguments));
                }

                _createClass(ID3v2TagReader, [{
                    key: '_loadData',
                    value: function _loadData(mediaFileReader, callbacks) {
                        mediaFileReader.loadRange([6, 9], {
                            onSuccess: function onSuccess() {
                                mediaFileReader.loadRange(
                                // The tag size does not include the header size.
                                [0, ID3_HEADER_SIZE + mediaFileReader.getSynchsafeInteger32At(6) - 1], callbacks);
                            },
                            onError: callbacks.onError
                        });
                    }
                }, {
                    key: '_parseData',
                    value: function _parseData(data, tags) {
                        var offset = 0;
                        var major = data.getByteAt(offset + 3);
                        if (major > 4) {
                            return { "type": "ID3", "version": ">2.4", "tags": {} };
                        }
                        var revision = data.getByteAt(offset + 4);
                        var unsynch = data.isBitSetAt(offset + 5, 7);
                        var xheader = data.isBitSetAt(offset + 5, 6);
                        var xindicator = data.isBitSetAt(offset + 5, 5);
                        var size = data.getSynchsafeInteger32At(offset + 6);
                        offset += 10;

                        if (xheader) {
                            // TODO: support 2.4
                            var xheadersize = data.getLongAt(offset, true);
                            // The 'Extended header size', currently 6 or 10 bytes, excludes itself.
                            offset += xheadersize + 4;
                        }

                        var id3 = {
                            "type": "ID3",
                            "version": '2.' + major + '.' + revision,
                            "major": major,
                            "revision": revision,
                            "flags": {
                                "unsynchronisation": unsynch,
                                "extended_header": xheader,
                                "experimental_indicator": xindicator,
                                // TODO: footer_present
                                "footer_present": false
                            },
                            "size": size,
                            "tags": {}
                        };

                        var frames = this._readFrames(offset, size + 10 /*header size*/, data, id3, tags);
                        // create shortcuts for most common data.
                        for (var name in SHORTCUTS) {
                            if (SHORTCUTS.hasOwnProperty(name)) {
                                var frameData = this._getFrameData(frames, SHORTCUTS[name]);
                                if (frameData) {
                                    id3.tags[name] = frameData;
                                }
                            }
                        }
                        for (var frame in frames) {
                            if (frames.hasOwnProperty(frame)) {
                                id3.tags[frame] = frames[frame];
                            }
                        }
                        return id3;
                    }
                }, {
                    key: '_getUnsyncFileReader',
                    value: function _getUnsyncFileReader(data, offset, size) {
                        var frameData = data.getBytesAt(offset, size);
                        for (var i = 0; i < frameData.length - 1; i++) {
                            if (frameData[i] === 0xff && frameData[i + 1] === 0x00) {
                                frameData.splice(i + 1, 1);
                            }
                        }

                        return new ArrayFileReader(frameData);
                    }

                    /**
                     * All the frames consists of a frame header followed by one or more fields
                     * containing the actual information.
                     * The frame ID made out of the characters capital A-Z and 0-9. Identifiers
                     * beginning with "X", "Y" and "Z" are for experimental use and free for
                     * everyone to use, without the need to set the experimental bit in the tag
                     * header. Have in mind that someone else might have used the same identifier
                     * as you. All other identifiers are either used or reserved for future use.
                     * The frame ID is followed by a size descriptor, making a total header size
                     * of ten bytes in every frame. The size is calculated as frame size excluding
                     * frame header (frame size - 10).
                     */

                }, {
                    key: '_readFrames',
                    value: function _readFrames(offset, end, data, id3header, tags) {
                        var frames = {};

                        if (tags) {
                            tags = this._expandShortcutTags(tags);
                        }

                        while (offset < end) {
                            var header = this._readFrameHeader(data, offset, id3header);
                            var frameId = header.id;

                            // No frame ID sometimes means it's the last frame (GTFO).
                            if (!frameId) {
                                break;
                            }

                            var flags = header.flags;
                            var frameSize = header.size;
                            var frameDataOffset = offset + header.headerSize;
                            var frameData = data;

                            // advance data offset to the next frame data
                            offset += header.headerSize + header.size;

                            // skip unwanted tags
                            if (tags && tags.indexOf(frameId) === -1) {
                                continue;
                            }

                            var unsyncData;
                            if (id3header.flags.unsynchronisation || flags && flags.format.unsynchronisation) {
                                frameData = this._getUnsyncFileReader(frameData, frameDataOffset, frameSize);
                                frameDataOffset = 0;
                                frameSize = frameData.getSize();
                            }

                            // the first 4 bytes are the real data size
                            // (after unsynchronisation && encryption)
                            if (flags && flags.format.data_length_indicator) {
                                // var frameDataSize = frameData.getSynchsafeInteger32At(frameDataOffset);
                                frameDataOffset += 4;
                                frameSize -= 4;
                            }

                            var readFrameFunc = ID3v2FrameReader.getFrameReaderFunction(frameId);
                            var parsedData = readFrameFunc ? readFrameFunc(frameDataOffset, frameSize, frameData, flags) : null;
                            var desc = this._getFrameDescription(frameId);

                            var frame = {
                                id: frameId,
                                size: frameSize,
                                description: desc,
                                data: parsedData
                            };

                            if (frameId in frames) {
                                if (frames[frameId].id) {
                                    frames[frameId] = [frames[frameId]];
                                }
                                frames[frameId].push(frame);
                            } else {
                                frames[frameId] = frame;
                            }
                        }

                        return frames;
                    }
                }, {
                    key: '_readFrameHeader',
                    value: function _readFrameHeader(data, offset, id3header) {
                        var major = id3header.major;
                        var flags = null;

                        switch (major) {
                            case 2:
                                var frameId = data.getStringAt(offset, 3);
                                var frameSize = data.getInteger24At(offset + 3, true);
                                var frameHeaderSize = 6;
                                break;

                            case 3:
                                var frameId = data.getStringAt(offset, 4);
                                var frameSize = data.getLongAt(offset + 4, true);
                                var frameHeaderSize = 10;
                                break;

                            case 4:
                                var frameId = data.getStringAt(offset, 4);
                                var frameSize = data.getSynchsafeInteger32At(offset + 4);
                                var frameHeaderSize = 10;
                                break;
                        }

                        if (frameId == String.fromCharCode(0, 0, 0) || frameId == String.fromCharCode(0, 0, 0, 0)) {
                            frameId = "";
                        }

                        // if frameId is empty then it's the last frame
                        if (frameId) {
                            // read frame message and format flags
                            if (major > 2) {
                                flags = this._readFrameFlags(data, offset + 8);
                            }
                        }

                        return {
                            "id": frameId || "",
                            "size": frameSize || 0,
                            "headerSize": frameHeaderSize || 0,
                            "flags": flags
                        };
                    }
                }, {
                    key: '_readFrameFlags',
                    value: function _readFrameFlags(data, offset) {
                        return {
                            message: {
                                tag_alter_preservation: data.isBitSetAt(offset, 6),
                                file_alter_preservation: data.isBitSetAt(offset, 5),
                                read_only: data.isBitSetAt(offset, 4)
                            },
                            format: {
                                grouping_identity: data.isBitSetAt(offset + 1, 7),
                                compression: data.isBitSetAt(offset + 1, 3),
                                encryption: data.isBitSetAt(offset + 1, 2),
                                unsynchronisation: data.isBitSetAt(offset + 1, 1),
                                data_length_indicator: data.isBitSetAt(offset + 1, 0)
                            }
                        };
                    }
                }, {
                    key: '_getFrameData',
                    value: function _getFrameData(frames, ids) {
                        for (var i = 0, id; id = ids[i]; i++) {
                            if (id in frames) {
                                return frames[id].data;
                            }
                        }
                    }
                }, {
                    key: '_getFrameDescription',
                    value: function _getFrameDescription(frameId) {
                        if (frameId in FRAME_DESCRIPTIONS) {
                            return FRAME_DESCRIPTIONS[frameId];
                        } else {
                            return 'Unknown';
                        }
                    }
                }, {
                    key: 'getShortcuts',
                    value: function getShortcuts() {
                        return SHORTCUTS;
                    }
                }], [{
                    key: 'getTagIdentifierByteRange',
                    value: function getTagIdentifierByteRange() {
                        // ID3 header
                        return {
                            offset: 0,
                            length: ID3_HEADER_SIZE
                        };
                    }
                }, {
                    key: 'canReadTagFormat',
                    value: function canReadTagFormat(tagIdentifier) {
                        var id = String.fromCharCode.apply(String, tagIdentifier.slice(0, 3));
                        return id === 'ID3';
                    }
                }]);

                return ID3v2TagReader;
            }(MediaTagReader);

            var FRAME_DESCRIPTIONS = {
                // v2.2
                "BUF": "Recommended buffer size",
                "CNT": "Play counter",
                "COM": "Comments",
                "CRA": "Audio encryption",
                "CRM": "Encrypted meta frame",
                "ETC": "Event timing codes",
                "EQU": "Equalization",
                "GEO": "General encapsulated object",
                "IPL": "Involved people list",
                "LNK": "Linked information",
                "MCI": "Music CD Identifier",
                "MLL": "MPEG location lookup table",
                "PIC": "Attached picture",
                "POP": "Popularimeter",
                "REV": "Reverb",
                "RVA": "Relative volume adjustment",
                "SLT": "Synchronized lyric/text",
                "STC": "Synced tempo codes",
                "TAL": "Album/Movie/Show title",
                "TBP": "BPM (Beats Per Minute)",
                "TCM": "Composer",
                "TCO": "Content type",
                "TCR": "Copyright message",
                "TDA": "Date",
                "TDY": "Playlist delay",
                "TEN": "Encoded by",
                "TFT": "File type",
                "TIM": "Time",
                "TKE": "Initial key",
                "TLA": "Language(s)",
                "TLE": "Length",
                "TMT": "Media type",
                "TOA": "Original artist(s)/performer(s)",
                "TOF": "Original filename",
                "TOL": "Original Lyricist(s)/text writer(s)",
                "TOR": "Original release year",
                "TOT": "Original album/Movie/Show title",
                "TP1": "Lead artist(s)/Lead performer(s)/Soloist(s)/Performing group",
                "TP2": "Band/Orchestra/Accompaniment",
                "TP3": "Conductor/Performer refinement",
                "TP4": "Interpreted, remixed, or otherwise modified by",
                "TPA": "Part of a set",
                "TPB": "Publisher",
                "TRC": "ISRC (International Standard Recording Code)",
                "TRD": "Recording dates",
                "TRK": "Track number/Position in set",
                "TSI": "Size",
                "TSS": "Software/hardware and settings used for encoding",
                "TT1": "Content group description",
                "TT2": "Title/Songname/Content description",
                "TT3": "Subtitle/Description refinement",
                "TXT": "Lyricist/text writer",
                "TXX": "User defined text information frame",
                "TYE": "Year",
                "UFI": "Unique file identifier",
                "ULT": "Unsychronized lyric/text transcription",
                "WAF": "Official audio file webpage",
                "WAR": "Official artist/performer webpage",
                "WAS": "Official audio source webpage",
                "WCM": "Commercial information",
                "WCP": "Copyright/Legal information",
                "WPB": "Publishers official webpage",
                "WXX": "User defined URL link frame",
                // v2.3
                "AENC": "Audio encryption",
                "APIC": "Attached picture",
                "ASPI": "Audio seek point index",
                "COMM": "Comments",
                "COMR": "Commercial frame",
                "ENCR": "Encryption method registration",
                "EQU2": "Equalisation (2)",
                "EQUA": "Equalization",
                "ETCO": "Event timing codes",
                "GEOB": "General encapsulated object",
                "GRID": "Group identification registration",
                "IPLS": "Involved people list",
                "LINK": "Linked information",
                "MCDI": "Music CD identifier",
                "MLLT": "MPEG location lookup table",
                "OWNE": "Ownership frame",
                "PRIV": "Private frame",
                "PCNT": "Play counter",
                "POPM": "Popularimeter",
                "POSS": "Position synchronisation frame",
                "RBUF": "Recommended buffer size",
                "RVA2": "Relative volume adjustment (2)",
                "RVAD": "Relative volume adjustment",
                "RVRB": "Reverb",
                "SEEK": "Seek frame",
                "SYLT": "Synchronized lyric/text",
                "SYTC": "Synchronized tempo codes",
                "TALB": "Album/Movie/Show title",
                "TBPM": "BPM (beats per minute)",
                "TCOM": "Composer",
                "TCON": "Content type",
                "TCOP": "Copyright message",
                "TDAT": "Date",
                "TDLY": "Playlist delay",
                "TDRC": "Recording time",
                "TDRL": "Release time",
                "TDTG": "Tagging time",
                "TENC": "Encoded by",
                "TEXT": "Lyricist/Text writer",
                "TFLT": "File type",
                "TIME": "Time",
                "TIPL": "Involved people list",
                "TIT1": "Content group description",
                "TIT2": "Title/songname/content description",
                "TIT3": "Subtitle/Description refinement",
                "TKEY": "Initial key",
                "TLAN": "Language(s)",
                "TLEN": "Length",
                "TMCL": "Musician credits list",
                "TMED": "Media type",
                "TMOO": "Mood",
                "TOAL": "Original album/movie/show title",
                "TOFN": "Original filename",
                "TOLY": "Original lyricist(s)/text writer(s)",
                "TOPE": "Original artist(s)/performer(s)",
                "TORY": "Original release year",
                "TOWN": "File owner/licensee",
                "TPE1": "Lead performer(s)/Soloist(s)",
                "TPE2": "Band/orchestra/accompaniment",
                "TPE3": "Conductor/performer refinement",
                "TPE4": "Interpreted, remixed, or otherwise modified by",
                "TPOS": "Part of a set",
                "TPRO": "Produced notice",
                "TPUB": "Publisher",
                "TRCK": "Track number/Position in set",
                "TRDA": "Recording dates",
                "TRSN": "Internet radio station name",
                "TRSO": "Internet radio station owner",
                "TSOA": "Album sort order",
                "TSOP": "Performer sort order",
                "TSOT": "Title sort order",
                "TSIZ": "Size",
                "TSRC": "ISRC (international standard recording code)",
                "TSSE": "Software/Hardware and settings used for encoding",
                "TSST": "Set subtitle",
                "TYER": "Year",
                "TXXX": "User defined text information frame",
                "UFID": "Unique file identifier",
                "USER": "Terms of use",
                "USLT": "Unsychronized lyric/text transcription",
                "WCOM": "Commercial information",
                "WCOP": "Copyright/Legal information",
                "WOAF": "Official audio file webpage",
                "WOAR": "Official artist/performer webpage",
                "WOAS": "Official audio source webpage",
                "WORS": "Official internet radio station homepage",
                "WPAY": "Payment",
                "WPUB": "Publishers official webpage",
                "WXXX": "User defined URL link frame"
            };

            var SHORTCUTS = {
                "title": ["TIT2", "TT2"],
                "artist": ["TPE1", "TP1"],
                "album": ["TALB", "TAL"],
                "year": ["TYER", "TYE"],
                "comment": ["COMM", "COM"],
                "track": ["TRCK", "TRK"],
                "genre": ["TCON", "TCO"],
                "picture": ["APIC", "PIC"],
                "lyrics": ["USLT", "ULT"]
            };

            module.exports = ID3v2TagReader;
        }, { "./ArrayFileReader": 3, "./ID3v2FrameReader": 7, "./MediaFileReader": 10, "./MediaTagReader": 11 }],
        9: [function (require, module, exports) {
            /**
             * Support for iTunes-style m4a tags
             * See:
             *   http://atomicparsley.sourceforge.net/mpeg-4files.html
             *   http://developer.apple.com/mac/library/documentation/QuickTime/QTFF/Metadata/Metadata.html
             * Authored by Joshua Kifer <joshua.kifer gmail.com>
             * 
             */
            'use strict';

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            function _possibleConstructorReturn(self, call) {
                if (!self) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
            }

            function _inherits(subClass, superClass) {
                if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
                }
                subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }

            var MediaTagReader = require('./MediaTagReader');
            var MediaFileReader = require('./MediaFileReader');

            var MP4TagReader = function (_MediaTagReader) {
                _inherits(MP4TagReader, _MediaTagReader);

                function MP4TagReader() {
                    _classCallCheck(this, MP4TagReader);

                    return _possibleConstructorReturn(this, Object.getPrototypeOf(MP4TagReader).apply(this, arguments));
                }

                _createClass(MP4TagReader, [{
                    key: '_loadData',
                    value: function _loadData(mediaFileReader, callbacks) {
                        // MP4 metadata isn't located in a specific location of the file. Roughly
                        // speaking, it's composed of blocks chained together like a linked list.
                        // These blocks are called atoms (or boxes).
                        // Each atom of the list can have its own child linked list. Atoms in this
                        // situation do not possess any data and are called "container" as they only
                        // contain other atoms.
                        // Other atoms represent a particular set of data, like audio, video or
                        // metadata. In order to find and load all the interesting atoms we need
                        // to traverse the entire linked list of atoms and only load the ones
                        // associated with metadata.
                        // The metadata atoms can be find under the "moov.udta.meta.ilst" hierarchy.

                        var self = this;
                        // Load the header of the first atom
                        mediaFileReader.loadRange([0, 16], {
                            onSuccess: function onSuccess() {
                                self._loadAtom(mediaFileReader, 0, "", callbacks);
                            },
                            onError: callbacks.onError
                        });
                    }
                }, {
                    key: '_loadAtom',
                    value: function _loadAtom(mediaFileReader, offset, parentAtomFullName, callbacks) {
                        if (offset >= mediaFileReader.getSize()) {
                            callbacks.onSuccess();
                            return;
                        }

                        var self = this;
                        // 8 is the size of the atomSize and atomName fields.
                        // When reading the current block we always read 8 more bytes in order
                        // to also read the header of the next block.
                        var atomSize = mediaFileReader.getLongAt(offset, true);
                        if (atomSize == 0 || isNaN(atomSize)) {
                            callbacks.onSuccess();
                            return;
                        }
                        var atomName = mediaFileReader.getStringAt(offset + 4, 4);
                        // console.log(parentAtomFullName, atomName, atomSize);
                        // Container atoms (no actual data)
                        if (this._isContainerAtom(atomName)) {
                            if (atomName == "meta") {
                                // The "meta" atom breaks convention and is a container with data.
                                offset += 4; // next_item_id (uint32)
                            }
                            var atomFullName = (parentAtomFullName ? parentAtomFullName + "." : "") + atomName;
                            if (atomFullName === "moov.udta.meta.ilst") {
                                mediaFileReader.loadRange([offset, offset + atomSize], callbacks);
                            } else {
                                mediaFileReader.loadRange([offset + 8, offset + 8 + 8], {
                                    onSuccess: function onSuccess() {
                                        self._loadAtom(mediaFileReader, offset + 8, atomFullName, callbacks);
                                    },
                                    onError: callbacks.onError
                                });
                            }
                        } else {
                            mediaFileReader.loadRange([offset + atomSize, offset + atomSize + 8], {
                                onSuccess: function onSuccess() {
                                    self._loadAtom(mediaFileReader, offset + atomSize, parentAtomFullName, callbacks);
                                },
                                onError: callbacks.onError
                            });
                        }
                    }
                }, {
                    key: '_isContainerAtom',
                    value: function _isContainerAtom(atomName) {
                        return ["moov", "udta", "meta", "ilst"].indexOf(atomName) >= 0;
                    }
                }, {
                    key: '_canReadAtom',
                    value: function _canReadAtom(atomName) {
                        return atomName !== "----";
                    }
                }, {
                    key: '_parseData',
                    value: function _parseData(data, tagsToRead) {
                        var tags = {};

                        tagsToRead = this._expandShortcutTags(tagsToRead);
                        this._readAtom(tags, data, 0, data.getSize(), tagsToRead);

                        // create shortcuts for most common data.
                        for (var name in SHORTCUTS) {
                            if (SHORTCUTS.hasOwnProperty(name)) {
                                var tag = tags[SHORTCUTS[name]];
                                if (tag) {
                                    if (name === "track") {
                                        tags[name] = tag.data.track;
                                    } else {
                                        tags[name] = tag.data;
                                    }
                                }
                            }
                        }
                        return {
                            "type": "MP4",
                            "ftyp": data.getStringAt(8, 4),
                            "version": data.getLongAt(12, true),
                            "tags": tags
                        };
                    }
                }, {
                    key: '_readAtom',
                    value: function _readAtom(tags, data, offset, length, tagsToRead, parentAtomFullName, indent) {
                        indent = indent === undefined ? "" : indent + "  ";

                        var seek = offset;
                        while (seek < offset + length) {
                            var atomSize = data.getLongAt(seek, true);
                            if (atomSize == 0) {
                                return;
                            }
                            var atomName = data.getStringAt(seek + 4, 4);

                            // console.log(seek, parentAtomFullName, atomName, atomSize);
                            if (this._isContainerAtom(atomName)) {
                                if (atomName == "meta") {
                                    seek += 4; // next_item_id (uint32)
                                }
                                var atomFullName = (parentAtomFullName ? parentAtomFullName + "." : "") + atomName;
                                this._readAtom(tags, data, seek + 8, atomSize - 8, tagsToRead, atomFullName, indent);
                                return;
                            }

                            // Value atoms
                            if ((!tagsToRead || tagsToRead.indexOf(atomName) >= 0) && parentAtomFullName === "moov.udta.meta.ilst" && this._canReadAtom(atomName)) {
                                tags[atomName] = this._readMetadataAtom(data, seek);
                            }

                            seek += atomSize;
                        }
                    }
                }, {
                    key: '_readMetadataAtom',
                    value: function _readMetadataAtom(data, offset) {
                        // 16: name + size + "data" + size (4 bytes each)
                        var METADATA_HEADER = 16;

                        var atomSize = data.getLongAt(offset, true);
                        var atomName = data.getStringAt(offset + 4, 4);

                        var klass = data.getInteger24At(offset + METADATA_HEADER + 1, true);
                        var type = TYPES[klass];
                        var atomData;

                        if (atomName == "trkn") {
                            atomData = {
                                "track": data.getByteAt(offset + METADATA_HEADER + 11),
                                "total": data.getByteAt(offset + METADATA_HEADER + 13)
                            };
                        } else if (atomName == "disk") {
                            atomData = {
                                "disk": data.getByteAt(offset + METADATA_HEADER + 11),
                                "total": data.getByteAt(offset + METADATA_HEADER + 13)
                            };
                        } else {
                            // 4: atom version (1 byte) + atom flags (3 bytes)
                            // 4: NULL (usually locale indicator)
                            var atomHeader = METADATA_HEADER + 4 + 4;
                            var dataStart = offset + atomHeader;
                            var dataLength = atomSize - atomHeader;
                            var atomData;

                            // Workaround for covers being parsed as 'uint8' type despite being an 'covr' atom
                            if (atomName === 'covr' && type === 'uint8') {
                                type = 'jpeg';
                            }

                            switch (type) {
                                case "text":
                                    atomData = data.getStringWithCharsetAt(dataStart, dataLength, "utf-8").toString();
                                    break;

                                case "uint8":
                                    atomData = data.getShortAt(dataStart, false);
                                    break;

                                case "int":
                                case "uint":
                                    // Though the QuickTime spec doesn't state it, there are 64-bit values
                                    // such as plID (Playlist/Collection ID). With its single 64-bit floating
                                    // point number type, these are hard to parse and pass in JavaScript.
                                    // The high word of plID seems to always be zero, so, as this is the
                                    // only current 64-bit atom handled, it is parsed from its 32-bit
                                    // low word as an unsigned long.
                                    //
                                    var intReader = type == 'int' ? dataLength == 1 ? data.getSByteAt : dataLength == 2 ? data.getSShortAt : dataLength == 4 ? data.getSLongAt : data.getLongAt : dataLength == 1 ? data.getByteAt : dataLength == 2 ? data.getShortAt : data.getLongAt;

                                    atomData = intReader.call(data, dataStart + (dataLength == 8 ? 4 : 0), true);
                                    break;

                                case "jpeg":
                                case "png":
                                    atomData = {
                                        "format": "image/" + type,
                                        "data": data.getBytesAt(dataStart, dataLength)
                                    };
                                    break;
                            }
                        }

                        return {
                            id: atomName,
                            size: atomSize,
                            description: ATOM_DESCRIPTIONS[atomName] || "Unknown",
                            data: atomData
                        };
                    }
                }, {
                    key: 'getShortcuts',
                    value: function getShortcuts() {
                        return SHORTCUTS;
                    }
                }], [{
                    key: 'getTagIdentifierByteRange',
                    value: function getTagIdentifierByteRange() {
                        // The tag identifier is located in [4, 8] but since we'll need to reader
                        // the header of the first block anyway, we load it instead to avoid
                        // making two requests.
                        return {
                            offset: 0,
                            length: 16
                        };
                    }
                }, {
                    key: 'canReadTagFormat',
                    value: function canReadTagFormat(tagIdentifier) {
                        var id = String.fromCharCode.apply(String, tagIdentifier.slice(4, 8));
                        return id === "ftyp";
                    }
                }]);

                return MP4TagReader;
            }(MediaTagReader);

            /*
             * https://developer.apple.com/library/content/documentation/QuickTime/QTFF/Metadata/Metadata.html#//apple_ref/doc/uid/TP40000939-CH1-SW35
             */

            var TYPES = {
                "0": "uint8",
                "1": "text",
                "13": "jpeg",
                "14": "png",
                "21": "int",
                "22": "uint"
            };

            var ATOM_DESCRIPTIONS = {
                "©alb": "Album",
                "©ART": "Artist",
                "aART": "Album Artist",
                "©day": "Release Date",
                "©nam": "Title",
                "©gen": "Genre",
                "gnre": "Genre",
                "trkn": "Track Number",
                "©wrt": "Composer",
                "©too": "Encoding Tool",
                "©enc": "Encoded By",
                "cprt": "Copyright",
                "covr": "Cover Art",
                "©grp": "Grouping",
                "keyw": "Keywords",
                "©lyr": "Lyrics",
                "©cmt": "Comment",
                "tmpo": "Tempo",
                "cpil": "Compilation",
                "disk": "Disc Number",
                "tvsh": "TV Show Name",
                "tven": "TV Episode ID",
                "tvsn": "TV Season",
                "tves": "TV Episode",
                "tvnn": "TV Network",
                "desc": "Description",
                "ldes": "Long Description",
                "sonm": "Sort Name",
                "soar": "Sort Artist",
                "soaa": "Sort Album",
                "soco": "Sort Composer",
                "sosn": "Sort Show",
                "purd": "Purchase Date",
                "pcst": "Podcast",
                "purl": "Podcast URL",
                "catg": "Category",
                "hdvd": "HD Video",
                "stik": "Media Type",
                "rtng": "Content Rating",
                "pgap": "Gapless Playback",
                "apID": "Purchase Account",
                "sfID": "Country Code",
                "atID": "Artist ID",
                "cnID": "Catalog ID",
                "plID": "Collection ID",
                "geID": "Genre ID",
                "xid ": "Vendor Information",
                "flvr": "Codec Flavor"
            };

            var UNSUPPORTED_ATOMS = {
                "----": 1
            };

            var SHORTCUTS = {
                "title": "©nam",
                "artist": "©ART",
                "album": "©alb",
                "year": "©day",
                "comment": "©cmt",
                "track": "trkn",
                "genre": "©gen",
                "picture": "covr",
                "lyrics": "©lyr"
            };

            module.exports = MP4TagReader;
        }, { "./MediaFileReader": 10, "./MediaTagReader": 11 }],
        10: [function (require, module, exports) {

            'use strict';

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            var StringUtils = require('./StringUtils');

            var MediaFileReader = function () {
                function MediaFileReader() {
                    _classCallCheck(this, MediaFileReader);

                    this._isInitialized = false;
                    this._size = 0;
                }

                /**
                 * Decides if this media file reader is able to read the given file.
                 */

                _createClass(MediaFileReader, [{
                    key: 'init',

                    /**
                     * This function needs to be called before any other function.
                     * Loads the necessary initial information from the file.
                     */
                    value: function init(callbacks) {
                        var self = this;

                        if (this._isInitialized) {
                            setTimeout(callbacks.onSuccess, 1);
                        } else {
                            return this._init({
                                onSuccess: function onSuccess() {
                                    self._isInitialized = true;
                                    callbacks.onSuccess();
                                },
                                onError: callbacks.onError
                            });
                        }
                    }
                }, {
                    key: '_init',
                    value: function _init(callbacks) {
                        throw new Error("Must implement init function");
                    }

                    /**
                     * @param range The start and end indexes of the range to load.
                     *        Ex: [0, 7] load bytes 0 to 7 inclusive.
                     */

                }, {
                    key: 'loadRange',
                    value: function loadRange(range, callbacks) {
                        throw new Error("Must implement loadRange function");
                    }

                    /**
                     * @return The size of the file in bytes.
                     */

                }, {
                    key: 'getSize',
                    value: function getSize() {
                        if (!this._isInitialized) {
                            throw new Error("init() must be called first.");
                        }

                        return this._size;
                    }
                }, {
                    key: 'getByteAt',
                    value: function getByteAt(offset) {
                        throw new Error("Must implement getByteAt function");
                    }
                }, {
                    key: 'getBytesAt',
                    value: function getBytesAt(offset, length) {
                        var bytes = new Array(length);
                        for (var i = 0; i < length; i++) {
                            bytes[i] = this.getByteAt(offset + i);
                        }
                        return bytes;
                    }
                }, {
                    key: 'isBitSetAt',
                    value: function isBitSetAt(offset, bit) {
                        var iByte = this.getByteAt(offset);
                        return (iByte & 1 << bit) != 0;
                    }
                }, {
                    key: 'getSByteAt',
                    value: function getSByteAt(offset) {
                        var iByte = this.getByteAt(offset);
                        if (iByte > 127) {
                            return iByte - 256;
                        } else {
                            return iByte;
                        }
                    }
                }, {
                    key: 'getShortAt',
                    value: function getShortAt(offset, isBigEndian) {
                        var iShort = isBigEndian ? (this.getByteAt(offset) << 8) + this.getByteAt(offset + 1) : (this.getByteAt(offset + 1) << 8) + this.getByteAt(offset);
                        if (iShort < 0) {
                            iShort += 65536;
                        }
                        return iShort;
                    }
                }, {
                    key: 'getSShortAt',
                    value: function getSShortAt(offset, isBigEndian) {
                        var iUShort = this.getShortAt(offset, isBigEndian);
                        if (iUShort > 32767) {
                            return iUShort - 65536;
                        } else {
                            return iUShort;
                        }
                    }
                }, {
                    key: 'getLongAt',
                    value: function getLongAt(offset, isBigEndian) {
                        var iByte1 = this.getByteAt(offset),
                            iByte2 = this.getByteAt(offset + 1),
                            iByte3 = this.getByteAt(offset + 2),
                            iByte4 = this.getByteAt(offset + 3);

                        var iLong = isBigEndian ? (((iByte1 << 8) + iByte2 << 8) + iByte3 << 8) + iByte4 : (((iByte4 << 8) + iByte3 << 8) + iByte2 << 8) + iByte1;

                        if (iLong < 0) {
                            iLong += 4294967296;
                        }

                        return iLong;
                    }
                }, {
                    key: 'getSLongAt',
                    value: function getSLongAt(offset, isBigEndian) {
                        var iULong = this.getLongAt(offset, isBigEndian);

                        if (iULong > 2147483647) {
                            return iULong - 4294967296;
                        } else {
                            return iULong;
                        }
                    }
                }, {
                    key: 'getInteger24At',
                    value: function getInteger24At(offset, isBigEndian) {
                        var iByte1 = this.getByteAt(offset),
                            iByte2 = this.getByteAt(offset + 1),
                            iByte3 = this.getByteAt(offset + 2);

                        var iInteger = isBigEndian ? ((iByte1 << 8) + iByte2 << 8) + iByte3 : ((iByte3 << 8) + iByte2 << 8) + iByte1;

                        if (iInteger < 0) {
                            iInteger += 16777216;
                        }

                        return iInteger;
                    }
                }, {
                    key: 'getStringAt',
                    value: function getStringAt(offset, length) {
                        var string = [];
                        for (var i = offset, j = 0; i < offset + length; i++, j++) {
                            string[j] = String.fromCharCode(this.getByteAt(i));
                        }
                        return string.join("");
                    }
                }, {
                    key: 'getStringWithCharsetAt',
                    value: function getStringWithCharsetAt(offset, length, charset) {
                        var bytes = this.getBytesAt(offset, length);
                        var string;

                        switch ((charset || '').toLowerCase()) {
                            case "utf-16":
                            case "utf-16le":
                            case "utf-16be":
                                string = StringUtils.readUTF16String(bytes, charset === "utf-16be");
                                break;

                            case "utf-8":
                                string = StringUtils.readUTF8String(bytes);
                                break;

                            default:
                                string = StringUtils.readNullTerminatedString(bytes);
                                break;
                        }

                        return string;
                    }
                }, {
                    key: 'getCharAt',
                    value: function getCharAt(offset) {
                        return String.fromCharCode(this.getByteAt(offset));
                    }

                    /**
                     * The ID3v2 tag/frame size is encoded with four bytes where the most
                     * significant bit (bit 7) is set to zero in every byte, making a total of 28
                     * bits. The zeroed bits are ignored, so a 257 bytes long tag is represented
                     * as $00 00 02 01.
                     */

                }, {
                    key: 'getSynchsafeInteger32At',
                    value: function getSynchsafeInteger32At(offset) {
                        var size1 = this.getByteAt(offset);
                        var size2 = this.getByteAt(offset + 1);
                        var size3 = this.getByteAt(offset + 2);
                        var size4 = this.getByteAt(offset + 3);
                        // 0x7f = 0b01111111
                        var size = size4 & 0x7f | (size3 & 0x7f) << 7 | (size2 & 0x7f) << 14 | (size1 & 0x7f) << 21;

                        return size;
                    }
                }], [{
                    key: 'canReadFile',
                    value: function canReadFile(file) {
                        throw new Error("Must implement canReadFile function");
                    }
                }]);

                return MediaFileReader;
            }();

            module.exports = MediaFileReader;
        }, { "./StringUtils": 12 }],
        11: [function (require, module, exports) {

            'use strict';

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            var MediaFileReader = require('./MediaFileReader');

            var MediaTagReader = function () {
                function MediaTagReader(mediaFileReader) {
                    _classCallCheck(this, MediaTagReader);

                    this._mediaFileReader = mediaFileReader;
                    this._tags = null;
                }

                /**
                 * Returns the byte range that needs to be loaded and fed to
                 * _canReadTagFormat in order to identify if the file contains tag
                 * information that can be read.
                 */

                _createClass(MediaTagReader, [{
                    key: 'setTagsToRead',
                    value: function setTagsToRead(tags) {
                        this._tags = tags;
                        return this;
                    }
                }, {
                    key: 'read',
                    value: function read(callbacks) {
                        var self = this;

                        this._mediaFileReader.init({
                            onSuccess: function onSuccess() {
                                self._loadData(self._mediaFileReader, {
                                    onSuccess: function onSuccess() {
                                        try {
                                            var tags = self._parseData(self._mediaFileReader, self._tags);
                                        } catch (ex) {
                                            if (callbacks.onError) {
                                                callbacks.onError({
                                                    "type": "parseData",
                                                    "info": ex.message
                                                });
                                                return;
                                            }
                                        }

                                        // TODO: destroy mediaFileReader
                                        callbacks.onSuccess(tags);
                                    },
                                    onError: callbacks.onError
                                });
                            },
                            onError: callbacks.onError
                        });
                    }
                }, {
                    key: 'getShortcuts',
                    value: function getShortcuts() {
                        return {};
                    }

                    /**
                     * Load the necessary bytes from the media file.
                     */

                }, {
                    key: '_loadData',
                    value: function _loadData(mediaFileReader, callbacks) {
                        throw new Error("Must implement _loadData function");
                    }

                    /**
                     * Parse the loaded data to read the media tags.
                     */

                }, {
                    key: '_parseData',
                    value: function _parseData(mediaFileReader, tags) {
                        throw new Error("Must implement _parseData function");
                    }
                }, {
                    key: '_expandShortcutTags',
                    value: function _expandShortcutTags(tagsWithShortcuts) {
                        if (!tagsWithShortcuts) {
                            return null;
                        }

                        var tags = [];
                        var shortcuts = this.getShortcuts();
                        for (var i = 0, tagOrShortcut; tagOrShortcut = tagsWithShortcuts[i]; i++) {
                            tags = tags.concat(shortcuts[tagOrShortcut] || [tagOrShortcut]);
                        }

                        return tags;
                    }
                }], [{
                    key: 'getTagIdentifierByteRange',
                    value: function getTagIdentifierByteRange() {
                        throw new Error("Must implement");
                    }

                    /**
                     * Given a tag identifier (read from the file byte positions speficied by
                     * getTagIdentifierByteRange) this function checks if it can read the tag
                     * format or not.
                     */

                }, {
                    key: 'canReadTagFormat',
                    value: function canReadTagFormat(tagIdentifier) {
                        throw new Error("Must implement");
                    }
                }]);

                return MediaTagReader;
            }();

            module.exports = MediaTagReader;
        }, { "./MediaFileReader": 10 }],
        12: [function (require, module, exports) {

            'use strict';

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            var InternalDecodedString = function () {
                function InternalDecodedString(value, bytesReadCount) {
                    _classCallCheck(this, InternalDecodedString);

                    this._value = value;
                    this.bytesReadCount = bytesReadCount;
                    this.length = value.length;
                }

                _createClass(InternalDecodedString, [{
                    key: "toString",
                    value: function toString() {
                        return this._value;
                    }
                }]);

                return InternalDecodedString;
            }();

            var StringUtils = {
                readUTF16String: function readUTF16String(bytes, bigEndian, maxBytes) {
                    var ix = 0;
                    var offset1 = 1,
                        offset2 = 0;

                    maxBytes = Math.min(maxBytes || bytes.length, bytes.length);

                    if (bytes[0] == 0xFE && bytes[1] == 0xFF) {
                        bigEndian = true;
                        ix = 2;
                    } else if (bytes[0] == 0xFF && bytes[1] == 0xFE) {
                        bigEndian = false;
                        ix = 2;
                    }
                    if (bigEndian) {
                        offset1 = 0;
                        offset2 = 1;
                    }

                    var arr = [];
                    for (var j = 0; ix < maxBytes; j++) {
                        var byte1 = bytes[ix + offset1];
                        var byte2 = bytes[ix + offset2];
                        var word1 = (byte1 << 8) + byte2;
                        ix += 2;
                        if (word1 == 0x0000) {
                            break;
                        } else if (byte1 < 0xD8 || byte1 >= 0xE0) {
                            arr[j] = String.fromCharCode(word1);
                        } else {
                            var byte3 = bytes[ix + offset1];
                            var byte4 = bytes[ix + offset2];
                            var word2 = (byte3 << 8) + byte4;
                            ix += 2;
                            arr[j] = String.fromCharCode(word1, word2);
                        }
                    }
                    return new InternalDecodedString(arr.join(""), ix);
                },

                readUTF8String: function readUTF8String(bytes, maxBytes) {
                    var ix = 0;
                    maxBytes = Math.min(maxBytes || bytes.length, bytes.length);

                    if (bytes[0] == 0xEF && bytes[1] == 0xBB && bytes[2] == 0xBF) {
                        ix = 3;
                    }

                    var arr = [];
                    for (var j = 0; ix < maxBytes; j++) {
                        var byte1 = bytes[ix++];
                        if (byte1 == 0x00) {
                            break;
                        } else if (byte1 < 0x80) {
                            arr[j] = String.fromCharCode(byte1);
                        } else if (byte1 >= 0xC2 && byte1 < 0xE0) {
                            var byte2 = bytes[ix++];
                            arr[j] = String.fromCharCode(((byte1 & 0x1F) << 6) + (byte2 & 0x3F));
                        } else if (byte1 >= 0xE0 && byte1 < 0xF0) {
                            var byte2 = bytes[ix++];
                            var byte3 = bytes[ix++];
                            arr[j] = String.fromCharCode(((byte1 & 0xFF) << 12) + ((byte2 & 0x3F) << 6) + (byte3 & 0x3F));
                        } else if (byte1 >= 0xF0 && byte1 < 0xF5) {
                            var byte2 = bytes[ix++];
                            var byte3 = bytes[ix++];
                            var byte4 = bytes[ix++];
                            var codepoint = ((byte1 & 0x07) << 18) + ((byte2 & 0x3F) << 12) + ((byte3 & 0x3F) << 6) + (byte4 & 0x3F) - 0x10000;
                            arr[j] = String.fromCharCode((codepoint >> 10) + 0xD800, (codepoint & 0x3FF) + 0xDC00);
                        }
                    }
                    return new InternalDecodedString(arr.join(""), ix);
                },

                readNullTerminatedString: function readNullTerminatedString(bytes, maxBytes) {
                    var arr = [];
                    maxBytes = maxBytes || bytes.length;
                    for (var i = 0; i < maxBytes;) {
                        var byte1 = bytes[i++];
                        if (byte1 == 0x00) {
                            break;
                        }
                        arr[i - 1] = String.fromCharCode(byte1);
                    }
                    return new InternalDecodedString(arr.join(""), i);
                }
            };

            module.exports = StringUtils;
        }, {}],
        13: [function (require, module, exports) {

            'use strict';

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            function _possibleConstructorReturn(self, call) {
                if (!self) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
            }

            function _inherits(subClass, superClass) {
                if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
                }
                subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }

            var ChunkedFileData = require('./ChunkedFileData');
            var MediaFileReader = require('./MediaFileReader');

            var CHUNK_SIZE = 1024;

            var XhrFileReader = function (_MediaFileReader) {
                _inherits(XhrFileReader, _MediaFileReader);

                function XhrFileReader(url) {
                    _classCallCheck(this, XhrFileReader);

                    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(XhrFileReader).call(this));

                    _this._url = url;
                    _this._fileData = new ChunkedFileData();
                    return _this;
                }

                _createClass(XhrFileReader, [{
                    key: '_init',
                    value: function _init(callbacks) {
                        if (XhrFileReader._config.avoidHeadRequests) {
                            this._fetchSizeWithGetRequest(callbacks);
                        } else {
                            this._fetchSizeWithHeadRequest(callbacks);
                        }
                    }
                }, {
                    key: '_fetchSizeWithHeadRequest',
                    value: function _fetchSizeWithHeadRequest(callbacks) {
                        var self = this;

                        this._makeXHRRequest("HEAD", null, {
                            onSuccess: function onSuccess(xhr) {
                                var contentLength = self._parseContentLength(xhr);
                                if (contentLength) {
                                    self._size = contentLength;
                                    callbacks.onSuccess();
                                } else {
                                    // Content-Length not provided by the server, fallback to
                                    // GET requests.
                                    self._fetchSizeWithGetRequest(callbacks);
                                }
                            },
                            onError: callbacks.onError
                        });
                    }
                }, {
                    key: '_fetchSizeWithGetRequest',
                    value: function _fetchSizeWithGetRequest(callbacks) {
                        var self = this;
                        var range = this._roundRangeToChunkMultiple([0, 0]);

                        this._makeXHRRequest("GET", range, {
                            onSuccess: function onSuccess(xhr) {
                                var contentRange = self._parseContentRange(xhr);
                                var data = self._getXhrResponseContent(xhr);

                                if (contentRange) {
                                    if (contentRange.instanceLength == null) {
                                        // Last resort, server is not able to tell us the content length,
                                        // need to fetch entire file then.
                                        self._fetchEntireFile(callbacks);
                                        return;
                                    }
                                    self._size = contentRange.instanceLength;
                                } else {
                                    // Range request not supported, we got the entire file
                                    self._size = data.length;
                                }

                                self._fileData.addData(0, data);
                                callbacks.onSuccess();
                            },
                            onError: callbacks.onError
                        });
                    }
                }, {
                    key: '_fetchEntireFile',
                    value: function _fetchEntireFile(callbacks) {
                        var self = this;
                        this._makeXHRRequest("GET", null, {
                            onSuccess: function onSuccess(xhr) {
                                var data = self._getXhrResponseContent(xhr);
                                self._size = data.length;
                                self._fileData.addData(0, data);
                                callbacks.onSuccess();
                            },
                            onError: callbacks.onError
                        });
                    }
                }, {
                    key: '_getXhrResponseContent',
                    value: function _getXhrResponseContent(xhr) {
                        return xhr.responseBody || xhr.responseText || "";
                    }
                }, {
                    key: '_parseContentLength',
                    value: function _parseContentLength(xhr) {
                        var contentLength = this._getResponseHeader(xhr, "Content-Length");

                        if (contentLength == null) {
                            return contentLength;
                        } else {
                            return parseInt(contentLength, 10);
                        }
                    }
                }, {
                    key: '_parseContentRange',
                    value: function _parseContentRange(xhr) {
                        var contentRange = this._getResponseHeader(xhr, "Content-Range");

                        if (contentRange) {
                            var parsedContentRange = contentRange.match(/bytes (\d+)-(\d+)\/(?:(\d+)|\*)/i);
                            if (!parsedContentRange) {
                                throw new Error("FIXME: Unknown Content-Range syntax: ", contentRange);
                            }

                            return {
                                firstBytePosition: parseInt(parsedContentRange[1], 10),
                                lastBytePosition: parseInt(parsedContentRange[2], 10),
                                instanceLength: parsedContentRange[3] ? parseInt(parsedContentRange[3], 10) : null
                            };
                        } else {
                            return null;
                        }
                    }
                }, {
                    key: 'loadRange',
                    value: function loadRange(range, callbacks) {
                        var self = this;

                        if (self._fileData.hasDataRange(range[0], Math.min(self._size, range[1]))) {
                            setTimeout(callbacks.onSuccess, 1);
                            return;
                        }

                        // Always download in multiples of CHUNK_SIZE. If we're going to make a
                        // request might as well get a chunk that makes sense. The big cost is
                        // establishing the connection so getting 10bytes or 1K doesn't really
                        // make a difference.
                        range = this._roundRangeToChunkMultiple(range);

                        // Upper range should not be greater than max file size
                        range[1] = Math.min(self._size, range[1]);

                        this._makeXHRRequest("GET", range, {
                            onSuccess: function onSuccess(xhr) {
                                var data = self._getXhrResponseContent(xhr);
                                self._fileData.addData(range[0], data);
                                callbacks.onSuccess();
                            },
                            onError: callbacks.onError
                        });
                    }
                }, {
                    key: '_roundRangeToChunkMultiple',
                    value: function _roundRangeToChunkMultiple(range) {
                        var length = range[1] - range[0] + 1;
                        var newLength = Math.ceil(length / CHUNK_SIZE) * CHUNK_SIZE;
                        return [range[0], range[0] + newLength - 1];
                    }
                }, {
                    key: '_makeXHRRequest',
                    value: function _makeXHRRequest(method, range, callbacks) {
                        var xhr = this._createXHRObject();

                        var onXHRLoad = function onXHRLoad() {
                            // 200 - OK
                            // 206 - Partial Content
                            // $FlowIssue - xhr will not be null here
                            if (xhr.status === 200 || xhr.status === 206) {
                                callbacks.onSuccess(xhr);
                            } else if (callbacks.onError) {
                                callbacks.onError({
                                    "type": "xhr",
                                    "info": "Unexpected HTTP status " + xhr.status + ".",
                                    "xhr": xhr
                                });
                            }
                            xhr = null;
                        };

                        if (typeof xhr.onload !== 'undefined') {
                            xhr.onload = onXHRLoad;
                            xhr.onerror = function () {
                                if (callbacks.onError) {
                                    callbacks.onError({
                                        "type": "xhr",
                                        "info": "Generic XHR error, check xhr object.",
                                        "xhr": xhr
                                    });
                                }
                            };
                        } else {
                            xhr.onreadystatechange = function () {
                                // $FlowIssue - xhr will not be null here
                                if (xhr.readyState === 4) {
                                    onXHRLoad();
                                }
                            };
                        }

                        if (XhrFileReader._config.timeoutInSec) {
                            xhr.timeout = XhrFileReader._config.timeoutInSec * 1000;
                            xhr.ontimeout = function () {
                                if (callbacks.onError) {
                                    callbacks.onError({
                                        "type": "xhr",
                                        // $FlowIssue - xhr.timeout will not be null
                                        "info": "Timeout after " + xhr.timeout / 1000 + "s. Use jsmediatags.Config.setXhrTimeout to override.",
                                        "xhr": xhr
                                    });
                                }
                            };
                        }

                        xhr.open(method, this._url);
                        xhr.overrideMimeType("text/plain; charset=x-user-defined");
                        if (range) {
                            this._setRequestHeader(xhr, "Range", "bytes=" + range[0] + "-" + range[1]);
                        }
                        this._setRequestHeader(xhr, "If-Modified-Since", "Sat, 01 Jan 1970 00:00:00 GMT");
                        xhr.send(null);
                    }
                }, {
                    key: '_setRequestHeader',
                    value: function _setRequestHeader(xhr, headerName, headerValue) {
                        if (XhrFileReader._config.disallowedXhrHeaders.indexOf(headerName.toLowerCase()) < 0) {
                            xhr.setRequestHeader(headerName, headerValue);
                        }
                    }
                }, {
                    key: '_hasResponseHeader',
                    value: function _hasResponseHeader(xhr, headerName) {
                        var allResponseHeaders = xhr.getAllResponseHeaders();

                        if (!allResponseHeaders) {
                            return false;
                        }

                        var headers = allResponseHeaders.split("\r\n");
                        var headerNames = [];
                        for (var i = 0; i < headers.length; i++) {
                            headerNames[i] = headers[i].split(":")[0].toLowerCase();
                        }

                        return headerNames.indexOf(headerName.toLowerCase()) >= 0;
                    }
                }, {
                    key: '_getResponseHeader',
                    value: function _getResponseHeader(xhr, headerName) {
                        if (!this._hasResponseHeader(xhr, headerName)) {
                            return null;
                        }

                        return xhr.getResponseHeader(headerName);
                    }
                }, {
                    key: 'getByteAt',
                    value: function getByteAt(offset) {
                        var character = this._fileData.getByteAt(offset);
                        return character.charCodeAt(0) & 0xff;
                    }
                }, {
                    key: '_createXHRObject',
                    value: function _createXHRObject() {
                        if (typeof window === "undefined") {
                            // $FlowIssue - flow is not able to recognize this module.
                            return new (require("xhr2").XMLHttpRequest)();
                        }

                        if (window.XMLHttpRequest) {
                            return new window.XMLHttpRequest();
                        }

                        throw new Error("XMLHttpRequest is not supported");
                    }
                }], [{
                    key: 'canReadFile',
                    value: function canReadFile(file) {
                        return typeof file === 'string' && /^[a-z]+:\/\//i.test(file);
                    }
                }, {
                    key: 'setConfig',
                    value: function setConfig(config) {
                        for (var key in config) {
                            if (config.hasOwnProperty(key)) {
                                this._config[key] = config[key];
                            }
                        }
                        var disallowedXhrHeaders = this._config.disallowedXhrHeaders;
                        for (var i = 0; i < disallowedXhrHeaders.length; i++) {
                            disallowedXhrHeaders[i] = disallowedXhrHeaders[i].toLowerCase();
                        }
                    }
                }]);

                return XhrFileReader;
            }(MediaFileReader);

            XhrFileReader._config = {
                avoidHeadRequests: false,
                disallowedXhrHeaders: [],
                timeoutInSec: 30
            };

            module.exports = XhrFileReader;
        }, { "./ChunkedFileData": 5, "./MediaFileReader": 10, "xhr2": 2 }],
        14: [function (require, module, exports) {

            'use strict';

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            var MediaFileReader = require("./MediaFileReader");
            var NodeFileReader = require("./NodeFileReader");
            var XhrFileReader = require("./XhrFileReader");
            var BlobFileReader = require("./BlobFileReader");
            var ArrayFileReader = require("./ArrayFileReader");
            var MediaTagReader = require("./MediaTagReader");
            var ID3v1TagReader = require("./ID3v1TagReader");
            var ID3v2TagReader = require("./ID3v2TagReader");
            var MP4TagReader = require("./MP4TagReader");

            var mediaFileReaders = [];
            var mediaTagReaders = [];

            function read(location, callbacks) {
                new Reader(location).read(callbacks);
            }

            function isRangeValid(range, fileSize) {
                var invalidPositiveRange = range.offset >= 0 && range.offset + range.length >= fileSize;

                var invalidNegativeRange = range.offset < 0 && (-range.offset > fileSize || range.offset + range.length > 0);

                return !(invalidPositiveRange || invalidNegativeRange);
            }

            var Reader = function () {
                function Reader(file) {
                    _classCallCheck(this, Reader);

                    this._file = file;
                }

                _createClass(Reader, [{
                    key: "setTagsToRead",
                    value: function setTagsToRead(tagsToRead) {
                        this._tagsToRead = tagsToRead;
                        return this;
                    }
                }, {
                    key: "setFileReader",
                    value: function setFileReader(fileReader) {
                        this._fileReader = fileReader;
                        return this;
                    }
                }, {
                    key: "setTagReader",
                    value: function setTagReader(tagReader) {
                        this._tagReader = tagReader;
                        return this;
                    }
                }, {
                    key: "read",
                    value: function read(callbacks) {
                        var FileReader = this._getFileReader();
                        var fileReader = new FileReader(this._file);
                        var self = this;

                        fileReader.init({
                            onSuccess: function onSuccess() {
                                self._getTagReader(fileReader, {
                                    onSuccess: function onSuccess(TagReader) {
                                        new TagReader(fileReader).setTagsToRead(self._tagsToRead).read(callbacks);
                                    },
                                    onError: callbacks.onError
                                });
                            },
                            onError: callbacks.onError
                        });
                    }
                }, {
                    key: "_getFileReader",
                    value: function _getFileReader() {
                        if (this._fileReader) {
                            return this._fileReader;
                        } else {
                            return this._findFileReader();
                        }
                    }
                }, {
                    key: "_findFileReader",
                    value: function _findFileReader() {
                        for (var i = 0; i < mediaFileReaders.length; i++) {
                            if (mediaFileReaders[i].canReadFile(this._file)) {
                                return mediaFileReaders[i];
                            }
                        }

                        throw new Error("No suitable file reader found for ", this._file);
                    }
                }, {
                    key: "_getTagReader",
                    value: function _getTagReader(fileReader, callbacks) {
                        if (this._tagReader) {
                            var tagReader = this._tagReader;
                            setTimeout(function () {
                                callbacks.onSuccess(tagReader);
                            }, 1);
                        } else {
                            this._findTagReader(fileReader, callbacks);
                        }
                    }
                }, {
                    key: "_findTagReader",
                    value: function _findTagReader(fileReader, callbacks) {
                        // We don't want to make multiple fetches per tag reader to get the tag
                        // identifier. The strategy here is to combine all the tag identifier
                        // ranges into one and make a single fetch. This is particularly important
                        // in file readers that have expensive loads like the XHR one.
                        // However, with this strategy we run into the problem of loading the
                        // entire file because tag identifiers might be at the start or end of
                        // the file.
                        // To get around this we divide the tag readers into two categories, the
                        // ones that read their tag identifiers from the start of the file and the
                        // ones that read from the end of the file.
                        var tagReadersAtFileStart = [];
                        var tagReadersAtFileEnd = [];
                        var fileSize = fileReader.getSize();

                        for (var i = 0; i < mediaTagReaders.length; i++) {
                            var range = mediaTagReaders[i].getTagIdentifierByteRange();
                            if (!isRangeValid(range, fileSize)) {
                                continue;
                            }

                            if (range.offset >= 0 && range.offset < fileSize / 2 || range.offset < 0 && range.offset < -fileSize / 2) {
                                tagReadersAtFileStart.push(mediaTagReaders[i]);
                            } else {
                                tagReadersAtFileEnd.push(mediaTagReaders[i]);
                            }
                        }

                        var tagsLoaded = false;
                        var loadTagIdentifiersCallbacks = {
                            onSuccess: function onSuccess() {
                                if (!tagsLoaded) {
                                    // We're expecting to load two sets of tag identifiers. This flag
                                    // indicates when the first one has been loaded.
                                    tagsLoaded = true;
                                    return;
                                }

                                for (var i = 0; i < mediaTagReaders.length; i++) {
                                    var range = mediaTagReaders[i].getTagIdentifierByteRange();
                                    if (!isRangeValid(range, fileSize)) {
                                        continue;
                                    }

                                    try {
                                        var tagIndentifier = fileReader.getBytesAt(range.offset >= 0 ? range.offset : range.offset + fileSize, range.length);
                                    } catch (ex) {
                                        if (callbacks.onError) {
                                            callbacks.onError({
                                                "type": "fileReader",
                                                "info": ex.message
                                            });
                                            return;
                                        }
                                    }

                                    if (mediaTagReaders[i].canReadTagFormat(tagIndentifier)) {
                                        callbacks.onSuccess(mediaTagReaders[i]);
                                        return;
                                    }
                                }

                                if (callbacks.onError) {
                                    callbacks.onError({
                                        "type": "tagFormat",
                                        "info": "No suitable tag reader found"
                                    });
                                }
                            },
                            onError: callbacks.onError
                        };

                        this._loadTagIdentifierRanges(fileReader, tagReadersAtFileStart, loadTagIdentifiersCallbacks);
                        this._loadTagIdentifierRanges(fileReader, tagReadersAtFileEnd, loadTagIdentifiersCallbacks);
                    }
                }, {
                    key: "_loadTagIdentifierRanges",
                    value: function _loadTagIdentifierRanges(fileReader, tagReaders, callbacks) {
                        if (tagReaders.length === 0) {
                            // Force async
                            setTimeout(callbacks.onSuccess, 1);
                            return;
                        }

                        var tagIdentifierRange = [Number.MAX_VALUE, 0];
                        var fileSize = fileReader.getSize();

                        // Create a super set of all ranges so we can load them all at once.
                        // Might need to rethink this approach if there are tag ranges too far
                        // a part from each other. We're good for now though.
                        for (var i = 0; i < tagReaders.length; i++) {
                            var range = tagReaders[i].getTagIdentifierByteRange();
                            var start = range.offset >= 0 ? range.offset : range.offset + fileSize;
                            var end = start + range.length - 1;

                            tagIdentifierRange[0] = Math.min(start, tagIdentifierRange[0]);
                            tagIdentifierRange[1] = Math.max(end, tagIdentifierRange[1]);
                        }

                        fileReader.loadRange(tagIdentifierRange, callbacks);
                    }
                }]);

                return Reader;
            }();

            var Config = function () {
                function Config() {
                    _classCallCheck(this, Config);
                }

                _createClass(Config, null, [{
                    key: "addFileReader",
                    value: function addFileReader(fileReader) {
                        mediaFileReaders.push(fileReader);
                        return Config;
                    }
                }, {
                    key: "addTagReader",
                    value: function addTagReader(tagReader) {
                        mediaTagReaders.push(tagReader);
                        return Config;
                    }
                }, {
                    key: "removeTagReader",
                    value: function removeTagReader(tagReader) {
                        var tagReaderIx = mediaTagReaders.indexOf(tagReader);

                        if (tagReaderIx >= 0) {
                            mediaTagReaders.splice(tagReaderIx, 1);
                        }

                        return Config;
                    }
                }, {
                    key: "EXPERIMENTAL_avoidHeadRequests",
                    value: function EXPERIMENTAL_avoidHeadRequests() {
                        XhrFileReader.setConfig({
                            avoidHeadRequests: true
                        });
                    }
                }, {
                    key: "setDisallowedXhrHeaders",
                    value: function setDisallowedXhrHeaders(disallowedXhrHeaders) {
                        XhrFileReader.setConfig({
                            disallowedXhrHeaders: disallowedXhrHeaders
                        });
                    }
                }, {
                    key: "setXhrTimeoutInSec",
                    value: function setXhrTimeoutInSec(timeoutInSec) {
                        XhrFileReader.setConfig({
                            timeoutInSec: timeoutInSec
                        });
                    }
                }]);

                return Config;
            }();

            Config.addFileReader(XhrFileReader).addFileReader(BlobFileReader).addFileReader(ArrayFileReader).addTagReader(ID3v2TagReader).addTagReader(ID3v1TagReader).addTagReader(MP4TagReader);

            if (typeof process !== "undefined") {
                Config.addFileReader(NodeFileReader);
            }

            module.exports = {
                "read": read,
                "Reader": Reader,
                "Config": Config
            };
        }, { "./ArrayFileReader": 3, "./BlobFileReader": 4, "./ID3v1TagReader": 6, "./ID3v2TagReader": 8, "./MP4TagReader": 9, "./MediaFileReader": 10, "./MediaTagReader": 11, "./NodeFileReader": 1, "./XhrFileReader": 13 }]
    }, {}, [14])(14);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9).Buffer, __webpack_require__(15)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(8)
var ieee754 = __webpack_require__(14)
var isArray = __webpack_require__(10)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body {\n    contain: strict;\n    margin: 0;\n    overflow: hidden;\n    width: 100vw;\n    height: 100vh;\n}\n\n* {\n    -webkit-user-drag: none;\n    -webkit-user-select: none;\n}", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "._2alszQVyoeYm5cMi0U5xnh {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    flex-direction: column;\n    width: 100vw;\n    height: 100vh;\n    z-index: 3;\n    background: transparent;\n}", ""]);

// exports
exports.locals = {
	"dropzone": "_2alszQVyoeYm5cMi0U5xnh"
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "._1tN1uRZVCMMOD86N7qc7Ng {\n    width: 100%;\n    height: 8px;\n}\n\n._25OJAbdkACcN6zZS_sOS6N {\n    position: absolute;\n    overflow: none;\n    z-index: 1;\n    width: 100vw;\n    height: 100vh;\n    object-fit: cover;\n}\n\n._1ijSzRhuNd-1HvdBM_QNCO {\n    position: absolute;\n    top: 0;\n    left: 0;\n    z-index: -10;\n    width: 100vw;\n    height: 100vh;\n}\n\n._24mqOmDSzZQx1jgFQ-vHsu {\n    position: relative;\n    z-index: 2;\n}\n\n._3lzmpfW1miEVRfgWBuw-25 {\n    border-radius: 50%;\n    width: 10rem;\n    height: 10rem;\n    transform: scale(0);\n}\n\n._1naaXWxY9MrQtHYW9GVze7 {\n    color: white;\n    text-align: center;\n    width: 100%;\n    font-family: -apple-system, BlinkMacSystemFont;\n}", ""]);

// exports
exports.locals = {
	"volumeScrubber": "_1tN1uRZVCMMOD86N7qc7Ng",
	"bg": "_25OJAbdkACcN6zZS_sOS6N",
	"canvas": "_1ijSzRhuNd-1HvdBM_QNCO",
	"song": "_24mqOmDSzZQx1jgFQ-vHsu",
	"thumbnail": "_3lzmpfW1miEVRfgWBuw-25",
	"name": "_1naaXWxY9MrQtHYW9GVze7"
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 15 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js??ref--1-1!./Dropzone.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js??ref--1-1!./Dropzone.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js??ref--1-1!./Song.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js??ref--1-1!./Song.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 18 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 20 */,
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, setImmediate) {// Rebound
// =======
// **Rebound** is a simple library that models Spring dynamics for the
// purpose of driving physical animations.
//
// Origin
// ------
// [Rebound](http://facebook.github.io/rebound) was originally written
// in Java to provide a lightweight physics system for
// [Home](https://play.google.com/store/apps/details?id=com.facebook.home) and
// [Chat Heads](https://play.google.com/store/apps/details?id=com.facebook.orca)
// on Android. It's now been adopted by several other Android
// applications. This JavaScript port was written to provide a quick
// way to demonstrate Rebound animations on the web for a
// [conference talk](https://www.youtube.com/watch?v=s5kNm-DgyjY). Since then
// the JavaScript version has been used to build some really nice interfaces.
// Check out [brandonwalkin.com](http://brandonwalkin.com) for an
// example.
//
// Overview
// --------
// The Library provides a SpringSystem for maintaining a set of Spring
// objects and iterating those Springs through a physics solver loop
// until equilibrium is achieved. The Spring class is the basic
// animation driver provided by Rebound. By attaching a listener to
// a Spring, you can observe its motion. The observer function is
// notified of position changes on the spring as it solves for
// equilibrium. These position updates can be mapped to an animation
// range to drive animated property updates on your user interface
// elements (translation, rotation, scale, etc).
//
// Example
// -------
// Here's a simple example. Pressing and releasing on the logo below
// will cause it to scale up and down with a springy animation.
//
// <div style="text-align:center; margin-bottom:50px; margin-top:50px">
//   <img
//     src="http://facebook.github.io/rebound/images/rebound.png"
//     id="logo"
//   />
// </div>
// <script src="../rebound.min.js"></script>
// <script>
//
// function scale(el, val) {
//   el.style.mozTransform =
//   el.style.msTransform =
//   el.style.webkitTransform =
//   el.style.transform = 'scale3d(' + val + ', ' + val + ', 1)';
// }
// var el = document.getElementById('logo');
//
// var springSystem = new rebound.SpringSystem();
// var spring = springSystem.createSpring(50, 3);
// spring.addListener({
//   onSpringUpdate: function(spring) {
//     var val = spring.getCurrentValue();
//     val = rebound.MathUtil.mapValueInRange(val, 0, 1, 1, 0.5);
//     scale(el, val);
//   }
// });
//
// el.addEventListener('mousedown', function() {
//   spring.setEndValue(1);
// });
//
// el.addEventListener('mouseout', function() {
//   spring.setEndValue(0);
// });
//
// el.addEventListener('mouseup', function() {
//   spring.setEndValue(0);
// });
//
// </script>
//
// Here's how it works.
//
// ```
// // Get a reference to the logo element.
// var el = document.getElementById('logo');
//
// // create a SpringSystem and a Spring with a bouncy config.
// var springSystem = new rebound.SpringSystem();
// var spring = springSystem.createSpring(50, 3);
//
// // Add a listener to the spring. Every time the physics
// // solver updates the Spring's value onSpringUpdate will
// // be called.
// spring.addListener({
//   onSpringUpdate: function(spring) {
//     var val = spring.getCurrentValue();
//     val = rebound.MathUtil
//                  .mapValueInRange(val, 0, 1, 1, 0.5);
//     scale(el, val);
//   }
// });
//
// // Listen for mouse down/up/out and toggle the
// //springs endValue from 0 to 1.
// el.addEventListener('mousedown', function() {
//   spring.setEndValue(1);
// });
//
// el.addEventListener('mouseout', function() {
//   spring.setEndValue(0);
// });
//
// el.addEventListener('mouseup', function() {
//   spring.setEndValue(0);
// });
//
// // Helper for scaling an element with css transforms.
// function scale(el, val) {
//   el.style.mozTransform =
//   el.style.msTransform =
//   el.style.webkitTransform =
//   el.style.transform = 'scale3d(' +
//     val + ', ' + val + ', 1)';
// }
// ```

(function() {
  var rebound = {};
  var util = rebound.util = {};
  var concat = Array.prototype.concat;
  var slice = Array.prototype.slice;

  // Bind a function to a context object.
  util.bind = function bind(func, context) {
    var args = slice.call(arguments, 2);
    return function() {
      func.apply(context, concat.call(args, slice.call(arguments)));
    };
  };

  // Add all the properties in the source to the target.
  util.extend = function extend(target, source) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  };

  // SpringSystem
  // ------------
  // **SpringSystem** is a set of Springs that all run on the same physics
  // timing loop. To get started with a Rebound animation you first
  // create a new SpringSystem and then add springs to it.
  var SpringSystem = rebound.SpringSystem = function SpringSystem(looper) {
    this._springRegistry = {};
    this._activeSprings = [];
    this.listeners = [];
    this._idleSpringIndices = [];
    this.looper = looper || new AnimationLooper();
    this.looper.springSystem = this;
  };

  util.extend(SpringSystem.prototype, {

    _springRegistry: null,

    _isIdle: true,

    _lastTimeMillis: -1,

    _activeSprings: null,

    listeners: null,

    _idleSpringIndices: null,

    // A SpringSystem is iterated by a looper. The looper is responsible
    // for executing each frame as the SpringSystem is resolved to idle.
    // There are three types of Loopers described below AnimationLooper,
    // SimulationLooper, and SteppingSimulationLooper. AnimationLooper is
    // the default as it is the most useful for common UI animations.
    setLooper: function(looper) {
      this.looper = looper;
      looper.springSystem = this;
    },

    // Add a new spring to this SpringSystem. This Spring will now be solved for
    // during the physics iteration loop. By default the spring will use the
    // default Origami spring config with 40 tension and 7 friction, but you can
    // also provide your own values here.
    createSpring: function(tension, friction) {
      var springConfig;
      if (tension === undefined || friction === undefined) {
        springConfig = SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG;
      } else {
        springConfig =
          SpringConfig.fromOrigamiTensionAndFriction(tension, friction);
      }
      return this.createSpringWithConfig(springConfig);
    },

    // Add a spring with a specified bounciness and speed. To replicate Origami
    // compositions based on PopAnimation patches, use this factory method to
    // create matching springs.
    createSpringWithBouncinessAndSpeed: function(bounciness, speed) {
      var springConfig;
      if (bounciness === undefined || speed === undefined) {
        springConfig = SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG;
      } else {
        springConfig =
          SpringConfig.fromBouncinessAndSpeed(bounciness, speed);
      }
      return this.createSpringWithConfig(springConfig);
    },

    // Add a spring with the provided SpringConfig.
    createSpringWithConfig: function(springConfig) {
      var spring = new Spring(this);
      this.registerSpring(spring);
      spring.setSpringConfig(springConfig);
      return spring;
    },

    // You can check if a SpringSystem is idle or active by calling
    // getIsIdle. If all of the Springs in the SpringSystem are at rest,
    // i.e. the physics forces have reached equilibrium, then this
    // method will return true.
    getIsIdle: function() {
      return this._isIdle;
    },

    // Retrieve a specific Spring from the SpringSystem by id. This
    // can be useful for inspecting the state of a spring before
    // or after an integration loop in the SpringSystem executes.
    getSpringById: function (id) {
      return this._springRegistry[id];
    },

    // Get a listing of all the springs registered with this
    // SpringSystem.
    getAllSprings: function() {
      var vals = [];
      for (var id in this._springRegistry) {
        if (this._springRegistry.hasOwnProperty(id)) {
          vals.push(this._springRegistry[id]);
        }
      }
      return vals;
    },

    // registerSpring is called automatically as soon as you create
    // a Spring with SpringSystem#createSpring. This method sets the
    // spring up in the registry so that it can be solved in the
    // solver loop.
    registerSpring: function(spring) {
      this._springRegistry[spring.getId()] = spring;
    },

    // Deregister a spring with this SpringSystem. The SpringSystem will
    // no longer consider this Spring during its integration loop once
    // this is called. This is normally done automatically for you when
    // you call Spring#destroy.
    deregisterSpring: function(spring) {
      removeFirst(this._activeSprings, spring);
      delete this._springRegistry[spring.getId()];
    },

    advance: function(time, deltaTime) {
      while(this._idleSpringIndices.length > 0) this._idleSpringIndices.pop();
      for (var i = 0, len = this._activeSprings.length; i < len; i++) {
        var spring = this._activeSprings[i];
        if (spring.systemShouldAdvance()) {
          spring.advance(time / 1000.0, deltaTime / 1000.0);
        } else {
          this._idleSpringIndices.push(this._activeSprings.indexOf(spring));
        }
      }
      while(this._idleSpringIndices.length > 0) {
        var idx = this._idleSpringIndices.pop();
        idx >= 0 && this._activeSprings.splice(idx, 1);
      }
    },

    // This is our main solver loop called to move the simulation
    // forward through time. Before each pass in the solver loop
    // onBeforeIntegrate is called on an any listeners that have
    // registered themeselves with the SpringSystem. This gives you
    // an opportunity to apply any constraints or adjustments to
    // the springs that should be enforced before each iteration
    // loop. Next the advance method is called to move each Spring in
    // the systemShouldAdvance forward to the current time. After the
    // integration step runs in advance, onAfterIntegrate is called
    // on any listeners that have registered themselves with the
    // SpringSystem. This gives you an opportunity to run any post
    // integration constraints or adjustments on the Springs in the
    // SpringSystem.
    loop: function(currentTimeMillis) {
      var listener;
      if (this._lastTimeMillis === -1) {
        this._lastTimeMillis = currentTimeMillis -1;
      }
      var ellapsedMillis = currentTimeMillis - this._lastTimeMillis;
      this._lastTimeMillis = currentTimeMillis;

      var i = 0, len = this.listeners.length;
      for (i = 0; i < len; i++) {
        listener = this.listeners[i];
        listener.onBeforeIntegrate && listener.onBeforeIntegrate(this);
      }

      this.advance(currentTimeMillis, ellapsedMillis);
      if (this._activeSprings.length === 0) {
        this._isIdle = true;
        this._lastTimeMillis = -1;
      }

      for (i = 0; i < len; i++) {
        listener = this.listeners[i];
        listener.onAfterIntegrate && listener.onAfterIntegrate(this);
      }

      if (!this._isIdle) {
        this.looper.run();
      }
    },

    // activateSpring is used to notify the SpringSystem that a Spring
    // has become displaced. The system responds by starting its solver
    // loop up if it is currently idle.
    activateSpring: function(springId) {
      var spring = this._springRegistry[springId];
      if (this._activeSprings.indexOf(spring) == -1) {
        this._activeSprings.push(spring);
      }
      if (this.getIsIdle()) {
        this._isIdle = false;
        this.looper.run();
      }
    },

    // Add a listener to the SpringSystem so that you can receive
    // before/after integration notifications allowing Springs to be
    // constrained or adjusted.
    addListener: function(listener) {
      this.listeners.push(listener);
    },

    // Remove a previously added listener on the SpringSystem.
    removeListener: function(listener) {
      removeFirst(this.listeners, listener);
    },

    // Remove all previously added listeners on the SpringSystem.
    removeAllListeners: function() {
      this.listeners = [];
    }

  });

  // Spring
  // ------
  // **Spring** provides a model of a classical spring acting to
  // resolve a body to equilibrium. Springs have configurable
  // tension which is a force multipler on the displacement of the
  // spring from its rest point or `endValue` as defined by [Hooke's
  // law](http://en.wikipedia.org/wiki/Hooke's_law). Springs also have
  // configurable friction, which ensures that they do not oscillate
  // infinitely. When a Spring is displaced by updating it's resting
  // or `currentValue`, the SpringSystems that contain that Spring
  // will automatically start looping to solve for equilibrium. As each
  // timestep passes, `SpringListener` objects attached to the Spring
  // will be notified of the updates providing a way to drive an
  // animation off of the spring's resolution curve.
  var Spring = rebound.Spring = function Spring(springSystem) {
    this._id = 's' + Spring._ID++;
    this._springSystem = springSystem;
    this.listeners = [];
    this._currentState = new PhysicsState();
    this._previousState = new PhysicsState();
    this._tempState = new PhysicsState();
  };

  util.extend(Spring, {
    _ID: 0,

    MAX_DELTA_TIME_SEC: 0.064,

    SOLVER_TIMESTEP_SEC: 0.001

  });

  util.extend(Spring.prototype, {

    _id: 0,

    _springConfig: null,

    _overshootClampingEnabled: false,

    _currentState: null,

    _previousState: null,

    _tempState: null,

    _startValue: 0,

    _endValue: 0,

    _wasAtRest: true,

    _restSpeedThreshold: 0.001,

    _displacementFromRestThreshold: 0.001,

    listeners: null,

    _timeAccumulator: 0,

    _springSystem: null,

    // Remove a Spring from simulation and clear its listeners.
    destroy: function() {
      this.listeners = [];
      this._springSystem.deregisterSpring(this);
    },

    // Get the id of the spring, which can be used to retrieve it from
    // the SpringSystems it participates in later.
    getId: function() {
      return this._id;
    },

    // Set the configuration values for this Spring. A SpringConfig
    // contains the tension and friction values used to solve for the
    // equilibrium of the Spring in the physics loop.
    setSpringConfig: function(springConfig) {
      this._springConfig = springConfig;
      return this;
    },

    // Retrieve the SpringConfig used by this Spring.
    getSpringConfig: function() {
      return this._springConfig;
    },

    // Set the current position of this Spring. Listeners will be updated
    // with this value immediately. If the rest or `endValue` is not
    // updated to match this value, then the spring will be dispalced and
    // the SpringSystem will start to loop to restore the spring to the
    // `endValue`.
    //
    // A common pattern is to move a Spring around without animation by
    // calling.
    //
    // ```
    // spring.setCurrentValue(n).setAtRest();
    // ```
    //
    // This moves the Spring to a new position `n`, sets the endValue
    // to `n`, and removes any velocity from the `Spring`. By doing
    // this you can allow the `SpringListener` to manage the position
    // of UI elements attached to the spring even when moving without
    // animation. For example, when dragging an element you can
    // update the position of an attached view through a spring
    // by calling `spring.setCurrentValue(x)`. When
    // the gesture ends you can update the Springs
    // velocity and endValue
    // `spring.setVelocity(gestureEndVelocity).setEndValue(flingTarget)`
    // to cause it to naturally animate the UI element to the resting
    // position taking into account existing velocity. The codepaths for
    // synchronous movement and spring driven animation can
    // be unified using this technique.
    setCurrentValue: function(currentValue, skipSetAtRest) {
      this._startValue = currentValue;
      this._currentState.position = currentValue;
      if (!skipSetAtRest) {
        this.setAtRest();
      }
      this.notifyPositionUpdated(false, false);
      return this;
    },

    // Get the position that the most recent animation started at. This
    // can be useful for determining the number off oscillations that
    // have occurred.
    getStartValue: function() {
      return this._startValue;
    },

    // Retrieve the current value of the Spring.
    getCurrentValue: function() {
      return this._currentState.position;
    },

    // Get the absolute distance of the Spring from it's resting endValue
    // position.
    getCurrentDisplacementDistance: function() {
      return this.getDisplacementDistanceForState(this._currentState);
    },

    getDisplacementDistanceForState: function(state) {
      return Math.abs(this._endValue - state.position);
    },

    // Set the endValue or resting position of the spring. If this
    // value is different than the current value, the SpringSystem will
    // be notified and will begin running its solver loop to resolve
    // the Spring to equilibrium. Any listeners that are registered
    // for onSpringEndStateChange will also be notified of this update
    // immediately.
    setEndValue: function(endValue) {
      if (this._endValue == endValue && this.isAtRest())  {
        return this;
      }
      this._startValue = this.getCurrentValue();
      this._endValue = endValue;
      this._springSystem.activateSpring(this.getId());
      for (var i = 0, len = this.listeners.length; i < len; i++) {
        var listener = this.listeners[i];
        var onChange = listener.onSpringEndStateChange;
        onChange && onChange(this);
      }
      return this;
    },

    // Retrieve the endValue or resting position of this spring.
    getEndValue: function() {
      return this._endValue;
    },

    // Set the current velocity of the Spring, in pixels per second. As
    // previously mentioned, this can be useful when you are performing
    // a direct manipulation gesture. When a UI element is released you
    // may call setVelocity on its animation Spring so that the Spring
    // continues with the same velocity as the gesture ended with. The
    // friction, tension, and displacement of the Spring will then
    // govern its motion to return to rest on a natural feeling curve.
    setVelocity: function(velocity) {
      if (velocity === this._currentState.velocity) {
        return this;
      }
      this._currentState.velocity = velocity;
      this._springSystem.activateSpring(this.getId());
      return this;
    },

    // Get the current velocity of the Spring, in pixels per second.
    getVelocity: function() {
      return this._currentState.velocity;
    },

    // Set a threshold value for the movement speed of the Spring below
    // which it will be considered to be not moving or resting.
    setRestSpeedThreshold: function(restSpeedThreshold) {
      this._restSpeedThreshold = restSpeedThreshold;
      return this;
    },

    // Retrieve the rest speed threshold for this Spring.
    getRestSpeedThreshold: function() {
      return this._restSpeedThreshold;
    },

    // Set a threshold value for displacement below which the Spring
    // will be considered to be not displaced i.e. at its resting
    // `endValue`.
    setRestDisplacementThreshold: function(displacementFromRestThreshold) {
      this._displacementFromRestThreshold = displacementFromRestThreshold;
    },

    // Retrieve the rest displacement threshold for this spring.
    getRestDisplacementThreshold: function() {
      return this._displacementFromRestThreshold;
    },

    // Enable overshoot clamping. This means that the Spring will stop
    // immediately when it reaches its resting position regardless of
    // any existing momentum it may have. This can be useful for certain
    // types of animations that should not oscillate such as a scale
    // down to 0 or alpha fade.
    setOvershootClampingEnabled: function(enabled) {
      this._overshootClampingEnabled = enabled;
      return this;
    },

    // Check if overshoot clamping is enabled for this spring.
    isOvershootClampingEnabled: function() {
      return this._overshootClampingEnabled;
    },

    // Check if the Spring has gone past its end point by comparing
    // the direction it was moving in when it started to the current
    // position and end value.
    isOvershooting: function() {
      var start = this._startValue;
      var end = this._endValue;
      return this._springConfig.tension > 0 &&
       ((start < end && this.getCurrentValue() > end) ||
       (start > end && this.getCurrentValue() < end));
    },

    // Spring.advance is the main solver method for the Spring. It takes
    // the current time and delta since the last time step and performs
    // an RK4 integration to get the new position and velocity state
    // for the Spring based on the tension, friction, velocity, and
    // displacement of the Spring.
    advance: function(time, realDeltaTime) {
      var isAtRest = this.isAtRest();

      if (isAtRest && this._wasAtRest) {
        return;
      }

      var adjustedDeltaTime = realDeltaTime;
      if (realDeltaTime > Spring.MAX_DELTA_TIME_SEC) {
        adjustedDeltaTime = Spring.MAX_DELTA_TIME_SEC;
      }

      this._timeAccumulator += adjustedDeltaTime;

      var tension = this._springConfig.tension,
          friction = this._springConfig.friction,

          position = this._currentState.position,
          velocity = this._currentState.velocity,
          tempPosition = this._tempState.position,
          tempVelocity = this._tempState.velocity,

          aVelocity, aAcceleration,
          bVelocity, bAcceleration,
          cVelocity, cAcceleration,
          dVelocity, dAcceleration,

          dxdt, dvdt;

      while(this._timeAccumulator >= Spring.SOLVER_TIMESTEP_SEC) {

        this._timeAccumulator -= Spring.SOLVER_TIMESTEP_SEC;

        if (this._timeAccumulator < Spring.SOLVER_TIMESTEP_SEC) {
          this._previousState.position = position;
          this._previousState.velocity = velocity;
        }

        aVelocity = velocity;
        aAcceleration =
          (tension * (this._endValue - tempPosition)) - friction * velocity;

        tempPosition = position + aVelocity * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        tempVelocity =
          velocity + aAcceleration * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        bVelocity = tempVelocity;
        bAcceleration =
          (tension * (this._endValue - tempPosition)) - friction * tempVelocity;

        tempPosition = position + bVelocity * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        tempVelocity =
          velocity + bAcceleration * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        cVelocity = tempVelocity;
        cAcceleration =
          (tension * (this._endValue - tempPosition)) - friction * tempVelocity;

        tempPosition = position + cVelocity * Spring.SOLVER_TIMESTEP_SEC;
        tempVelocity =
          velocity + cAcceleration * Spring.SOLVER_TIMESTEP_SEC;
        dVelocity = tempVelocity;
        dAcceleration =
          (tension * (this._endValue - tempPosition)) - friction * tempVelocity;

        dxdt =
          1.0/6.0 * (aVelocity + 2.0 * (bVelocity + cVelocity) + dVelocity);
        dvdt = 1.0/6.0 * (
          aAcceleration + 2.0 * (bAcceleration + cAcceleration) + dAcceleration
        );

        position += dxdt * Spring.SOLVER_TIMESTEP_SEC;
        velocity += dvdt * Spring.SOLVER_TIMESTEP_SEC;
      }

      this._tempState.position = tempPosition;
      this._tempState.velocity = tempVelocity;

      this._currentState.position = position;
      this._currentState.velocity = velocity;

      if (this._timeAccumulator > 0) {
        this._interpolate(this._timeAccumulator / Spring.SOLVER_TIMESTEP_SEC);
      }

      if (this.isAtRest() ||
          this._overshootClampingEnabled && this.isOvershooting()) {

        if (this._springConfig.tension > 0) {
          this._startValue = this._endValue;
          this._currentState.position = this._endValue;
        } else {
          this._endValue = this._currentState.position;
          this._startValue = this._endValue;
        }
        this.setVelocity(0);
        isAtRest = true;
      }

      var notifyActivate = false;
      if (this._wasAtRest) {
        this._wasAtRest = false;
        notifyActivate = true;
      }

      var notifyAtRest = false;
      if (isAtRest) {
        this._wasAtRest = true;
        notifyAtRest = true;
      }

      this.notifyPositionUpdated(notifyActivate, notifyAtRest);
    },

    notifyPositionUpdated: function(notifyActivate, notifyAtRest) {
      for (var i = 0, len = this.listeners.length; i < len; i++) {
        var listener = this.listeners[i];
        if (notifyActivate && listener.onSpringActivate) {
          listener.onSpringActivate(this);
        }

        if (listener.onSpringUpdate) {
          listener.onSpringUpdate(this);
        }

        if (notifyAtRest && listener.onSpringAtRest) {
          listener.onSpringAtRest(this);
        }
      }
    },


    // Check if the SpringSystem should advance. Springs are advanced
    // a final frame after they reach equilibrium to ensure that the
    // currentValue is exactly the requested endValue regardless of the
    // displacement threshold.
    systemShouldAdvance: function() {
      return !this.isAtRest() || !this.wasAtRest();
    },

    wasAtRest: function() {
      return this._wasAtRest;
    },

    // Check if the Spring is atRest meaning that it's currentValue and
    // endValue are the same and that it has no velocity. The previously
    // described thresholds for speed and displacement define the bounds
    // of this equivalence check. If the Spring has 0 tension, then it will
    // be considered at rest whenever its absolute velocity drops below the
    // restSpeedThreshold.
    isAtRest: function() {
      return Math.abs(this._currentState.velocity) < this._restSpeedThreshold &&
        (this.getDisplacementDistanceForState(this._currentState) <=
          this._displacementFromRestThreshold ||
        this._springConfig.tension === 0);
    },

    // Force the spring to be at rest at its current position. As
    // described in the documentation for setCurrentValue, this method
    // makes it easy to do synchronous non-animated updates to ui
    // elements that are attached to springs via SpringListeners.
    setAtRest: function() {
      this._endValue = this._currentState.position;
      this._tempState.position = this._currentState.position;
      this._currentState.velocity = 0;
      return this;
    },

    _interpolate: function(alpha) {
      this._currentState.position = this._currentState.position *
        alpha + this._previousState.position * (1 - alpha);
      this._currentState.velocity = this._currentState.velocity *
        alpha + this._previousState.velocity * (1 - alpha);
    },

    getListeners: function() {
      return this.listeners;
    },

    addListener: function(newListener) {
      this.listeners.push(newListener);
      return this;
    },

    removeListener: function(listenerToRemove) {
      removeFirst(this.listeners, listenerToRemove);
      return this;
    },

    removeAllListeners: function() {
      this.listeners = [];
      return this;
    },

    currentValueIsApproximately: function(value) {
      return Math.abs(this.getCurrentValue() - value) <=
        this.getRestDisplacementThreshold();
    }

  });

  // PhysicsState
  // ------------
  // **PhysicsState** consists of a position and velocity. A Spring uses
  // this internally to keep track of its current and prior position and
  // velocity values.
  var PhysicsState = function PhysicsState() {};

  util.extend(PhysicsState.prototype, {
    position: 0,
    velocity: 0
  });

  // SpringConfig
  // ------------
  // **SpringConfig** maintains a set of tension and friction constants
  // for a Spring. You can use fromOrigamiTensionAndFriction to convert
  // values from the [Origami](http://facebook.github.io/origami/)
  // design tool directly to Rebound spring constants.
  var SpringConfig = rebound.SpringConfig =
    function SpringConfig(tension, friction) {
      this.tension = tension;
      this.friction = friction;
    };

  // Loopers
  // -------
  // **AnimationLooper** plays each frame of the SpringSystem on animation
  // timing loop. This is the default type of looper for a new spring system
  // as it is the most common when developing UI.
  var AnimationLooper = rebound.AnimationLooper = function AnimationLooper() {
    this.springSystem = null;
    var _this = this;
    var _run = function() {
      _this.springSystem.loop(Date.now());
    };

    this.run = function() {
      util.onFrame(_run);
    };
  };

  // **SimulationLooper** resolves the SpringSystem to a resting state in a
  // tight and blocking loop. This is useful for synchronously generating
  // pre-recorded animations that can then be played on a timing loop later.
  // Sometimes this lead to better performance to pre-record a single spring
  // curve and use it to drive many animations; however, it can make dynamic
  // response to user input a bit trickier to implement.
  rebound.SimulationLooper = function SimulationLooper(timestep) {
    this.springSystem = null;
    var time = 0;
    var running = false;
    timestep=timestep || 16.667;

    this.run = function() {
      if (running) {
        return;
      }
      running = true;
      while(!this.springSystem.getIsIdle()) {
        this.springSystem.loop(time+=timestep);
      }
      running = false;
    };
  };

  // **SteppingSimulationLooper** resolves the SpringSystem one step at a
  // time controlled by an outside loop. This is useful for testing and
  // verifying the behavior of a SpringSystem or if you want to control your own
  // timing loop for some reason e.g. slowing down or speeding up the
  // simulation.
  rebound.SteppingSimulationLooper = function(timestep) {
    this.springSystem = null;
    var time = 0;

    // this.run is NOOP'd here to allow control from the outside using
    // this.step.
    this.run = function(){};

    // Perform one step toward resolving the SpringSystem.
    this.step = function(timestep) {
      this.springSystem.loop(time+=timestep);
    };
  };

  // Math for converting from
  // [Origami](http://facebook.github.io/origami/) to
  // [Rebound](http://facebook.github.io/rebound).
  // You mostly don't need to worry about this, just use
  // SpringConfig.fromOrigamiTensionAndFriction(v, v);
  var OrigamiValueConverter = rebound.OrigamiValueConverter = {
    tensionFromOrigamiValue: function(oValue) {
      return (oValue - 30.0) * 3.62 + 194.0;
    },

    origamiValueFromTension: function(tension) {
      return (tension - 194.0) / 3.62 + 30.0;
    },

    frictionFromOrigamiValue: function(oValue) {
      return (oValue - 8.0) * 3.0 + 25.0;
    },

    origamiFromFriction: function(friction) {
      return (friction - 25.0) / 3.0 + 8.0;
    }
  };

  // BouncyConversion provides math for converting from Origami PopAnimation
  // config values to regular Origami tension and friction values. If you are
  // trying to replicate prototypes made with PopAnimation patches in Origami,
  // then you should create your springs with
  // SpringSystem.createSpringWithBouncinessAndSpeed, which uses this Math
  // internally to create a spring to match the provided PopAnimation
  // configuration from Origami.
  var BouncyConversion = rebound.BouncyConversion = function(bounciness, speed){
    this.bounciness = bounciness;
    this.speed = speed;
    var b = this.normalize(bounciness / 1.7, 0, 20.0);
    b = this.projectNormal(b, 0.0, 0.8);
    var s = this.normalize(speed / 1.7, 0, 20.0);
    this.bouncyTension = this.projectNormal(s, 0.5, 200)
    this.bouncyFriction = this.quadraticOutInterpolation(
      b,
      this.b3Nobounce(this.bouncyTension),
      0.01);
  }

  util.extend(BouncyConversion.prototype, {

    normalize: function(value, startValue, endValue) {
      return (value - startValue) / (endValue - startValue);
    },

    projectNormal: function(n, start, end) {
      return start + (n * (end - start));
    },

    linearInterpolation: function(t, start, end) {
      return t * end + (1.0 - t) * start;
    },

    quadraticOutInterpolation: function(t, start, end) {
      return this.linearInterpolation(2*t - t*t, start, end);
    },

    b3Friction1: function(x) {
      return (0.0007 * Math.pow(x, 3)) -
        (0.031 * Math.pow(x, 2)) + 0.64 * x + 1.28;
    },

    b3Friction2: function(x) {
      return (0.000044 * Math.pow(x, 3)) -
        (0.006 * Math.pow(x, 2)) + 0.36 * x + 2.;
    },

    b3Friction3: function(x) {
      return (0.00000045 * Math.pow(x, 3)) -
        (0.000332 * Math.pow(x, 2)) + 0.1078 * x + 5.84;
    },

    b3Nobounce: function(tension) {
      var friction = 0;
      if (tension <= 18) {
        friction = this.b3Friction1(tension);
      } else if (tension > 18 && tension <= 44) {
        friction = this.b3Friction2(tension);
      } else {
        friction = this.b3Friction3(tension);
      }
      return friction;
    }
  });

  util.extend(SpringConfig, {
    // Convert an origami Spring tension and friction to Rebound spring
    // constants. If you are prototyping a design with Origami, this
    // makes it easy to make your springs behave exactly the same in
    // Rebound.
    fromOrigamiTensionAndFriction: function(tension, friction) {
      return new SpringConfig(
        OrigamiValueConverter.tensionFromOrigamiValue(tension),
        OrigamiValueConverter.frictionFromOrigamiValue(friction));
    },

    // Convert an origami PopAnimation Spring bounciness and speed to Rebound
    // spring constants. If you are using PopAnimation patches in Origami, this
    // utility will provide springs that match your prototype.
    fromBouncinessAndSpeed: function(bounciness, speed) {
      var bouncyConversion = new rebound.BouncyConversion(bounciness, speed);
      return this.fromOrigamiTensionAndFriction(
        bouncyConversion.bouncyTension,
        bouncyConversion.bouncyFriction);
    },

    // Create a SpringConfig with no tension or a coasting spring with some
    // amount of Friction so that it does not coast infininitely.
    coastingConfigWithOrigamiFriction: function(friction) {
      return new SpringConfig(
        0,
        OrigamiValueConverter.frictionFromOrigamiValue(friction)
      );
    }
  });

  SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG =
    SpringConfig.fromOrigamiTensionAndFriction(40, 7);

  util.extend(SpringConfig.prototype, {friction: 0, tension: 0});

  // Here are a couple of function to convert colors between hex codes and RGB
  // component values. These are handy when performing color
  // tweening animations.
  var colorCache = {};
  util.hexToRGB = function(color) {
    if (colorCache[color]) {
      return colorCache[color];
    }
    color = color.replace('#', '');
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    var parts = color.match(/.{2}/g);

    var ret = {
      r: parseInt(parts[0], 16),
      g: parseInt(parts[1], 16),
      b: parseInt(parts[2], 16)
    };

    colorCache[color] = ret;
    return ret;
  };

  util.rgbToHex = function(r, g, b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    r = r.length < 2 ? '0' + r : r;
    g = g.length < 2 ? '0' + g : g;
    b = b.length < 2 ? '0' + b : b;
    return '#' + r + g + b;
  };

  var MathUtil = rebound.MathUtil = {
    // This helper function does a linear interpolation of a value from
    // one range to another. This can be very useful for converting the
    // motion of a Spring to a range of UI property values. For example a
    // spring moving from position 0 to 1 could be interpolated to move a
    // view from pixel 300 to 350 and scale it from 0.5 to 1. The current
    // position of the `Spring` just needs to be run through this method
    // taking its input range in the _from_ parameters with the property
    // animation range in the _to_ parameters.
    mapValueInRange: function(value, fromLow, fromHigh, toLow, toHigh) {
      var fromRangeSize = fromHigh - fromLow;
      var toRangeSize = toHigh - toLow;
      var valueScale = (value - fromLow) / fromRangeSize;
      return toLow + (valueScale * toRangeSize);
    },

    // Interpolate two hex colors in a 0 - 1 range or optionally provide a
    // custom range with fromLow,fromHight. The output will be in hex by default
    // unless asRGB is true in which case it will be returned as an rgb string.
    interpolateColor:
      function(val, startColor, endColor, fromLow, fromHigh, asRGB) {
      fromLow = fromLow === undefined ? 0 : fromLow;
      fromHigh = fromHigh === undefined ? 1 : fromHigh;
      startColor = util.hexToRGB(startColor);
      endColor = util.hexToRGB(endColor);
      var r = Math.floor(
        util.mapValueInRange(val, fromLow, fromHigh, startColor.r, endColor.r)
      );
      var g = Math.floor(
        util.mapValueInRange(val, fromLow, fromHigh, startColor.g, endColor.g)
      );
      var b = Math.floor(
        util.mapValueInRange(val, fromLow, fromHigh, startColor.b, endColor.b)
      );
      if (asRGB) {
        return 'rgb(' + r + ',' + g + ',' + b + ')';
      } else {
        return util.rgbToHex(r, g, b);
      }
    },

    degreesToRadians: function(deg) {
      return (deg * Math.PI) / 180;
    },

    radiansToDegrees: function(rad) {
      return (rad * 180) / Math.PI;
    }

  }

  util.extend(util, MathUtil);


  // Utilities
  // ---------
  // Here are a few useful JavaScript utilities.

  // Lop off the first occurence of the reference in the Array.
  function removeFirst(array, item) {
    var idx = array.indexOf(item);
    idx != -1 && array.splice(idx, 1);
  }

  var _onFrame;
  if (typeof window !== 'undefined') {
    _onFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  }
  if (!_onFrame && typeof process !== 'undefined' && process.title === 'node') {
    _onFrame = setImmediate;
  }

  // Cross browser/node timer functions.
  util.onFrame = function onFrame(func) {
    return _onFrame(func);
  };

  // Export the public api using exports for common js or the window for
  // normal browser inclusion.
  if (true) {
    util.extend(exports, rebound);
  } else if (typeof window != 'undefined') {
    window.rebound = rebound;
  }
})();


// Legal Stuff
// -----------
/**
 *  Copyright (c) 2013, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15), __webpack_require__(23).setImmediate))

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19), __webpack_require__(15)))

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(22);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (data) {
  return btoa(data.reduce(function (acc, curr) {
    return acc + String.fromCharCode(curr);
  }, ''));
};

/***/ })
/******/ ]);