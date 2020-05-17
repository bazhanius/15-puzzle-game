/**
 *
 * Copyright (c) 2020 Alexander Bazhanov
 * https://github.com/bazhanius/
 *
 */

let actions = {
    keyEvents: {
        init() {
            window.addEventListener('keydown', actions.keyEvents.commands, false);
        },
        destroy() {
            window.removeEventListener('keydown', actions.keyEvents.commands, false);
        },
        commands(event) {
            // Do nothing if the event was already processed
            if (event.defaultPrevented) return;

            let r;
            switch (event.key) {
                case "Down": // IE/Edge specific value
                case "ArrowDown":
                    // Down Key pressed
                    r = field.getCubeMovableToDirection('down');
                    field.moveCube(r);
                    break;
                case "Up": // IE/Edge specific value
                case "ArrowUp":
                    // Up Key pressed
                    r = field.getCubeMovableToDirection('up');
                    field.moveCube(r);
                    break;
                case "Left": // IE/Edge specific value
                case "ArrowLeft":
                    // Left Key pressed
                    r = field.getCubeMovableToDirection('left');
                    field.moveCube(r);
                    break;
                case "Right": // IE/Edge specific value
                case "ArrowRight":
                    // Right Key pressed
                    r = field.getCubeMovableToDirection('right');
                    field.moveCube(r);
                    break;
                case "Enter":
                    // Enter Key pressed
                    break;
                case "Esc": // IE/Edge specific value
                case "Escape":
                    // Escape Key pressed
                    break;
                default:
                    return; // Quit when this doesn't handle the key event.
            }
        }
    },
    clickOnCubes: {
        htmlObj: undefined,
        clickType: (window.PointerEvent) ? 'pointerdown' : (
            (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
            ? 'touchstart'
            : 'click'
        ),
        init() {
            if (!this.htmlObj) this.htmlObj = document.querySelectorAll('.cube');

            this.htmlObj.forEach((cube) => {
                cube.addEventListener(actions.clickOnCubes.clickType, actions.clickOnCubes.commands, false);
            });
        },
        destroy() {
            if (!this.htmlObj) return;
            this.htmlObj.forEach((cube) => {
                cube.removeEventListener(actions.clickOnCubes.clickType, actions.clickOnCubes.commands, false);
            });
        },
        commands(event) {
            if (event.defaultPrevented) return;
            let cubeNumber = parseInt( this.getElementsByClassName('front')[0].textContent );
            let cube = field.getCubeParametersByNumber(cubeNumber);
            let emptySpot = field.getCubeParametersByNumber(0);

            let diffX = cube.positionX - emptySpot.positionX;
            let diffY = cube.positionY - emptySpot.positionY;

            let r;

            if (diffX === -1 && diffY === 0) {
                //right
                r = field.getCubeMovableToDirection('right');
                field.moveCube(r);
            } else if (diffX === 0 && diffY === -1) {
                //down
                r = field.getCubeMovableToDirection('down');
                field.moveCube(r);
            } else if (diffX === 1 && diffY === 0) {
                //left
                r = field.getCubeMovableToDirection('left');
                field.moveCube(r);
            } else if (diffX === 0 && diffY === 1) {
                //up
                r = field.getCubeMovableToDirection('up');
                field.moveCube(r);
            }
        }
    },
    dragField: {
        htmlObj: undefined,
        lastMouseX: 0,
        lastMouseY: 0,
        rotX: 0,
        rotY: 0,
        init() {
            if (!this.htmlObj) this.htmlObj = document.querySelector('.tiles-container');

            this.htmlObj.addEventListener('mousedown', e => {
                e.preventDefault();
                actions.dragField.mouseDragging.set(true);
                actions.dragField.lastMouseX = e.clientX;
                actions.dragField.lastMouseY = e.clientY;
                actions.dragField.htmlObj.addEventListener('mousemove', actions.dragField.mouseMoved, false);
            }, false);

            this.htmlObj.addEventListener('mouseup', e => {
                e.preventDefault();
                actions.dragField.mouseDragging.set(false);
                actions.dragField.htmlObj.removeEventListener('mousemove', actions.dragField.mouseMoved, false);
            });

            this.htmlObj.addEventListener('mouseleave', e => {
                e.preventDefault();
                actions.dragField.mouseDragging.set(false);
                actions.dragField.htmlObj.removeEventListener('mousemove', actions.dragField.mouseMoved, false);
            });
        },
        mouseDragging: {
            value: false,
            set(value) {
                if (this.value !== value) {
                    actions.dragField.htmlObj.classList.toggle("grabbing-cursor");
                    actions.clickOnCubes.htmlObj.forEach((cube) => {
                        cube.classList.toggle("pointer-cursor");
                    });
                    this.value = value;
                }
            }
        },
        mouseMoved(ev) {

            if (ev.defaultPrevented) return;

            let deltaX = ev.pageX - actions.dragField.lastMouseX;
            let deltaY = ev.pageY - actions.dragField.lastMouseY;

            actions.dragField.lastMouseX = ev.pageX;
            actions.dragField.lastMouseY = ev.pageY;

            actions.dragField.rotY += deltaX * 0.3;
            actions.dragField.rotX -= deltaY * 0.3;

            actions.dragField.htmlObj.style.transform = `rotateY(${actions.dragField.rotY}deg) rotateX(${actions.dragField.rotX}deg)`;
        }
    }
};