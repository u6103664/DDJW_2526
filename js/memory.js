import {setValue, clickOn, clickOff} from './game.js';
const resources = ['../resources/cb.png', '../resources/co.png',
                '../resources/sb.png', '../resources/so.png',
                '../resources/tb.png', '../resources/to.png'];
const back = '../resources/back.png';

var game = {
    items: [],
    ready: 0,
    lastCard: null,
    score: 200,
    pairs: 2,
    goBack: function(idx){
        setValue(idx, back);
        clickOn(idx);
    },
    goFront: function(idx){
        setValue(idx, this.items[idx]);
        clickOff(idx);
    },
    select: function(){
        this.items = resources.slice();          
        shuffe(this.items);                      
        this.items = this.items.slice(0, this.pairs); 
        this.items = this.items.concat(this.items);        
        shuffe(this.items);
    },
    start: function(){
        this.items.forEach((_,indx)=>{
            setTimeout(()=>{
                this.ready++;
                this.goBack(indx);
            }, 1000 + 100 * indx);
        });
    },
    click: function(indx){
        if (this.ready < this.items.length) return;
        this.goFront(indx);
        if (this.lastCard === null) this.lastCard = indx; // Primera carta clicada
        else{ // Teníem carta prèvia
            if (this.items[this.lastCard] === this.items[indx]){
                this.pairs--;
                if (this.pairs <= 0){
                    alert(`Has guanyat amb ${this.score} punts!!!!`);
                    window.location.assign("../");
                }
            }
            else {
                this.goBack(indx);
                this.goBack(this.lastCard);
                this.score -= 25;
                if (this.score <= 0){
                    alert ("Has perdut");
                    window.location.assign("../");
                }
            }
            this.lastCard = null;
        }
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

