const resources = ['../resources/cb.png', '../resources/co.png',
                '../resources/sb.png', '../resources/so.png',
                '../resources/tb.png', '../resources/to.png'];
const back = '../resources/back.png';

const StateCard = Object.freeze({
  DISABLE: 0,
  ENABLE: 1,
  DONE: 2
});

var game = {
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    selectedCards: [],
    lastCard: null,
    score: 200,
    pairs: 2,
    sizePairs: 2,
    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
    select: function(){
        this.ready = 0;
        this.selectedCards = [];
        this.lastCard = null;
        if (sessionStorage.load){ // Carreguem partida
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.selectedCards = Array.isArray(toLoad.selectedCards) ? toLoad.selectedCards : (toLoad.lastCard !== null && toLoad.lastCard !== undefined ? [toLoad.lastCard] : []);
            this.lastCard = this.selectedCards.length ? this.selectedCards[this.selectedCards.length - 1] : null;
            this.score = toLoad.score;
            this.pairs = Number(toLoad.pairs);
            this.sizePairs = Number(toLoad.sizePairs || this.sizePairs);
        }
        else{ // Nova partida
            let savedOptions = localStorage.options && JSON.parse(localStorage.options);
            if (savedOptions && savedOptions.pairs)
                this.pairs = Number(savedOptions.pairs);
            if (savedOptions && savedOptions.sizePairs)
                this.sizePairs = Number(savedOptions.sizePairs);
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
                alert(`Has guanyat amb ${this.score} punts!!!!`);
                window.location.assign("../");
            }
        }
        else {
            this.selectedCards.forEach(cardIdx => this.goBack(cardIdx));
            this.score -= 25;
            if (this.score <= 0){
                alert ("Has perdut");
                window.location.assign("../");
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
            pairs: this.pairs,
            sizePairs: this.sizePairs
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