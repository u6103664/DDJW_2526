import {$} from "../library/jquery-4.0.0.slim.module.min.js";

const mode = new URLSearchParams(window.location.search).get('mode') === '2' ? '2' : '1';
const storageKey = mode === '2' ? 'options_mode2' : 'options_mode1';

$('#optionsTitle').text(`Opcions - Mode ${mode}`);

var options = function(){
    const default_options = {
        pairs: 2,
        difficulty: 'normal',
        sizePairs: 2,
        penalty: 1
    } 

    var pairs = $('#pairs');
    var difficulty = $('#dif');
    var sizePairs = $('#sizePairs');
    var penalty = $('#penalty');

    var savedOptions = localStorage[storageKey] && JSON.parse(localStorage[storageKey]);
    if (!savedOptions && mode === '1' && localStorage.options)
        savedOptions = JSON.parse(localStorage.options);
    var options = Object.create(default_options);

    if (savedOptions && savedOptions.pairs)
        options.pairs = savedOptions.pairs;
    if (savedOptions && savedOptions.difficulty)
        options.difficulty = savedOptions.difficulty;
    if (savedOptions && savedOptions.sizePairs)
        options.sizePairs = savedOptions.sizePairs;
    if (savedOptions && savedOptions.penalty)
        options.penalty = savedOptions.penalty;

    pairs.val(options.pairs);
    difficulty.val(options.difficulty);
    sizePairs.val(options.sizePairs);
    penalty.val(options.penalty);

    pairs.on('change', function (){
        options.pairs = pairs.val();
    });

    difficulty.on('change', function (){
        options.difficulty = difficulty.val();
    });
    sizePairs.on('change', function (){
        options.sizePairs = sizePairs.val();
    });
    penalty.on('change', function (){
        options.penalty = penalty.val();
    });

    return {
        applyChanges: function(){
            localStorage[storageKey] = JSON.stringify(options);
            if (mode === '1')
                localStorage.options = localStorage[storageKey];
        },
        defaultValues: function(){
            options.pairs = default_options.pairs;
            options.difficulty = default_options.difficulty;
            options.sizePairs = default_options.sizePairs;
            options.penalty = default_options.penalty;
            pairs.val(options.pairs);
            difficulty.val(options.difficulty);
            sizePairs.val(options.sizePairs);
            penalty.val(options.penalty);
        }
    }
}();

$('#default').on('click', function(){
    options.defaultValues();
})

$('#apply').on('click', function(){
    options.applyChanges();
    location.assign("../");
});
