class AnimatedParameter {
    constructor(middleValue, deviation, speed, paused, animationFunction)
    {
        if (animationFunction==undefined) {
            this._animationFunction = function(time, scale) {
                return Math.sin(scale * time);
            }
        } else {
            this._animationFunction = animationFunction;
        }
        if (paused==undefined) {
            this._paused = false;
        }
        this._startTime = 0;
        this._timeElaspedWhilePaused = 0;
        this._timeElasped = 0;
        this._paused = paused;
        this._middleValue = middleValue;
        this._deviation = deviation;
        this._speed = speed;
        this._currentValue = middleValue;
    }
    updateValue(currentTime) {
        if (this._paused) {
            this._timeElaspedWhilePaused = currentTime - this._startTime;
            return;
        }

        this._timeElasped = currentTime - this._startTime;
        var perturbation = this._deviation * this._animationFunction(this._timeElasped, this._speed);
        this._currentValue = this._middleValue + perturbation;
    }
    pause() {
        this._paused = true;
    }
    play() {
        this._paused = false;
        this._startTime += (this._timeElaspedWhilePaused - this._timeElasped);
        this._timeElaspedWhilePaused = 0;
    }
    get value() {
        return this._currentValue;
    }
    set value(newValue) {
        this._currentValue = newValue;
    }
    get paused() {
        return this._paused;
    }
}