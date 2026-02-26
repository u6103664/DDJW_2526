addEventListener('load', function() {
	alies="";
    document.getElementById('play').addEventListener('click', 
    function(){
        alies=prompt("Introdueix el teu àlies: ");
		console.log(alies);
    });

    document.getElementById('options').addEventListener('click', 
    function(){
        console.error("Opció no implementada");
    });

    document.getElementById('saves').addEventListener('click', 
    function(){
        console.error("Opció no implementada");
    });

    document.getElementById('exit').addEventListener('click', 
    function(){
        console.warn("No es pot sortir!");
    });
});