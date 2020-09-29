function toggleIconColor(id, color) {
    if (color == 'red') {
        $(id).addClass('red');
        $(id).removeClass('green');
    } else {
        $(id).addClass('green');
        $(id).removeClass('white');
    }
}

function updateIconColors() {
    if (animationPaused.all) {
        $('#play-icon').removeClass('green');
        $('#pause-icon').addClass('red');
        toggleIconColor('#fractalPowerPlay', 'red');
    } else {
        $('#play-icon').addClass('green');
        $('#pause-icon').removeClass('red');
        toggleIconColor('#fractalPowerPlay', 'green')
    }
}

function setFractalPowerAnimation(toggle) {
    if (toggle == 'play') {
        toggleIconColor('#fractalPowerPlay', 'green');
    } else {
        toggleIconColor('#fractalPowerPlay', 'red');
    }
    animationPaused.fractalPower = (toggle == 'play') ? false : true;
}

var renderNextFrame = true;
var animationPaused = {
    all: false,
    fractalPower: false
};
var shaderVariables = {
    fractalPower: 8.0
}
var startTime = 0;
var timeElaspedWhilePaused = 0;
var timeElasped = 0;

$(document).ready(function(){

    canvas = document.querySelector('#glCanvas');
    canvas.height = $(window).height();
    canvas.width = $(window).width();
    startRender($(window).height(), $(window).width());

    updateIconColors();

    $('#fractalPowerSlider').attr({min: 10, max: 150, step:1, value: 80});

    $('#fractalPowerSlider').on('input', function() {
        setFractalPowerAnimation('pause');
        sliderValue = 0.1 * parseFloat($('#fractalPowerSlider').val());
    
        shaderVariables.fractalPower = sliderValue;
        $("#fractalPowerTextInput").val(sliderValue);
        renderNextFrame = true;
    });

    //  play/pause fractal animation
    $('#fractalPowerPlay').click(function(){
        setFractalPowerAnimation(animationPaused.fractalPower ? 'play' : 'pause');
    });

    //  play/pause all animation
    $('#pauseAnimation').click(function(){
        if (animationPaused.all) {
            startTime += (timeElaspedWhilePaused - timeElasped);
            timeElaspedWhilePaused = 0;
        }
        animationPaused.all = !animationPaused.all;
        if (animationPaused.fractalPower) setFractalPowerAnimation('play');
        updateIconColors();
    }); 

}); 

