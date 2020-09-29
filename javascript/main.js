function updateIconColors() {
    if (animationPaused.all) {
        $('#play-icon').removeClass("green");
        $('#pause-icon').addClass("red");
        $('#fractalPowerPlay').addClass("red");
        $('#fractalPowerPlay').removeClass("green");
    } else {
        $('#play-icon').addClass("green");
        $('#pause-icon').removeClass("red");
        $('#fractalPowerPlay').addClass("green");
        $('#fractalPowerPlay').removeClass("red");
    }
}

var renderNextFrame = true;
var animationPaused = {
    all: false,
    fractalPower: false
};
var shaderVariables = {
    fractalPower: 8
}
var startTime = 0;
var timeElaspedWhilePaused = 0;
var timeElasped = 0;

$(document).ready(function(){

    canvas = document.querySelector('#glCanvas');
    canvas.height = $(window).height();
    canvas.width = $(window).width();
    main($(window).height(), $(window).width());

    updateIconColors();

    $("#fractalPowerSlider").attr({min: 10, max: 150, step:1, value: 80});


    $("#pauseAnimation").click(function(){
        if (animationPaused.all) {
            startTime += (timeElaspedWhilePaused - timeElasped);
            timeElaspedWhilePaused = 0;
        }
        animationPaused.all = !animationPaused.all;
        updateIconColors();
    }); 

}); 

