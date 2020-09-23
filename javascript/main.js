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

    const shader = new Shader(gl);

    const buffers = initBuffers(gl, shader);


    var startTime = 0;

    function render(now)
    {
        now *= 0.001 //convert to seconds
        const timeElasped = now - startTime;

        drawScene(gl, shader, timeElasped, screenScale);

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

function drawScene(gl, shader, timeElasped, screenScale)
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shader.program);

    //animations vars

    sinBob = Math.sin(0.05   * timeElasped);
    cosBob = Math.cos(0.05   * timeElasped);
    rotBob = Math.sin(0.00005 * timeElasped);

    // Set the shader uniforms
    shader.configureVariable(gl, "spherePos", [0.0, 0.0, 0.0]);
    shader.configureVariable(gl, "lightPos", [3.0, 3.0, 3.0]);
    shader.configureVariable(gl, "sphereRadius", 0.5);
    shader.configureVariable(gl, "power", 8.0 + 7*cosBob);
    shader.configureVariable(gl, "fractalYRotation", -360 * rotBob);
    shader.configureVariable(gl, "screenScale", screenScale);

    {
        const offset = 0;
        const vertexCount = 3;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}

$(document).ready(function(){

    canvas = document.querySelector('#glCanvas');
    canvas.height = $(window).height();
    canvas.width = $(window).width();
    main($(window).height(), $(window).width());
  
}); 

