"use strict";
var EFOLAB_MASQURADE;
(function (EFOLAB_MASQURADE) {
    var Elm = (function () {
        function Elm(element) {
            this.elm = document.createElement(element);
        }
        Elm.prototype.set = function (element) {
            element.appendChild(this.elm);
        };
        Elm.prototype.setText = function (text) {
            this.elm.innerHTML = text;
        };
        Elm.prototype.setEvent = function (type, destination) {
            this.elm.addEventListener(type, destination, false);
        };
        return Elm;
    })();
    var EventEmulator = (function () {
        function EventEmulator(target, caller) {
            this.elm = target;
            this.caller = caller;
            target.addEventListener('touchstart', this, false);
            target.addEventListener('touchmove', this, false);
            target.addEventListener('touchend', this, false);
        }
        EventEmulator.prototype.handleEvent = function (event) {
            try {
                switch (event.type) {
                    case "touchstart":
                        this.start = {
                            pageX: event.touches[0].pageX,
                            pageY: event.touches[0].pageY,
                            time: Number(new Date())
                        };
                        //onTouchMoveで利用するための初期化設定です。
                        this.isScrolling = 'undefined';
                        break;
                    case "touchmove":
                        // タッチが１本のときだけ実行します。
                        if (event.touches.length > 1 || event.scale && event.scale !== 1) {
                            return;
                        }
                        this.deltaX = event.changedTouches[0].pageX - this.start.pageX;
                        this.deltaY = event.changedTouches[0].pageY - this.start.pageY;
                        this.deltaTime = Number(new Date()) - this.start.time;
                        //スクロールかどうかの判定です。スクロールイベントは連続して発生するため、
                        //onTouchStart-onTouchMove-onTouchEndの一連の動作の中で、最初に一度だけテストします。
                        if (typeof this.isScrolling === 'undefined') {
                            this.isScrolling = !!(this.isScrolling || Math.abs(this.deltaX) < Math.abs(this.deltaY));
                        }
                        if (Math.abs(this.deltaX) > 100 && this.deltaTime < 500) {
                            //Flickイベントを発生させる
                            //一度だけ
                            if (this.flicked) {
                                return;
                            }
                            var flickEvent = document.createEvent("HTMLEvents");
                            flickEvent.initEvent("flick", true, false);
                            document.addEventListener("flick", this.caller, false);
                            document.dispatchEvent(flickEvent);
                            this.flicked = true;
                        }
                        break;
                    case "touchend":
                        this.flicked = false;
                        break;
                }
            }
            catch (e) {
            }
        };
        return EventEmulator;
    })();
    var dispatcher = (function () {
        function dispatcher(newType, node, dest) {
            var newEvent = document.createElement("Event");
            newEvent.initEvent(newType, true, true);
            node.addEventListener(newType, dest, false);
            node.dispatchEvent(newEvent);
        }
        return dispatcher;
    })();
    var Main = (function () {
        function Main() {
            this.startup();
        }
        Main.prototype.startup = function () {
            console.log("start");
            var elm = new Elm("h2");
            elm.setText("moga");
            elm.set(document.body);
            elm.setEvent("click", this);
            var ee = new EventEmulator(document, this);
        };
        Main.prototype.handleEvent = function (event) {
            switch (event.type) {
                case "flick":
                    //フリック時のプログラム記述部
                    console.log(event.type);
                    break;
            }
        };
        return Main;
    })();
    document.addEventListener('DOMContentLoaded', function () { new Main(); }, false);
})(EFOLAB_MASQURADE || (EFOLAB_MASQURADE = {}));
