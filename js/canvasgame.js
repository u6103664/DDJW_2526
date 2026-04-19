import {$} from "../library/jquery-4.0.0.slim.module.min.js";
import {clickCard, gameItems, selectCards, startGame, initCard, saveGame} from "./memory.js";

let game = $('#game');
let canvas = game[0].getContext('2d');
let resources = {};
let cards = {};
const e_click = {click: false, x: -1, y: -1}
let key = null;
const c_w = 96;
const c_h = 128;
const gap = 12;
let idxSel = -1;

if (canvas){
    start();
    update();
}

function updateCanvasSize(cardCount){
    let panel = game.parent()[0];
    let availableWidth = panel ? Math.max(320, panel.clientWidth - 40) : 800;
    let cols = Math.max(1, Math.floor((availableWidth + gap) / (c_w + gap)));
    cols = Math.min(cols, Math.max(1, cardCount));
    let rows = Math.max(1, Math.ceil(cardCount / cols));

    let contentWidth = cols * c_w + (cols - 1) * gap;
    let contentHeight = rows * c_h + (rows - 1) * gap;

    game.attr("width", Math.max(contentWidth + 20, availableWidth));
    game.attr("height", contentHeight + 20);
}

function layoutCards(){
    let width = Number(game.attr("width"));
    let cols = Math.max(1, Math.floor((width - 20 + gap) / (c_w + gap)));
    cols = Math.min(cols, Math.max(1, cards.length));
    let rows = Math.max(1, Math.ceil(cards.length / cols));

    let contentWidth = cols * c_w + (cols - 1) * gap;
    let contentHeight = rows * c_h + (rows - 1) * gap;
    let startX = Math.max(10, Math.floor((width - contentWidth) / 2));
    let startY = 10;
    if (Number(game.attr("height")) > contentHeight + 20){
        startY = Math.floor((Number(game.attr("height")) - contentHeight) / 2);
    }

    cards.forEach((card, indx) => {
        let col = indx % cols;
        let row = Math.floor(indx / cols);
        let x = startX + col * (c_w + gap);
        let y = startY + row * (c_h + gap);
        card.position = {
            xMin: x,
            xMax: x + c_w,
            yMin: y,
            yMax: y + c_h
        };
    });
}

function start(){
    selectCards();
    cards = gameItems.map((c)=>{return {texture:c}});
    updateCanvasSize(cards.length);
    loadCardResource("../resources/back.svg");
    cards.forEach((card, indx) => {
        loadCardResource(card.texture);
        initCard(val => card.texture = val);
        card.onClick = function(x, y){
            return x >= this.position.xMin && x <= this.position.xMax &&
                    y >= this.position.yMin && y <= this.position.yMax;
        }
    });
    layoutCards();
    // Vincular events
    game.on('click', function(e){
        let rect = this.getBoundingClientRect();
        e_click.click = true;
        e_click.x = e.clientX - rect.left;
        e_click.y = e.clientY - rect.top;
    });
    $(document).keydown(e=>key = e.key);
    $(window).on('resize', function(){
        updateCanvasSize(cards.length);
        layoutCards();
    });
    startGame();
}

function update(){
    checkInput();
    draw();
    requestAnimationFrame(update);
}

function loadCardResource(src){
    if (!resources[src]){
        let res = {image: null, ready: false}
        res.image = new Image();
        res.image.src = src;
        res.image.onload = ()=> res.ready = true;
        resources[src] = res;
    }
}

function draw(){
    canvas.reset();
    cards.forEach((card, indx) => {
        let res = resources[card.texture];
        if (res.ready){
            if (idxSel === indx)
                canvas.drawImage(res.image, card.position.xMin, 
                                card.position.yMin, c_w + 4, c_h + 4);
            else
                canvas.drawImage(res.image, card.position.xMin, 
                                    card.position.yMin, c_w, c_h);
        }
    });
}

function checkInput(){
    if (e_click.click){
        cards.some((card, indx)=>{
            let click = card.onClick(e_click.x, e_click.y);
            if (click) clickCard(indx);
            return click;
        });
    }
    if (key){
        let prevIndx = idxSel;
        switch(key){
            case "Escape":
                saveGame();
                break;
            case "ArrowRight":
                idxSel = (idxSel + 1)%cards.length;
                break;
            case "ArrowLeft":
                idxSel = (idxSel - 1 + cards.length)%cards.length;
                break;
            case "Enter":
                if (idxSel >= 0) clickCard(idxSel);
                break;
            default:
                console.warn("Tecla "+key+" no reconeguda.");
        }
        if (idxSel != prevIndx){
            if (prevIndx >= 0) {
                cards[prevIndx].position.xMin += 2;
            }
            cards[idxSel].position.xMin -= 2;
        }
    }
    e_click.click = key = false;
}

