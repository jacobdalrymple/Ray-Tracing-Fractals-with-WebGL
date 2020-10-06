var renderNextFrame = true;
var textAreaFocused = {
    fractalPower: false
};
var allAnimationPaused = false;
var fractalPower = new AnimatedParameter(8, 7, 0.05, false, 
                                         function(time, scale) {
                                             return Math.cos(scale * time);
                                         });
var cameraZPos = new AnimatedParameter(3, 0, 0, true,
                                         function(time, scale) {
                                            return 0;
                                         });
var fractalRotation = new AnimatedParameter(0, 360, 0.00005, false,
                                         function(time, scale) {
                                            return Math.sin(scale * time);
                                         });

function isAAnimationPlaying() {
    return !fractalRotation.paused || !cameraZPos.paused || !fractalPower.paused;
}

function toggleIconColor(id, color) {
    if (color == 'red') {
        $(id).addClass('red');
        $(id).removeClass('green');
    } else {
        $(id).addClass('green');
        $(id).removeClass('white');
    }
}

function setAllAnimation(toggle) {
    if (toggle == 'play') {
        $('#play-icon').addClass('green');
        $('#pause-icon').removeClass('red');
    } else {
        $('#play-icon').removeClass('green');
        $('#pause-icon').addClass('red');
    }
    setFractalPowerAnimation(toggle);
    setFractalRotationAnimation(toggle);
}

function setFractalPowerAnimation(toggle) {
    if (toggle == 'play') {
        fractalPower.play();
        toggleIconColor('#fractalPowerPlay', 'green');
    } else {
        fractalPower.pause();
        toggleIconColor('#fractalPowerPlay', 'red');
    }
}
function setFractalRotationAnimation(toggle) {
    if (toggle == 'play') {
        fractalRotation.play();
        //toggleIconColor('#fractalPowerPlay', 'green');
    } else {
        fractalRotation.pause();
        //toggleIconColor('#fractalPowerPlay', 'red');
    }
}

$(document).ready(function(){

    canvas = document.querySelector('#glCanvas');
    canvas.height = $(window).height();
    canvas.width = $(window).width();
    startRender($(window).height(), $(window).width());

    setAllAnimation('play');

    $('#fractalPowerSlider').attr({min: 10, max: 150, step:1, value: 80});

    // keyboard key press event
    $('body').keypress(function(event) {
        
        keyChar = String.fromCharCode(event.which);

        switch(keyChar) {
            case 'a':
                cameraZPos.value -= 0.01;
                renderNextFrame = true;
                break;
            case 'z':
                cameraZPos.value += 0.01;
                renderNextFrame = true;
                break;
        }
    });

    $('#fractalPowerSlider').on('input', function() {
        setFractalPowerAnimation('pause');
        sliderValue = 0.1 * parseFloat($('#fractalPowerSlider').val());
    
        fractalPower.value = sliderValue;
        $("#fractalPowerTextInput").val(sliderValue);
        renderNextFrame = true;
    });

    //  play/pause fractal animation
    $('#fractalPowerPlay').click(function(){
        setFractalPowerAnimation(fractalPower.paused ? 'play' : 'pause');
    });

    // fractal power text input events
    $('#fractalPowerTextInput').focus(function(){
        textAreaFocused.fractalPower = true;
    });
    $('#fractalPowerTextInput').focusout(function(){
        textAreaFocused.fractalPower = false;
    });
    var oldVal = "";
    $("#fractalPowerTextInput").on('change keyup paste', function() {
        var currentVal = $(this).val();
        if (currentVal == oldVal || $.trim(currentVal).length === 0) {
            return;
        }
        oldVal = currentVal;
        if (!fractalPower.paused)
            setFractalPowerAnimation('pause');

        fractalPower = parseFloat(currentVal);
        if (typeof fractalPower != 'number' || isNaN(fractalPower) || fractalPower < 1 || fractalPower > 15) {
            alert('Fractal power must be a number within the range 1 - 14.');
        } else {
            fractalPower.value = fractalPower;
            $('#fractalPowerSlider').val(fractalPower * 10);
        }
    });

    //  play/pause all animation
    $('#pauseAnimation').click(function(){
        setAllAnimation(allAnimationPaused ? 'play' : 'pause');
        allAnimationPaused = !allAnimationPaused;
    }); 

});

