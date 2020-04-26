/**
 *
 * Copyright (c) 2020 Alexander Bazhanov
 * https://github.com/bazhanius/
 *
 */

let counters = {

    seconds: {
        value: 0,
        htmlObj: undefined,
        interval: null,
        getTime() {
            let t = this.value;
            let seconds = Math.floor(t % 60);
            seconds = seconds < 10 ? "0" + seconds : "" + seconds;
            let minutes = Math.floor(t / 60);
            minutes = minutes < 10 ? "0" + minutes : "" + minutes;
            return (minutes + ":" + seconds);
        },
        start() {
            if (this.interval) clearInterval(this.interval);
            this.value = 0;
            this.updateHTML('00:00');
            this.interval = setInterval(function() {
                counters.seconds.value++;
                counters.seconds.updateHTML(counters.seconds.getTime());
            }, 1000)
        },
        stop() {
            //this.value = 0;
            //this.updateHTML('00:00');
            clearInterval(this.interval);
        },
        updateHTML(text) {
            if (!this.htmlObj) this.htmlObj = document.querySelector('.game-time');
            this.htmlObj.textContent = text;
        }
    },

    moves: {
        value: 0,
        htmlObj: undefined,
        add() {
            this.value++;
            this.updateHTML();
        },
        reset() {
            this.value = 0;
            this.updateHTML();
        },
        updateHTML() {
            if (!this.htmlObj) this.htmlObj = document.querySelector('.game-moves');
            this.htmlObj.textContent = this.value > 9999 ? "9999+" : this.value;
        }
    },

    results: {
        list: JSON.parse(localStorage.getItem('scoresList')) || [],
        htmlObj: undefined,
        add(nick, moves, time) {
            if (!nick) nick = 'Anonymous';
            counters.results.list.push({
                nickname: nick,
                moves: moves,
                time: time
            });
            localStorage.setItem('scoresList', JSON.stringify(counters.results.list));
            counters.results.updateHTML('byMoves');
        },
        clearAll() {
            counters.results.list = [];
            localStorage.clear();
        },
        updateHTML(type) {
            if (!this.htmlObj) this.htmlObj = document.querySelector('.high-scores');

            if (this.list.length) {
                if (type === 'byMoves') {
                    counters.results.htmlObj.innerHTML = '';
                    counters.results.list = counters.results.list.sort((a, b) =>
                        parseFloat(a.moves) - parseFloat(b.moves)
                    );
                    counters.results.list.forEach((el, i) => {
                        counters.results.htmlObj.innerHTML += '<tr>' +
                            '<td>' + (i+1) + '</td>' +
                            '<td>' + el.nickname + '</td>' +
                            '<td>' + el.moves + '</td>' +
                            '<td>' + el.time + '</td>' +
                            '</tr>';
                    })
                }
                if (type === 'byTime') {
                    counters.results.list = counters.results.list.sort((a, b) =>
                        parseFloat(a.time) - parseFloat(b.time)
                    );
                }
            } else {
                counters.results.htmlObj.innerHTML = '<tr class="empty-data"><td colspan="4">Nobody played yet 🙁</td></tr>';
            }
        }
    }

};