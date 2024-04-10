function CreateSprite(canvas, width, height, frames = [], options = {
    right: false,
}) {
    this.options = options;
    let context = canvas.getContext("2d");

    let canvasWidth = width;
    let canvasHeight = height;

    let imageWidth = width;
    let imageHeight = height;

    const imageRatio = height / width;


    this.resize = function () {
        canvasWidth = width;
        canvasHeight = canvas.parentNode?.offsetHeight;

        if (canvasHeight > height) {
            canvasHeight = height;
        }

        if (canvasHeight < height) {
            imageHeight = canvasHeight;
            imageWidth = canvasHeight / imageRatio;
        } else {
            imageHeight = height;
            imageWidth = width;
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
    }

    this.resize();

    frames = frames.map((f) => {
        const i = new Image();
        i.src = f;
        return i;
    });

    const updateImage = index => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(frames[index], this.options.right ? canvasWidth - imageWidth : 0, canvasHeight - imageHeight, imageWidth, imageHeight);
    };

    this.queue = [];
    this.state = {};
    this.startTime = null;
    this.duration = 0;
    this.infinite = false;
    this.onTimeEvents = [];
    this.onEndEvents = [];
    this._animationRequest = null;

    this.setState = function (state) {
        this.state = state;
        return this;
    };

    this.onTime = function (time, cb) {
        this.onTimeEvents.push({
            time,
            cb,
            done: false,
        });
    };

    this.onEnd = function (cb) {
        this.onEndEvents.push(cb);
    };

    this.setQueue = function (queue) {
        this.queue = queue;
        return this;
    };

    this.play = function (duration, infinite = false) {
        if (!Number.isInteger(duration) || duration <= 0) {
            return new Error("Invalid duration")
        }
        this.state.state = "playing"
        this.duration = duration;
        this.infinite = infinite;
        this._animationRequest = requestAnimationFrame(this._draw.bind(this))
        return this;
    }

    this.stopAnimation = function () {
        cancelAnimationFrame(this._animationRequest);
        this._ended();
    }

    this._ended = function () {
        this.state.state = "stopped"
        this.startTime = null;
        this.onTimeEvents = this.onTimeEvents.map((e) => {
            e.done = false;
            return e;
        });
        this.onEndEvents.forEach((cb) => {
            if (typeof cb === 'function') {
                cb(this);
            }
        });
    }

    const ixs = frames.length - 1;

    this._draw = function (timestamp) {
        this.resize();

        if (!this.startTime) this.startTime = timestamp;

        const timePassed = timestamp - this.startTime;
        let progress = Math.round(timePassed) / this.duration;
        if (progress > 1) {
            progress = 1;
        }

        const currFrame = Math.round(ixs * progress);

        updateImage(currFrame);

        for (let i = 0; i < this.onTimeEvents.length; i++) {
            if (this.onTimeEvents[i].time <= timePassed && !this.onTimeEvents[i].done) {
                this.onTimeEvents[i].done = true;
                if (typeof this.onTimeEvents[i].cb === 'function') {
                    this.onTimeEvents[i].cb(this);
                }
            }
        }

        if (progress === 1 && this.queue[0]) {
            this.infinite = false;
            this._ended();
            return;
        }

        if (progress === 1 && this.infinite) {
            this.startTime = timestamp;
            this._animationRequest = requestAnimationFrame(this._draw.bind(this));
            return;
        }

        if (progress === 1) {
            this._ended();
            return;
        }

        this._animationRequest = requestAnimationFrame(this._draw.bind(this));
    }
}

export default CreateSprite;