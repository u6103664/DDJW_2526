import {$} from "../library/jquery-4.0.0.slim.module.min.js";

var options = function(){
    const default_options = {
        pairs: 2,
        difficulty: 'normal',
        sizePairs: 2
    } 

    var pairs = $('#pairs');
    var difficulty = $('#dif');
    var sizePairs = $('#sizePairs');

    var savedOptions = localStorage.options && JSON.parse(localStorage.options);
    var options = Object.create(default_options);

    if (savedOptions && savedOptions.pairs)
        options.pairs = savedOptions.pairs;
    if (savedOptions && savedOptions.difficulty)
        options.difficulty = savedOptions.difficulty;
    if (savedOptions && savedOptions.sizePairs)
        options.sizePairs = savedOptions.sizePairs;

    pairs.val(options.pairs);
    difficulty.val(options.difficulty);
    sizePairs.val(options.sizePairs);

    pairs.on('change', function (){
        options.pairs = pairs.val();
    });

    difficulty.on('change', function (){
        options.difficulty = difficulty.val();
    });
    sizePairs.on('change', function (){
        options.sizePairs = sizePairs.val();
    });

    return {
        applyChanges: function(){
            localStorage.options = JSON.stringify(options);
        },
        defaultValues: function(){
            options.pairs = default_options.pairs;
            options.difficulty = default_options.difficulty;
            options.sizePairs = default_options.sizePairs;
            pairs.val(options.pairs);
            difficulty.val(options.difficulty);
            sizePairs.val(options.sizePairs);
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
