function main(height, width)
{
    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext("webgl");
    screenScale = [1, height / width , 1];

    if (gl == null)
    {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    const rayTracerShader = new Shader(gl, true);
    const displayShader = new Shader(gl, false);
    const framebuffer = new FrameBuffer(gl, height, width);
    const buffers = initBuffers(gl, rayTracerShader);


    function render(now)
    {
        now *= 0.001 //convert to seconds
        if (animtaionPaused){
            timeElaspedWhilePaused = now - startTime;
        } else {
            timeElasped = now - startTime;
        }

        drawScene(gl, rayTracerShader, displayShader, framebuffer, timeElasped, screenScale);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function initBuffers(gl, shader)
{
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        -1.0,  3.0,
         3.0,  -1.0,
        -1.0, -1.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER,
                 new Float32Array(positions),
                 gl.STATIC_DRAW);

    const attribLocation = gl.getAttribLocation(shader.program, 'aPos');
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalise = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(
        attribLocation,
        numComponents,
        type,
        normalise,
        stride,
        offset
    );
    gl.enableVertexAttribArray(attribLocation);
    
    return {
        position: positionBuffer,
    };
}

function renderDrawingMesh(gl) {
    const offset = 0;
    const vertexCount = 3;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
}

function drawScene(gl, rayTracerShader, displayShader, framebuffer, timeElasped, screenScale)
{

    if (renderNextFrame || !animtaionPaused) {

        framebuffer.bindBuffer(gl);
        gl.useProgram(rayTracerShader.program);

        sinBob = Math.sin(0.05   * timeElasped);
        cosBob = Math.cos(0.05   * timeElasped);
        rotBob = Math.sin(0.00005 * timeElasped);

        // Set the shader uniforms
        rayTracerShader.configureVariable(gl, "spherePos", [0.0, 0.0, 0.0]);
        rayTracerShader.configureVariable(gl, "lightPos", [3.0, 3.0, 3.0]);
        rayTracerShader.configureVariable(gl, "sphereRadius", 0.5);
        rayTracerShader.configureVariable(gl, "power", 8.0 + 7*cosBob);
        rayTracerShader.configureVariable(gl, "fractalYRotation", -360 * rotBob);
        rayTracerShader.configureVariable(gl, "screenScale", screenScale);

        renderDrawingMesh(gl);
        framebuffer.unBindBuffer(gl);

        if (renderNextFrame) renderNextFrame = !renderNextFrame;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(displayShader.program);

    renderDrawingMesh(gl);
}

function updateIconColors(animtaionPaused) {
    if (animtaionPaused) {
        $('#play-icon').removeClass("green");
        $('#pause-icon').addClass("red");
    } else {
        $('#play-icon').addClass("green");
        $('#pause-icon').removeClass("red");
    }
}

var renderNextFrame = true;
var animtaionPaused = true;
var startTime = 0;
var timeElaspedWhilePaused = 0;
var timeElasped = 0;

$(document).ready(function(){

    canvas = document.querySelector('#glCanvas');
    canvas.height = $(window).height();
    canvas.width = $(window).width();
    main($(window).height(), $(window).width());
    updateIconColors(animtaionPaused);

    $("#pauseAnimation").click(function(){
        if (animtaionPaused) {
            startTime += (timeElaspedWhilePaused - timeElasped);
            timeElaspedWhilePaused = 0;
        }
        animtaionPaused = !animtaionPaused;
        updateIconColors(animtaionPaused);
    }); 

}); 

