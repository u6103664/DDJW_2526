
import {$} from "../library/jquery-4.0.0.slim.module.min.js";

var alies = "";

$('#playMode1').on('click', 
function(){
    sessionStorage.removeItem('load');
    sessionStorage.removeItem('progressiveState');
    sessionStorage.gameMode = '1';
    alies = prompt("Introdueix el teu àlies: ");
    sessionStorage.playerAlias = alies;
    console.log(alies);
    window.location.assign("./html/canvasgame.html");
});

$('#playMode2').on('click', 
function(){
    sessionStorage.removeItem('load');
    sessionStorage.removeItem('progressiveState');
    sessionStorage.gameMode = '2';
    alies = prompt("Introdueix el teu àlies: ");
    sessionStorage.playerAlias = alies;
    console.log(alies);
    window.location.assign("./html/canvasgame.html");
});

$('#scores').on('click', 
function(){
    window.location.assign("./html/scores.html");
});

$('#optionsMode1').on('click', 
function(){
    window.location.assign("./html/options.html?mode=1");
});

$('#optionsMode2').on('click', 
function(){
    window.location.assign("./html/options.html?mode=2");
});

$('#saves').on('click', 
function(){
    let to_load = localStorage.save;
    if (!to_load) {
        alert("No hi ha cap partida a carregar");
        return;
    }

    let loaded = JSON.parse(to_load);
    if (loaded.playerAlias) sessionStorage.playerAlias = loaded.playerAlias;
    if (loaded.mode) sessionStorage.gameMode = String(loaded.mode);
    if (loaded.progressiveState) sessionStorage.progressiveState = JSON.stringify(loaded.progressiveState);
    else sessionStorage.removeItem('progressiveState');

    sessionStorage.load = to_load;
    window.location.assign("./html/canvasgame.html");
});

$('#exit').on('click', 
function(){
    console.warn("No es pot sortir!");
});