class FrameBuffer {
    constructor(gl, height, width)
    {

        this._targetTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this._targetTexture);
        const level = 0;
        
        {
            // define size and format of level 0
            const internalFormat = gl.RGBA;
            const border = 0;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;
            const data = null;
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                            width, height, border,
                            format, type, data);
            
            // set the filtering so we don't need mips
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }


        this.fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
        
        // attach the texture as the first color attachment
        const attachmentPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, this._targetTexture, level);
    }

    bindBuffer(gl)
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);    
        gl.clearColor(0, 0, 0, 1);   // clear to blue
        gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);
    }

    unBindBuffer(gl)
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    get targetTexture() {
        return this._targetTexture;
    }
}