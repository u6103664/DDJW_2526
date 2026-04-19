import {$} from "../library/jquery-4.0.0.slim.module.min.js";

function loadScores(){
    let scores = [];
    if (sessionStorage.scoresHistory){
        scores = JSON.parse(sessionStorage.scoresHistory);
    }

    scores.sort((a, b) => Number(b.score) - Number(a.score));
    return scores.slice(0, 10);
}

function renderScores(){
    let tbody = $("#scoresTable tbody");
    tbody.empty();

    let topScores = loadScores();
    if (!topScores.length){
        tbody.append("<tr><td colspan='4'>No hi ha scores guardats en aquesta sessió.</td></tr>");
        return;
    }

    topScores.forEach((row, idx) => {
        tbody.append(`<tr><td>${idx + 1}</td><td>${row.alias}</td><td>${row.mode}</td><td>${row.score}</td></tr>`);
    });
}

$("#back").on("click", function(){
    window.location.assign("../");
});

renderScores();
