const resources = ['../resources/cb.png', '../resources/co.png',
                '../resources/sb.png', '../resources/so.png',
                '../resources/tb.png', '../resources/to.png'];
const back = '../resources/back.png';

const StateCard = Object.freeze({
  DISABLE: 0,
  ENABLE: 1,
  DONE: 2
});

const LIMITS = Object.freeze({
    pairs: 6,
    sizePairs: 4,
    penalty: 4
});

const BASE_PENALTY = 25;

function clamp(val, min, max){
    return Math.min(max, Math.max(min, Number(val)));
}

var game = {
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    selectedCards: [],
    lastCard: null,
    score: 200,
    mode: 1,
    pairs: 2,
    sizePairs: 2,
    penalty: 1,
    currentOptionsKey: "options_mode1",
    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
    getMode: function(){
        return sessionStorage.gameMode === '2' ? 2 : 1;
    },
    getOptionsKey: function(){
        return this.mode === 2 ? "options_mode2" : "options_mode1";
    },
    getSavedOptions: function(){
        let savedOptions = localStorage[this.currentOptionsKey] && JSON.parse(localStorage[this.currentOptionsKey]);
        if (!savedOptions && this.currentOptionsKey === "options_mode1" && localStorage.options)
            savedOptions = JSON.parse(localStorage.options);
        return savedOptions;
    },
    applyDifficulty: function(options){
        if (!options) return;
        this.pairs = clamp(options.pairs || this.pairs, 2, LIMITS.pairs);
        this.sizePairs = clamp(options.sizePairs || this.sizePairs, 2, LIMITS.sizePairs);
        this.penalty = clamp(options.penalty || this.penalty, 1, LIMITS.penalty);
    },
    createBoard: function(){
        this.items = resources.slice();
        shuffe(this.items);
        this.items = this.items.slice(0, this.pairs);
        let groupedItems = [];
        this.items.forEach(item => {
            for (let i = 0; i < this.sizePairs; i++){
                groupedItems.push(item);
            }
        });
        this.items = groupedItems;
        shuffe(this.items);
        this.states = new Array(this.items.length);
    },
    nextProgressiveDifficulty: function(){
        let currentPairs = new Set(this.items).size;
        return {
            pairs: Math.min(LIMITS.pairs, currentPairs + 1),
            sizePairs: Math.min(LIMITS.sizePairs, this.sizePairs + 1),
            penalty: Math.min(LIMITS.penalty, this.penalty + 1)
        };
    },
    isMaxProgressiveDifficulty: function(){
        let currentPairs = new Set(this.items).size;
        return currentPairs >= LIMITS.pairs &&
            this.sizePairs >= LIMITS.sizePairs &&
            this.penalty >= LIMITS.penalty;
    },
    goToMenu: function(){
        sessionStorage.removeItem('progressiveState');
        window.location.assign("../");
    },
    select: function(){
        this.ready = 0;
        this.selectedCards = [];
        this.lastCard = null;
        this.mode = this.getMode();
        this.currentOptionsKey = this.getOptionsKey();

        if (sessionStorage.load){ // Carreguem partida
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.selectedCards = Array.isArray(toLoad.selectedCards) ? toLoad.selectedCards : (toLoad.lastCard !== null && toLoad.lastCard !== undefined ? [toLoad.lastCard] : []);
            this.lastCard = this.selectedCards.length ? this.selectedCards[this.selectedCards.length - 1] : null;
            this.score = toLoad.score;
            this.mode = Number(toLoad.mode || this.mode);
            this.currentOptionsKey = this.getOptionsKey();
            this.pairs = Number(toLoad.pairs);
            this.sizePairs = Number(toLoad.sizePairs || this.sizePairs);
            this.penalty = Number(toLoad.penalty || this.penalty);
        }
        else{ // Nova partida
            if (this.mode === 2 && sessionStorage.progressiveState){
                let progressive = JSON.parse(sessionStorage.progressiveState);
                this.applyDifficulty(progressive);
            }
            else{
                let savedOptions = this.getSavedOptions();
                this.applyDifficulty(savedOptions);
                if (this.mode === 2){
                    sessionStorage.progressiveState = JSON.stringify({
                        pairs: this.pairs,
                        sizePairs: this.sizePairs,
                        penalty: this.penalty
                    });
                }
            }
            this.score = 200;
            this.createBoard();
        }
    },
    start: function(){
        this.ready = 0;
        this.items.forEach((_,indx)=>{
            if (this.states[indx] === StateCard.DISABLE ||
                this.states[indx] === StateCard.DONE){
                this.ready++;
            }
            else{
                setTimeout(()=>{
                    this.ready++;
                    this.goBack(indx);
                }, 1000 + 100 * indx);
            }
        });
    },
    click: function(indx){
        if (this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length) return;
        this.goFront(indx);
        this.selectedCards.push(indx);
        this.lastCard = indx;
        if (this.selectedCards.length < this.sizePairs) return;

        let isMatch = this.selectedCards.every(cardIdx => this.items[cardIdx] === this.items[this.selectedCards[0]]);
        if (isMatch){
            this.selectedCards.forEach(cardIdx => this.states[cardIdx] = StateCard.DONE);
            this.pairs--;
            if (this.pairs <= 0){
                if (this.mode === 2){
                    if (this.isMaxProgressiveDifficulty()){
                        alert(`Has guanyat el mode progressiu amb ${this.score} punts!!!!`);
                        this.goToMenu();
                    }
                    else {
                        let nextDifficulty = this.nextProgressiveDifficulty();
                        sessionStorage.progressiveState = JSON.stringify(nextDifficulty);
                        alert(`Nivell superat! Seguent nivell: cartes=${nextDifficulty.pairs}, parelles=${nextDifficulty.sizePairs}, penalitzacio=${nextDifficulty.penalty}`);
                        window.location.reload();
                    }
                }
                else {
                    alert(`Has guanyat amb ${this.score} punts!!!!`);
                    this.goToMenu();
                }
            }
        }
        else {
            this.selectedCards.forEach(cardIdx => this.goBack(cardIdx));
            this.score -= BASE_PENALTY * this.penalty;
            if (this.score <= 0){
                alert ("Has perdut");
                this.goToMenu();
            }
        }
        this.selectedCards = [];
        this.lastCard = null;
    },
    save: function(){
        let to_save = JSON.stringify({
            items: this.items,
            states: this.states,
            lastCard: this.lastCard,
            selectedCards: this.selectedCards,
            score: this.score,
            mode: this.mode,
            pairs: this.pairs,
            sizePairs: this.sizePairs,
            penalty: this.penalty
        });
        let ret = false;
        fetch('../php/save.php', {
            method: "POST",
            body: to_save,
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => ret = JSON.parse(response))
        .catch (err => console.error(err));

        if (!ret) {
            console.warn("La partida s'ha guardat en local.");
            localStorage.save = to_save;
        }
        window.location.assign("../");
    }
}

function shuffe(arr){
    arr.sort(function () {return Math.random() - 0.5});
}

export var gameItems;
export function selectCards() { 
    game.select();
    gameItems = game.items;
}
export function clickCard(indx){ game.click(indx); }
export function startGame(){ game.start(); }
export function initCard(callback) { 
    if (!game.setValue) game.setValue = [];
    game.setValue.push(callback); 
}
export function saveGame(){
    game.save();
}