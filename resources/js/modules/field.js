/**
 *
 * Copyright (c) 2020 Alexander Bazhanov
 * https://github.com/bazhanius/
 *
 */

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
        if (!cubeNumFrom) return;
        let cube = document.querySelector('.cube-' + cubeNumFrom.cubeNumber);
        this.matrix[ cubeNumTo.positionNumber-1 ].cubeNumber = cubeNumFrom.cubeNumber;
        this.matrix[ cubeNumFrom.positionNumber-1 ].cubeNumber = 0;

        cube.style.transform = "translateX(calc(var(--tile-width) * " + obj.toX + ")) translateY(calc(var(--tile-width) * " + obj.toY + "))";

        if (type === 'game') {
            counters.moves.add();
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
            gameState.theEnd();
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