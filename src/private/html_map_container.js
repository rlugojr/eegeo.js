var HTMLMapContainer = function(browserDocument, browserWindow, parentElement, canvasId, canvasWidth, canvasHeight) {

    var _browserWindow = browserWindow;
    var _browserDocument = browserDocument;
    
    var _createDOMElement = function(parentElement, tagName, attributes, style) {
        var element = _browserDocument.createElement(tagName);
        for (var attributeName in attributes) {
            element.setAttribute(attributeName, attributes[attributeName]);
        }
        for (var styleProperty in style) {
            element.style[styleProperty] = style[styleProperty];
        }
        parentElement.appendChild(element);
        return element;
    };

    var _createMapContainer = function(parentElement) {
        var attributes = {
            "class": "eegeo-map-container",
            "id": "eegeo-map-container"
        };
        var style = {
            "position": "relative",
            "width": "100%",
            "height": "100%",
            "line-height": "0px",
            "padding": "0px",
            "margin": "0px",
            "overflow": "hidden"
        };
        var mapContainer = _createDOMElement(parentElement, "div", attributes, style);

        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = ".leaflet-dragging .eegeo-map-container { cursor: move; cursor: -webkit-grabbing; cursor: -moz-grabbing; }";
        document.head.appendChild(css);

        mapContainer.onmousedown = function(e) {
            // Prevent middle-mouse scrolling on Windows
            if (e.button === 1) {
                return false;
            }
        };

        // Fix for IE - onwheel is undefined, but is actually functional
        if (typeof mapContainer.onwheel === "undefined") {
            mapContainer.onwheel = null;
        }

        return mapContainer;
    };

    var _createLeafletOverlay = function(parentElement) {
        var attributes = {"class": "eegeo-leaflet-overlay"};
        var style = {
            "position": "absolute",
            "overflow": "hidden",
            "width": "100%",
            "height": "100%",
            "background": "transparent",
            "pointer-events": "none"
        };
        return _createDOMElement(parentElement, "div", attributes, style);
    };

    var _createErrorMessage = function(parentElement, messageText) {
        var attributes = {"class": "eegeo-error-message"};
        var style = {
            "position": "absolute",
            "left": "0px",
            "bottom": "0px",
            "line-height": "normal",
            "color": "white",
            "font-family": "sans-serif",
            "font-weight": "bold",
            "margin": "0.5em"
        };
        var errorMessage = _createDOMElement(parentElement, "div", attributes, style);
        errorMessage.textContent = messageText;
        return errorMessage;
    };

    var _createCanvas = function(parentElement, canvasId, width, height) {
        var attributes = {
            "class": "eegeo-map-canvas",
            "id": canvasId,
            "oncontextmenu": "event.preventDefault();",
            "width": width.toString(),
            "height": height.toString()
        };
        var style = {
            "background-color": "black"
        };
        var canvas = _createDOMElement(parentElement, "canvas", attributes, style);

        return canvas;
    };

    var _createLoadingSpinner = function(parentElement) {
        var style = {
            "position": "absolute",
            "width": "18px",
            "height": "18px",
            "z-index": "20",
            "background-image": "url('https://cdn-webgl.eegeo.com/eegeojs/resources/loading_spinner.png')"
        };
        return _createDOMElement(parentElement, "div", {}, style);
    };

    var _createIndoorMapWatermark = function(parentElement) {
        var attributes = {
            "id": "eegeo-indoor-map-watermark",
            "draggable": "false"
        };

        var style = {
            "position": "absolute",
            "z-index": "20",
            "display": "block",
            "margin": "auto auto 0 auto",
            "left": "0",
            "right": "0",
            "bottom": "-50px",
            "transition": "all 500ms"
        };

        return _createDOMElement(parentElement, "img", attributes, style);
    };

    this.mapContainer = _createMapContainer(parentElement);
    this.loadingSpinnerIcon = _createLoadingSpinner(this.mapContainer);
    this.overlay = _createLeafletOverlay(this.mapContainer);
    this.indoorMapWatermark = _createIndoorMapWatermark(this.mapContainer);
    this.canvas = _createCanvas(this.mapContainer, canvasId, canvasWidth, canvasHeight);

    this.loadingSpinner = new LoadingSpinner(_browserWindow, this.loadingSpinnerIcon);
    this.loadingSpinner.startSpinning();

    this.onInitialized = function() {
        this.loadingSpinner.stopSpinning();
        this.loadingSpinnerIcon.parentNode.removeChild(this.loadingSpinnerIcon);
    };

    this.onError = function(message) {
        this.loadingSpinner.stopSpinning();
        _createErrorMessage(this.mapContainer, message);
    };

    this.width = function() {
        return this.mapContainer.clientWidth;
    };

    this.height = function() {
        return this.mapContainer.clientHeight;
    };
};

var LoadingSpinner = function(browserWindow, domElement) {
    var _browserWindow = browserWindow;
    var _domElement = domElement;
    var _speed = 360;
    var _spinning = false;

    var spin = function(timestamp) {
        if (!_spinning) {
            return;
        }
        var timeInSeconds = (timestamp || 0) / 1000;
        var degrees = (timeInSeconds * _speed) % 360;
        _domElement.style["transform"] = "rotate(" + degrees + "deg)";
        _browserWindow.requestAnimationFrame(spin);
    };

    this.startSpinning = function() {
        _spinning = true;
        spin();
    };

    this.stopSpinning = function() {
        _spinning = false;
    };
};

module.exports = HTMLMapContainer;