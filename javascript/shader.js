class Shader
{
    constructor(gl)
    {
        const vertShader = this.loadShader(gl, gl.VERTEX_SHADER, this.vertexSource);
        const fragShader = this.loadShader(gl, gl.FRAGMENT_SHADER, this.fragmentSource);

        this._program = gl.createProgram();
        gl.attachShader(this._program, vertShader);
        gl.attachShader(this._program, fragShader);
        gl.linkProgram(this._program);

        if (!gl.getProgramParameter(this._program, gl.LINK_STATUS))
        {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(this._program));
            this._program = null;
        }
    }

    loadShader(gl, type, source)
    {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    configureVariable(gl, variableName, value)
    {
        const location = gl.getUniformLocation(this._program, variableName);

        if (typeof value == "number"){
            gl.uniform1f(location, value);
        }
        else if (value.constructor === Array && value.length == 3) {
            gl.uniform3fv(location, value);
        }
        else {
            alert('ERROR : Passing unsupported type to shader');
        }
    }

    get program()
    {
        return this._program;
    }

    get vertexSource()
    {
        return `
            attribute vec3 aPos;

            varying vec3 fragPos;

            void main() {
                gl_Position = vec4(aPos.x, aPos.y, 0.0, 1.0);
                fragPos = aPos;
            }
        `;
    }

    get fragmentSource()
    {
        return `
            precision mediump float;

            varying vec3 fragPos;

            uniform vec3 spherePos;
            uniform vec3 lightPos;
            uniform float sphereRadius;
            uniform float power;
            uniform float fractalYRotation;

            struct RayInfo {
                bool hitObject;
                vec3 finalPos;
                float minDist;
                int numOfIterations;
            };


            const int maxRayIterations = 40;
            const int maxFractalIterations = 50;

            vec3 rotateCoordsAroundY(vec3 coords, float theta)
            {
                vec3 rotatedCoords = vec3(0.0);

                rotatedCoords.x = coords.x*cos(theta) + coords.z*sin(theta); 
                rotatedCoords.y = coords.y;
                rotatedCoords.z = coords.z*cos(theta) - coords.x*sin(theta);

                return rotatedCoords;
            }

            float signedDistToSphere(vec3 p, vec3 sphereCenter, float radius)
            {
                return length(sphereCenter - p) - radius;
            }

            float mandelbulb(vec3 p, vec3 bulbPos)
            {
                vec3 z = rotateCoordsAroundY(p, fractalYRotation);
                float dr = 1.0;
                float r;
                float theta;
                float phi;
                float zr;
                //float power = 8.0;

                for (int i=0; i<maxFractalIterations; i++)
                {
                    r = length(z);
                    if (r > 2.0) {
                        break;
                    }

                    theta = acos (z.z / r) * power;
                    phi = atan(z.y, z.x) * power;
                    zr = pow(r, power);
                    dr = pow(r, power - 1.0) * power * dr + 1.0;

                    z = zr * vec3( sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta));
                    z += p;
                    //z = rotateCoordsAroundY(z, 90.0);
                }
                return 0.5 * log(r) * r / dr;
            }

            RayInfo castRay(vec3 rayPos, vec3 rayDir, float minStep)
            {
                float travelDist = 0.0;
                float minDist = 1.0;
                int numOfIterations = 0;

                //while (i < maxRayIterations && length(rayPos - vec3(0.0, 0.0, 1.7)) < 2.0)
                for (int i = 0; i < maxRayIterations; i++)
                {
                    if (length(rayPos - vec3(0.0, 0.0, 1.7)) > 2.0) {
                        break;
                    }

                    travelDist = mandelbulb(rayPos, spherePos);

                    if (travelDist < minDist) {
                        minDist = travelDist;
                    }
                    if (travelDist <= minStep)
                    {
                        return RayInfo(true, rayPos, minDist, numOfIterations);
                    }
                    rayPos += rayDir * travelDist;
                    numOfIterations++;
                }
                return RayInfo(false, rayPos, minDist, numOfIterations);
            }

            void main ()
            {
                vec3 rayDir = normalize( vec3(fragPos.x / 2. , fragPos.y / 2. , -0.5) );
                vec3 rayPos = vec3(0.0, 0.0, 1.7);
                float minStep = 0.0025;

                vec4 backgroundColor = vec4(0.6 , 0.6, 0.4, 1.0) - vec4(0.4 , 0.4, 0.25, 1.0) * (rayDir.y - 0.5);
                vec4 objectColor = vec4(0.8, 0.0, 0.0, 1.0);
                vec4 shadowColor = vec4(vec3(0.0), 1.0);


                gl_FragColor = backgroundColor;
                RayInfo ray = castRay(rayPos, rayDir, minStep);

                if (ray.hitObject == true)
                {
                    gl_FragColor = objectColor * (1.7 * float(ray.numOfIterations) / float(maxRayIterations));

                    //ray.finalPos += 0.01 * normalize(ray.finalPos - spherePos);
                    //vec3 lightDir = normalize(lightPos - ray.finalPos);
                    //RayInfo lightRay = castRay(ray.finalPos, lightDir, minStep);
//
                    //if (lightRay.hitObject == true)
                    //{
                    //    gl_FragColor = shadowColor;
                    //}
                }
                else {
                    if (ray.minDist < 2.0 * minStep) {
                        gl_FragColor = (2.0 * minStep / ray.minDist) * vec4(1.0, 0.2, 0.2, 1.);
                    }
                }
            }
        `;
    }
}