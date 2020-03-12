function ready() {

    // Fill in field by cubes
    let field = [
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
    ];


    /**
     *  JS Fisher-Yates algorithm
     *  http://en.wikipedia.org/wiki/Fisher-Yates_shuffle#The_modern_algorithm
     */

    function shuffleArray(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

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

    btnStart.onclick = function() {

        cntdwn.style.display = 'flex';

        let interval = setInterval(function(){
            sortFieldInOrder('random');
        }, 3890);

        setTimeout(function(){
            clearInterval(interval);
            cntdwn.style.display = 'none';
        }, 4000);

    };

    btnShuffle.onclick = function() {
        sortFieldInOrder('random');
    };

    btnReset.onclick = function() {
        sortFieldInOrder('ascending');
    };

    //let tilesContainer = document.querySelector('.tiles-container');

    function sortFieldInOrder(type) {

        /*
        tilesContainer.classList.add('shake-effect');

        setTimeout(function(){
            tilesContainer.classList.remove('shake-effect');
        }, 2000);
        */

        if (type === 'ascending') {
            field[15].cubeNumber = 0;
            for (let i=1; i<16; i++) {
                field[i-1].cubeNumber = i;
                let cube = document.querySelector('.cube-' + i);
                cube.style.transform = "translate(" + (field[i-1].positionX * 5) + "vw, " + (field[i-1].positionY * 5) + "vw)";
            }
        }

        if (type === 'random') {
            /*
            let random = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].sort(function() {
            return .5 - Math.random();
            });
            */
            let random = shuffleArray([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
            for (let i=1; i<=16; i++) {
                field[i-1].cubeNumber = random[i-1];
                if (random[i-1] !== 0) {
                    let cube = document.querySelector('.cube-' + random[i-1]);
                    cube.style.transform = "translate(" + (field[i-1].positionX * 5) + "vw, " + (field[i-1].positionY * 5) + "vw)";
                }
            }
        }

    }

    let cubes = document.querySelectorAll('.cube');

    cubes.forEach((cube) => {
        cube.addEventListener("click", function() {
            let cubeNumber = parseInt( this.getElementsByClassName('front')[0].textContent );
            let cube = getCubeParametersByNumber(cubeNumber);
            let emptySpot = getCubeParametersByNumber(0);

            let diffX = cube.positionX - emptySpot.positionX;
            let diffY = cube.positionY - emptySpot.positionY;

            let r;

            if (diffX === -1 && diffY === 0) {
                //right
                r = getCubeMovableToDirection('right');
                moveCube(r);
            } else if (diffX === 0 && diffY === -1) {
                //down
                r = getCubeMovableToDirection('down');
                moveCube(r);
            } else if (diffX === 1 && diffY === 0) {
                //left
                r = getCubeMovableToDirection('left');
                moveCube(r);
            } else if (diffX === 0 && diffY === 1) {
                //up
                r = getCubeMovableToDirection('up');
                moveCube(r);
            }

        }, false);
    });

    function getCubeParametersByNumber(number) {
        return field.find(a => a.cubeNumber === number);
    }

    function getCubeParametersByPositionXY(x, y) {
        return field.filter(a => a.positionX === x).find(a => a.positionY === y);
    }

    function getCubeMovableToDirection(direction) {
        let emptySpot = getCubeParametersByNumber(0);
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
    }

    function moveCube(obj) {
        let cubeNumFrom = getCubeParametersByPositionXY(obj.fromX, obj.fromY);
        let cubeNumTo = getCubeParametersByPositionXY(obj.toX, obj.toY);
        let cube = document.querySelector('.cube-' + cubeNumFrom.cubeNumber);
        field[ cubeNumTo.positionNumber-1 ].cubeNumber = cubeNumFrom.cubeNumber;
        field[ cubeNumFrom.positionNumber-1 ].cubeNumber = 0;
        cube.style.transform = "translate(" + (obj.toX * 5) + "vw, " + (obj.toY * 5) + "vw)";
        checkCompletion();
    }

    function checkCompletion() {
        let reference = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0";
        let current = [];
        for(let item in field) {
            current.push(field[item].cubeNumber);
        }

        if (reference === current.toString()) {
            confetti.start(2000, 50, 150);
        }
    }

    window.onkeydown = function(event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }

        let r;

        switch (event.key) {
            case "Down": // IE/Edge specific value
            case "ArrowDown":
                console.log('Down Key pressed!');
                r = getCubeMovableToDirection('down');
                moveCube(r);
                break;
            case "Up": // IE/Edge specific value
            case "ArrowUp":
                console.log('Up Key pressed!');
                r = getCubeMovableToDirection('up');
                moveCube(r);
                break;
            case "Left": // IE/Edge specific value
            case "ArrowLeft":
                console.log('Left Key pressed!');
                r = getCubeMovableToDirection('left');
                moveCube(r);
                break;
            case "Right": // IE/Edge specific value
            case "ArrowRight":
                console.log('Right Key pressed!');
                r = getCubeMovableToDirection('right');
                moveCube(r);
                break;
            case "Enter":
                console.log('Enter Key pressed!');
                break;
            case "Esc": // IE/Edge specific value
            case "Escape":
                console.log('Escape Key pressed!');
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }
    }
}

document.addEventListener("DOMContentLoaded", ready);