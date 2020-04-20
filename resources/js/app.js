/**
 *
 * Copyright (c) 2020 Alexander Bazhanov
 * https://github.com/bazhanius/
 *
 */

let gameState;

function ready() {

    let buttonClicks = document.querySelectorAll('.game-menu-option');
    buttonClicks.forEach( (x) => {
        x.addEventListener("click", function(e) {
            document.documentElement.style.setProperty('--clickX', `${e.clientX}px`);
            document.documentElement.style.setProperty('--clickY', `${e.clientY}px`);
        });
    });

    function resizeWindow() {
        document.documentElement.style.setProperty('height', `${window.innerHeight}px`);
        document.documentElement.style.setProperty('width', `${window.innerWidth}px`);
    }

    // We listen to the resize event
    window.addEventListener('resize', () => {
        resizeWindow();
    });

    resizeWindow();

    let btnStart = document.querySelector('#start');

    let gameMetrics = document.querySelector('.game-metrics');

    let btnClose = document.querySelector('.x-close');

    let countdownScreen = document.querySelector('.countdown');
    let mainScreen = document.querySelector('.main-menu-screen');

    let gameScreen = document.querySelector('.game-screen');

    let btnScores = document.querySelector('#scores');
    let scoresScreen = document.querySelector('.scores-screen');

    let transitionScreen = document.querySelector('.transition-screen');
    let transitionScreenCircle = document.querySelector('.circle');

    let resultScreen = document.querySelector('.result-screen');

    gameState = {
        interval: null,
        mainMenu() {
            clearInterval(gameState.interval);
            mainScreen.style.display = 'flex';
            gameScreen.style.display = 'flex';
            resultScreen.style.display = 'none';
            countdownScreen.style.display = 'none';
            resultScreen.style.display = 'none';
            scoresScreen.style.display = 'none';
            btnClose.style.display = 'none';
            gameMetrics.classList.add('hidden');
            gameState.interval = setInterval(function() {
                field.shuffle(1);
            }, 2000)
        },
        readyCheck() {
            clearInterval(gameState.interval);
            mainScreen.style.display = 'none';
            countdownScreen.style.display = 'flex';

            gameState.interval = setInterval(function(){
                field.shuffle();
            }, 3890);

            setTimeout(function(){
                clearInterval(gameState.interval);
                gameState.play();
                counters.seconds.start();
                counters.moves.reset();
            }, 4000);

        },
        play() {
            clearInterval(this.interval);
            btnClose.style.display = 'block';
            gameMetrics.classList.remove('hidden');
            mainScreen.style.display = 'none';
            countdownScreen.style.display = 'none';
        },
        theEnd() {
            let moves = counters.moves.value;
            let time = counters.seconds.getTime();
            counters.results.add('Sasha', moves, time);
            //console.log(counters.results.getList('byMoves'));

            confetti.start(2000, 100, 150);
            resultScreen.style.display = 'flex';

            //counters.moves.reset();
            counters.seconds.stop();

            if (moves === 80) {
                // title: God's number!
                // text: {moves} moves is the best possible solution!
            } else if (moves <= 100) {
                // title: Great!
                // text: {moves}!
            } else {
                // title: Good!
                // text: {moves}!
            }
        },
        transition(type) {
            transitionScreen.style.display = 'flex';

            transitionScreenCircle.classList.add('circle__fly-in');

            setTimeout(function(){
                transitionScreenCircle.classList.remove('circle__fly-in');
                transitionScreenCircle.classList.add('circle__fly-out');
                if (type === 'toMainMenu') gameState.mainMenu();
                if (type === 'toPlay') gameState.readyCheck();
                if (type === 'toScores') gameState.scores();
            }, 750);

            setTimeout(function(){
                transitionScreenCircle.classList.remove('circle__fly-out');
                transitionScreen.style.display = 'none';
            }, 1500);


        },
        reset() {
            field.reset();
            counters.seconds.stop();
            counters.moves.reset();
        },
        scores() {
            btnClose.style.display = 'block';
            scoresScreen.style.display = 'flex';
            gameScreen.style.display = 'none';
            mainScreen.style.display = 'none';
        },
        about() {
            //
        }
    };


    btnStart.onclick = function() {
        gameState.transition('toPlay');
    };

    btnScores.onclick = function() {
        gameState.transition('toScores');
    };

    btnClose.onclick = function() {
        gameState.transition('toMainMenu');
    };

    actions.keyEvents.init();
    actions.dragField.init();
    actions.clickOnCubes.init();
    gameState.mainMenu();
    counters.results.updateHTML('byMoves');

}

document.addEventListener("DOMContentLoaded", ready);