"use strict";

namespace EFOLAB_MASQURADE {

	class Elm {
		private elm: HTMLElement
		constructor(element: string) {
			this.elm = document.createElement(element);
		}
		set(element: HTMLElement) {
			element.appendChild(this.elm);
		}
		setText(text: string) {
			this.elm.innerHTML = text;
		}
		setEvent(type: string, destination: EventListenerObject) {
			this.elm.addEventListener(type, destination, false);
		}
	}
	class EventEmulator {
		private caller: any
		private elm: any
		private start: any
		private deltaX: number
		private deltaY: number
		private deltaTime
		private isScrolling: any
		private flicked: boolean
		constructor(target: any, caller: Object) {
			this.elm = target;
			this.caller = caller;

			target.addEventListener('touchstart', this, false);
			target.addEventListener('touchmove', this, false);
			target.addEventListener('touchend', this, false);

		}
		handleEvent(event) {
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
			} catch (e) {

			}
		}
	}
	class Main {
		private p;
		constructor() {
			this.startup();

		}
		startup() {
			console.log("start");
			var elm = new Elm("h2");
			elm.setText("moga");
			elm.set(document.body);
			elm.setEvent("click", this);

			var ee = new EventEmulator(document, this);

		}
		handleEvent(event: Event) {
			switch (event.type) {
				case "flick":
					//フリック時のプログラム記述部
					console.log(event.type);
					break;
			}
		}
	}


	document.addEventListener('DOMContentLoaded', function() { new Main() }, false);
}