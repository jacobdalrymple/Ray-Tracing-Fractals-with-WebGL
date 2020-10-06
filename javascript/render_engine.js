function startRender(height, width)
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
    initBuffers(gl, rayTracerShader);

    function render(currentTime)
    {
        currentTime *= 0.001;   //to seconds

        fractalPower.updateValue(currentTime);
        fractalRotation.updateValue(currentTime);

        drawScene(gl, rayTracerShader, displayShader, framebuffer, currentTime);

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
}

function renderDrawingMesh(gl) {
    const offset = 0;
    const vertexCount = 3;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
}

function drawScene(gl, rayTracerShader, displayShader, framebuffer, currentTime)
{

    if (renderNextFrame || isAAnimationPlaying()) {

        framebuffer.bindBuffer(gl);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.useProgram(rayTracerShader.program);

        configureShaderVariables(gl, rayTracerShader, currentTime);

        renderDrawingMesh(gl);
        framebuffer.unBindBuffer(gl);

        renderNextFrame = false;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(displayShader.program);

    renderDrawingMesh(gl);
}

function configureShaderVariables(gl, shader, currentTime) {

    //update UI values
    if (!fractalPower.paused) {
        if (!textAreaFocused.fractalPower)
            $("#fractalPowerTextInput").val(fractalPower.value);
        $("#fractalPowerSlider").val(10 *   fractalPower.value);
    }
    shader.configureVariable(gl, "power", fractalPower.value);
    shader.configureVariable(gl, "zPos", cameraZPos.value);
    shader.configureVariable(gl, "spherePos", [0.0, 0.0, 0.0]);
    shader.configureVariable(gl, "lightPos", [3.0, 3.0, 3.0]);
    shader.configureVariable(gl, "sphereRadius", 0.5);
    shader.configureVariable(gl, "fractalYRotation", fractalRotation.value);
    shader.configureVariable(gl, "screenScale", screenScale);
}
