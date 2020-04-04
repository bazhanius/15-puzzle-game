/**
 *
 * Copyright (c) 2020 Alexander Bazhanov
 * https://github.com/bazhanius/
 *
 */

let gameState;

function ready() {

    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        let vw = window.innerWidth * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.documentElement.style.setProperty('--vw', `${vw}px`);
    });


    let btnExit = document.querySelector('#exit');
    let btnStart = document.querySelector('#start');
    let btnMainMenu = document.querySelector('#main-menu');

    let gameMetrics = document.querySelector('.game-metrics');

    let btnClose = document.querySelector('.x-close');

    let countdownScreen = document.querySelector('.countdown');
    let mainScreen = document.querySelector('.main-menu-screen');

    let gameScreen = document.querySelector('.game-screen');

    let btnScores = document.querySelector('#scores');
    let scoresScreen = document.querySelector('.scores-screen');

    let transitionScreen = document.querySelector('.transition-screen');
    let transitionScreenRects = document.querySelectorAll('.rect');

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

            transitionScreenRects.forEach((x) => {
                x.classList.add('rect__fly-in');
            });

            setTimeout(function(){
                transitionScreenRects.forEach((x) => {
                    x.classList.remove('rect__fly-in');
                    x.classList.add('rect__fly-out');
                    if (type === 'toMainMenu') gameState.mainMenu();
                    if (type === 'toPlay') gameState.readyCheck();
                    if (type === 'toScores') gameState.scores();
                });
            }, 1500);

            setTimeout(function(){
                transitionScreenRects.forEach((x) => {
                    x.classList.remove('rect__fly-out');
                });
                transitionScreen.style.display = 'none';
            }, 3000);


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

        //setTimeout(function(){
        //    gameState.readyCheck();
        //}, 500);
    };
/*
    btnMainMenu.onclick = function() {
        gameState.transition('toMainMenu');
    };
*/
    btnScores.onclick = function() {
        gameState.transition('toScores');
    };

    btnClose.onclick = function() {
        gameState.transition('toMainMenu');
    };

    btnExit.onclick = function() {
        gameState.reset();
        //gameState.exit();
    };

    actions.keyEvents.init();
    actions.dragField.init();
    actions.clickOnCubes.init();
    gameState.mainMenu();
    counters.results.updateHTML('byMoves');

}

document.addEventListener("DOMContentLoaded", ready);