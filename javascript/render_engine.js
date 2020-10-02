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

    function render(now)
    {
        now *= 0.001 //convert to seconds
        if (animationPaused.all){
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
}

function renderDrawingMesh(gl) {
    const offset = 0;
    const vertexCount = 3;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
}

function drawScene(gl, rayTracerShader, displayShader, framebuffer, timeElasped, screenScale)
{

    if (renderNextFrame || !animationPaused.all || !animationPaused.fractalPower) {

        framebuffer.bindBuffer(gl);
        gl.useProgram(rayTracerShader.program);

        configureShaderVariables(gl, rayTracerShader, timeElasped);

        renderDrawingMesh(gl);
        framebuffer.unBindBuffer(gl);

        if (renderNextFrame) renderNextFrame = !renderNextFrame;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(displayShader.program);

    renderDrawingMesh(gl);
}

function configureShaderVariables(gl, shader, timeElasped) {

    sinBob = Math.sin(0.05   * timeElasped);
    cosBob = Math.cos(0.05   * timeElasped);
    rotBob = Math.sin(0.00005 * timeElasped);

    if (animationPaused.fractalPower) {
        shader.configureVariable(gl, "power", shaderVariables.fractalPower);
    } else {
        newFractalPower = 8.0 + 7*cosBob;
        shaderVariables.fractalPower = newFractalPower;
        
        if (!textAreaFocused.fractalPower) $("#fractalPowerTextInput").val(newFractalPower);
        $("#fractalPowerSlider").val(10*newFractalPower);
        
        shader.configureVariable(gl, "power", newFractalPower);
    }

    shader.configureVariable(gl, "spherePos", [0.0, 0.0, 0.0]);
    shader.configureVariable(gl, "lightPos", [3.0, 3.0, 3.0]);
    shader.configureVariable(gl, "sphereRadius", 0.5);
    shader.configureVariable(gl, "fractalYRotation", -360 * rotBob);
    shader.configureVariable(gl, "screenScale", screenScale);
}
