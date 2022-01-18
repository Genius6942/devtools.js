(function () {
	function createElemntDesc(element) {
		const style = window.getComputedStyle(element);
		const outer = document.createElement('div');
		outer.className = 'desc-outer';
		outer.innerHTML = `
		<style>
			div.desc-outer {
				padding: 10px;
				position: relative;
				display: inline-block;
				font-family: monospace;
				font-size: 15px;
				box-shadow: 0 25px 50px -12px rgb(0 0 0 / .6);
				border-radius: 10px;
				color: #808080;
				background-color: white;
				max-width: 300px;
			}

			div.desc-outer::after {
				content: '';
				position: absolute;
				top: 100%;
				left: 50%;
				transform: translateX(-50%);
				border: 10px solid transparent;
				border-top: 10px solid white;
			}

			div.desc-outer span.el-outer {
				white-space: nowrap;
				display: flex;
			}

			div.desc-outer span.el-outer span.el {
				color: blueviolet;
			}

			div.desc-outer span.el-outer span.class {
				color: blue;
			}

			div.desc-outer span.el-outer span.size {
				color: grey;
				margin-left: 10px;
				float: right;
			}

			div.desc-outer div.font {
				white-space: nowrap;
				display: flex;
			}

			div.desc-outer div.font :nth-child(1) {
				margin-right: 10px;
			} 

			div.desc-outer div.font span.value {
				margin-left: auto;
				overflow: hidden;
				word-spacing: -6px;
				white-space: nowrap;
				text-overflow: ellipsis;
				max-width: inherit;
				text-align: right;
			}

			div.desc-outer div.color {
				display: flex;
				align-items: center;
			}

			div.desc-outer div.color :first-child {
				margin-right: 10px;
			}

			div.desc-outer div.color span.value {
				margin-left: 10px;
				white-space: nowrap;
			}

			div.desc-outer div.color span.square {
				margin-left: auto;
				display: inline-block;
				width: 15px;
				height: 15px;
				background-color: blue;
				border: 1px solid black;
			}
		</style>
		<span class= "el-outer" >
			<span class = 'el'>${element.tagName.toLowerCase()}</span><span class = 'class'>${ element.id }</span><span class="class">${ '.' + [...element.classList].join('.') }</span>
			<span class = "size">
				${ element.offsetWidth }x${ element.offsetHeight }
			</span>
		</span>
		<div class = "color">
			<span>Color</span><span class = 'square' style = "background-color: ${ style.color }"></span><span class = 'value'>${ style.color }</span>
		</div>
		<div class = 'font'>
			<span>Font</span><span class = 'value'>${ style.font }</span>
		</div>`;
		return outer;
	}

	class ElementPicker {
		constructor(options) {
			// MUST create hover box first before applying options
			this.hoverBox = document.createElement("div");
			this.hoverBox.style.position = "absolute";
			this.hoverBox.style.pointerEvents = "none";
			this.hoverBox.style.zIndex = '99999999'

			this.descBox = document.createElement('div');
			this.hoverBox.appendChild(document.createElement('div').appendChild(this.descBox));

			this.hoverBox.appendChild(this.descBox);
			this.hoverBox.firstElementChild.style.position = 'relative';

			this.descBox.style.cssText = `
				bottom: calc(100% + 10px);
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
			`;

			const defaultOptions = {
				container: document.documentElement,
				selectors: "*", // default to pick all elements
				background: "rgba(153, 235, 255, 0.5)", // transparent light blue
				borderWidth: 0,
				transition: "", // set to "" (empty string) to disable
				ignoreElements: [document.documentElement],
				action: {},
			}
			const mergedOptions = {
				...defaultOptions,
				...options
			};
			Object.keys(mergedOptions).forEach((key) => {
				this[key] = mergedOptions[key];
			});

			this._detectMouseMove = (e) => {
				this._previousEvent = e;
				let target = e.target;
				// console.log("TCL: ElementPicker -> this._moveHoverBox -> target", target)
				if (this.ignoreElements.indexOf(target) === -1 && target.matches(this.selectors) &&
					this.container.contains(target) ||
					target === this.hoverBox) { // is NOT ignored elements
					// console.log("TCL: target", target);
					if (target === this.hoverBox) {
						// the truely hovered element behind the added hover box
						const hoveredElement = document.elementsFromPoint(e.clientX, e.clientY)[1];
						// console.log("screenX: " + e.screenX);
						// console.log("screenY: " + e.screenY);
						// console.log("TCL: hoveredElement", hoveredElement);
						if (this._previousTarget === hoveredElement) {
							// avoid repeated calculation and rendering
							return;
						} else {
							target = hoveredElement;
						}
					} else {
						this._previousTarget = target;
					}
					const targetOffset = target.getBoundingClientRect();
					const targetHeight = targetOffset.height;
					const targetWidth = targetOffset.width;

					this.hoverBox.style.width = targetWidth + this.borderWidth * 2 + "px";
					this.hoverBox.style.height = targetHeight + this.borderWidth * 2 + "px";
					// need scrollX and scrollY to account for scrolling
					this.hoverBox.style.top = targetOffset.top + window.scrollY - this.borderWidth + "px";
					this.hoverBox.style.left = targetOffset.left + window.scrollX - this.borderWidth + "px";
					if (this._triggered && this.action.callback) {
						this.action.callback(target);
						this._triggered = false;
					}

					while (this.descBox.firstChild) {
						this.descBox.removeChild(this.descBox.firstChild);
					}
					this.descBox.appendChild(createElemntDesc(target));
				} else {
					// console.log("hiding hover box...");
					this.hoverBox.style.width = 0;
				}
			};
			document.addEventListener("mousemove", this._detectMouseMove);
		}
		get container() {
			return this._container;
		}
		set container(value) {
			if (value instanceof HTMLElement) {
				this._container = value;
				this.container.appendChild(this.hoverBox);
			} else {
				throw new Error("Please specify an HTMLElement as container!");
			}
		}
		get background() {
			return this._background;
		}
		set background(value) {
			this._background = value;

			this.hoverBox.style.background = this.background;
		}
		get transition() {
			return this._transition;
		}
		set transition(value) {
			this._transition = value;

			this.hoverBox.style.transition = this.transition;
		}
		get borderWidth() {
			return this._borderWidth;
		}
		set borderWidth(value) {
			this._borderWidth = value;

			this._redetectMouseMove();
		}
		get selectors() {
			return this._selectors;
		}
		set selectors(value) {
			this._selectors = value;

			this._redetectMouseMove();
		}
		get ignoreElements() {
			return this._ignoreElements;
		}
		set ignoreElements(value) {
			this._ignoreElements = value;

			this._redetectMouseMove();
		}
		get action() {
			return this._action;
		}
		set action(value) {
			if (value instanceof Object) {
				if (typeof value.trigger === "string" &&
					typeof value.callback === "function") {
					if (this._triggerListener) {
						document.removeEventListener(this.action.trigger, this._triggerListener);
						this._triggered = false;
					}
					this._action = value;

					this._triggerListener = () => {
						this._triggered = true;
						this._redetectMouseMove();
					}
					document.addEventListener(this.action.trigger, this._triggerListener);
				} else if (value.trigger !== undefined || value.callback !== undefined){ // allow empty action object
					throw new Error("action must include two keys: trigger (String) and callback (function)!");
				}
			} else {
				throw new Error("action must be an object!");
			}
		}
		close() {
			this.hoverBox.remove()
		}        
		_redetectMouseMove() {
			if (this._detectMouseMove && this._previousEvent) {
				this._detectMouseMove(this._previousEvent);
			}
		}
	}
	// export module
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = ElementPicker;
	} else {
		window.ElementPicker = ElementPicker;
	}
})();
