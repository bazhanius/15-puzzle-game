function ready() {

    let field = {
        matrix: [
            // First row
            {'positionNumber':  1, 'cubeNumber':  1, 'positionX': 0, 'positionY': 0},
            {'positionNumber':  2, 'cubeNumber':  2, 'positionX': 1, 'positionY': 0},
            {'positionNumber':  3, 'cubeNumber':  3, 'positionX': 2, 'positionY': 0},
            {'positionNumber':  4, 'cubeNumber':  4, 'positionX': 3, 'positionY': 0},
            // Second row
            {'positionNumber':  5, 'cubeNumber':  5, 'positionX': 0, 'positionY': 1},
            {'positionNumber':  6, 'cubeNumber':  6, 'positionX': 1, 'positionY': 1},
            {'positionNumber':  7, 'cubeNumber':  7, 'positionX': 2, 'positionY': 1},
            {'positionNumber':  8, 'cubeNumber':  8, 'positionX': 3, 'positionY': 1},
            // Third row
            {'positionNumber':  9, 'cubeNumber':  9, 'positionX': 0, 'positionY': 2},
            {'positionNumber': 10, 'cubeNumber': 10, 'positionX': 1, 'positionY': 2},
            {'positionNumber': 11, 'cubeNumber': 11, 'positionX': 2, 'positionY': 2},
            {'positionNumber': 12, 'cubeNumber': 12, 'positionX': 3, 'positionY': 2},
            // Fourth row
            {'positionNumber': 13, 'cubeNumber': 13, 'positionX': 0, 'positionY': 3},
            {'positionNumber': 14, 'cubeNumber': 14, 'positionX': 1, 'positionY': 3},
            {'positionNumber': 15, 'cubeNumber': 15, 'positionX': 2, 'positionY': 3},
            {'positionNumber': 16, 'cubeNumber':  0, 'positionX': 3, 'positionY': 3}
        ],

        getCubeParametersByNumber(number) {
            return this.matrix.find(a => a.cubeNumber === number);
        },

        getCubeParametersByPositionXY(x, y) {
            return this.matrix.filter(a => a.positionX === x).find(a => a.positionY === y);
        },

        getCubeMovableToDirection(direction) {
            let emptySpot = this.getCubeParametersByNumber(0);
            let cubeXY = {
                'fromX': emptySpot.positionX,
                'fromY': emptySpot.positionY,
                'toX': emptySpot.positionX,
                'toY': emptySpot.positionY
            };
            switch (direction) {
                case "right":
                    cubeXY.fromX = (emptySpot.positionX - 1) >= 0 ? (emptySpot.positionX - 1) : null;
                    break;
                case "left":
                    cubeXY.fromX = (emptySpot.positionX + 1) <= 3 ? (emptySpot.positionX + 1) : null;
                    break;
                case "up":
                    cubeXY.fromY = (emptySpot.positionY + 1) <= 3 ? (emptySpot.positionY + 1) : null;
                    break;
                case "down":
                    cubeXY.fromY = (emptySpot.positionY - 1) >= 0 ? (emptySpot.positionY - 1) : null;
                    break;
                default:
                    return;
            }
            return cubeXY;
        },

        moveCube(obj, type = 'game') {
            let cubeNumFrom = this.getCubeParametersByPositionXY(obj.fromX, obj.fromY);
            let cubeNumTo = this.getCubeParametersByPositionXY(obj.toX, obj.toY);
            let cube = document.querySelector('.cube-' + cubeNumFrom.cubeNumber);
            this.matrix[ cubeNumTo.positionNumber-1 ].cubeNumber = cubeNumFrom.cubeNumber;
            this.matrix[ cubeNumFrom.positionNumber-1 ].cubeNumber = 0;

            cube.style.transform = "translateX(calc(var(--tile-width) * " + obj.toX + ")) translateY(calc(var(--tile-width) * " + obj.toY + "))";

            if (type === 'game') {
                movesCounter.add();
                this.checkCompletion();
            }
        },

        checkCompletion() {
            let reference = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0";
            let current = [];
            for (let item in this.matrix) {
                current.push(this.matrix[item].cubeNumber);
            }
            if (reference === current.toString()) {
                confetti.start(2000, 50, 150);
                mainMenu.style.display = 'flex';
                movesCounter.reset();
                secondsCounter.stop();
            }
        },

        reset() {
            this.matrix[15].cubeNumber = 0;
            for (let i=1; i<16; i++) {
                this.matrix[i-1].cubeNumber = i;
                let cube = document.querySelector('.cube-' + i);

                cube.style.transform  = "translateX(calc(var(--tile-width) * " + this.matrix[i-1].positionX + ")) translateY(calc(var(--tile-width) * " + this.matrix[i-1].positionY + "))";
            }
        },

        shuffle(iterations = 200) {
            let k = 0;
            do {
                let movableCubes = [];
                let r = this.getCubeMovableToDirection('right');
                if (r.fromX !== null && r.fromY !== null) movableCubes.push(r);
                let l = this.getCubeMovableToDirection('left');
                if (l.fromX !== null && l.fromY !== null) movableCubes.push(l);
                let u = this.getCubeMovableToDirection('up');
                if (u.fromX !== null && u.fromY !== null) movableCubes.push(u);
                let d = this.getCubeMovableToDirection('down');
                if (d.fromX !== null && d.fromY !== null) movableCubes.push(d);
                let selectedCube = movableCubes[Math.floor(Math.random() * movableCubes.length)];
                this.moveCube(selectedCube, 'silent');
                k++;
            } while (k < iterations)
        }
    };

    let btnRandomMove = document.querySelector('#random-move');

    btnRandomMove.onclick = function() {
        field.shuffle(1);
    };

    let btnShuffle = document.querySelector('#shuffle');
    let btnReset = document.querySelector('#reset');
    let btnStart = document.querySelector('#start');

    let btnStartConfetti = document.querySelector('#startConfetti');
    let btnStopConfetti = document.querySelector('#stopConfetti');

    btnStartConfetti.onclick = function() {
        confetti.start();
    };

    btnStopConfetti.onclick = function() {
        confetti.stop();
    };

    let cntdwn = document.querySelector('.countdown');
    let mainMenu = document.querySelector('.main-menu-screen');

    btnStart.onclick = function() {

        mainMenu.style.display = 'none';
        cntdwn.style.display = 'flex';

        let interval = setInterval(function(){
            field.shuffle();
        }, 3890);

        setTimeout(function(){
            clearInterval(interval);
            cntdwn.style.display = 'none';
            secondsCounter.start();
            movesCounter.reset();
        }, 4000);

    };

    btnShuffle.onclick = function() {
        field.shuffle();
    };

    btnReset.onclick = function() {
        field.reset();
        secondsCounter.stop();
        movesCounter.reset();
    };



    let cubes = document.querySelectorAll('.cube');

    function clickCube() {
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

    cubes.forEach((cube) => {
        cube.addEventListener('click', clickCube, false);

    });

    function pressArrows(event) {
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

    window.addEventListener('keydown', pressArrows, false);
    //window.removeEventListener('keydown', pressArrows, false);

    let gameTimer = document.querySelector('.game-time');
    let secondsCounter = {
        seconds: 0,
        interval: null,
        getTime() {
            let t = this.seconds;
            let seconds = Math.floor(t % 60);
            seconds = seconds < 10 ? "0" + seconds : "" + seconds;
            let minutes = Math.floor(t / 60);
            minutes = minutes < 10 ? "0" + minutes : "" + minutes;
            return (minutes + ":" + seconds);
        },
        start() {
            if (this.interval) clearInterval(this.interval);
            this.seconds = 0;
            this.updateHTML('00:00');
            this.interval = setInterval(function() {
                secondsCounter.seconds += 1;
                secondsCounter.updateHTML(secondsCounter.getTime());
            }, 1000)
        },
        stop() {
            this.seconds = 0;
            this.updateHTML('00:00');
            clearInterval(this.interval);
        },
        updateHTML(text) {
            gameTimer.textContent = text;
        }
    };


    let gameMoves = document.querySelector('.game-moves');
    let movesCounter = {
        moves: 0,
        add() {
            this.moves++;
            this.updateHTML();
        },
        reset() {
            this.moves = 0;
            this.updateHTML();
        },
        updateHTML() {
            gameMoves.textContent = this.moves > 9999 ? "9999+" : this.moves;
        }
    };



}

document.addEventListener("DOMContentLoaded", ready);