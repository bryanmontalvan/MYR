import AFRAME from "aframe";
import * as THREE from "three";
let KEYCODE_TO_CODE = {
    "38": "ArrowUp",
    "37": "ArrowLeft",
    "40": "ArrowDown",
    "39": "ArrowRight",
    "87": "KeyW",
    "65": "KeyA",
    "83": "KeyS",
    "68": "KeyD"
};

let bind = AFRAME.utils.bind;
let shouldCaptureKeyEvent = AFRAME.utils.shouldCaptureKeyEvent;

let CLAMP_VELOCITY = 0.00001;
let MAX_DELTA = 0.2;
let KEYS = [
    "KeyW", "KeyA", "KeyS", "KeyD",
    "ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown",
    "KeySpace", "KeyLShift"
];
function isEmptyObject (keys) {
    let key;
    for (key in keys) { return false; }
    return true;
}

AFRAME.registerComponent("force-pushable", {
    schema: {
        force: { default: 10 }
    },
    init: function () {
        this.pStart = new THREE.Vector3();
        this.sourceEl = this.el.sceneEl.querySelector("#rig");
        this.el.addEventListener("click", this.forcePush.bind(this));
    },
    forcePush: function () {
        let force,
            el = this.el,
            pStart = this.pStart.copy(this.sourceEl.getAttribute("position"));

        // Compute direction of force, normalize, then scale.
        force = el.body.position.vsub(pStart);
        force.normalize();
        force.scale(this.data.force, force);

        el.body.applyImpulse(force, el.body.position);
    }
});

AFRAME.registerComponent("wasd-plus-controls", {
    schema: {
        acceleration: {default: 65},
        adAxis: {default: "x", oneOf: ["x", "y", "z"]},
        adEnabled: {default: true},
        adInverted: {default: false},
        enabled: {default: true},
        fly: {default: false},
        wsAxis: {default: "z", oneOf: ["x", "y", "z"]},
        wsEnabled: {default: true},
        wsInverted: {default: false}
    },
    
    init: function () {
        // To keep track of the pressed keys.
        this.keys = {};
        this.easing = 1.1;
    
        this.velocity = new THREE.Vector3();
    
        // Bind methods and add event listeners.
        this.onBlur = bind(this.onBlur, this);
        this.onFocus = bind(this.onFocus, this);
        this.onKeyDown = bind(this.onKeyDown, this);
        this.onKeyUp = bind(this.onKeyUp, this);
        this.onVisibilityChange = bind(this.onVisibilityChange, this);
        this.attachVisibilityEventListeners();
    },
    
    tick: function (time, delta) {
        let data = this.data;
        let el = this.el;
        let velocity = this.velocity;
    
        if (!velocity[data.adAxis] && !velocity[data.wsAxis] &&
            isEmptyObject(this.keys)) { return; }
    
        // Update velocity.
        delta = delta / 1000;
        this.updateVelocity(delta);
    
        if (!velocity[data.adAxis] && !velocity[data.wsAxis]) { return; }
    
        // Get movement vector and translate position.
        el.object3D.position.add(this.getMovementVector(delta));
    },
    
    remove: function () {
        this.removeKeyEventListeners();
        this.removeVisibilityEventListeners();
    },
    
    play: function () {
        this.attachKeyEventListeners();
    },
    
    pause: function () {
        this.keys = {};
        this.removeKeyEventListeners();
    },
    
    updateVelocity: function (delta) {
        let acceleration;
        let adAxis;
        let adSign;
        let data = this.data;
        let keys = this.keys;
        let velocity = this.velocity;
        let wsAxis;
        let wsSign;
    
        adAxis = data.adAxis;
        wsAxis = data.wsAxis;
    
        // If FPS too low, reset velocity.
        if (delta > MAX_DELTA) {
            velocity[adAxis] = 0;
            velocity[wsAxis] = 0;
            return;
        }
    
        // https://gamedev.stackexchange.com/questions/151383/frame-rate-independant-movement-with-acceleration
        let scaledEasing = Math.pow(1 / this.easing, delta * 60);
        // Velocity Easing.
        if (velocity[adAxis] !== 0) {
            velocity[adAxis] -= velocity[adAxis] * scaledEasing;
        }
        if (velocity[wsAxis] !== 0) {
            velocity[wsAxis] -= velocity[wsAxis] * scaledEasing;
        }
    
        // Clamp velocity easing.
        if (Math.abs(velocity[adAxis]) < CLAMP_VELOCITY) { velocity[adAxis] = 0; }
        if (Math.abs(velocity[wsAxis]) < CLAMP_VELOCITY) { velocity[wsAxis] = 0; }
    
        if (!data.enabled) { return; }
    
        // Update velocity using keys pressed.
        acceleration = data.acceleration;
        if (data.adEnabled) {
            adSign = data.adInverted ? -1 : 1;
            if (keys.KeyA || keys.ArrowLeft) { velocity[adAxis] -= adSign * acceleration * delta; }
            if (keys.KeyD || keys.ArrowRight) { velocity[adAxis] += adSign * acceleration * delta; }
        }
        if (data.wsEnabled) {
            wsSign = data.wsInverted ? -1 : 1;
            if (keys.KeyW || keys.ArrowUp) { velocity[wsAxis] -= wsSign * acceleration * delta; }
            if (keys.KeyS || keys.ArrowDown) { velocity[wsAxis] += wsSign * acceleration * delta; }
        }
    },
    
    getMovementVector: (function () {
        let directionVector = new THREE.Vector3(0, 0, 0);
        let rotationEuler = new THREE.Euler(0, 0, 0, "YXZ");
    
        return function (delta) {
            let rotation = this.el.getAttribute("rotation");
            let velocity = this.velocity;
            let xRotation;
    
            directionVector.copy(velocity);
            directionVector.multiplyScalar(delta);
    
            // Absolute.
            if (!rotation) { return directionVector; }
    
            xRotation = this.data.fly ? rotation.x : 0;
    
            // Transform direction relative to heading.
            rotationEuler.set(THREE.Math.degToRad(xRotation), THREE.Math.degToRad(rotation.y), 0);
            directionVector.applyEuler(rotationEuler);
            return directionVector;
        };
    })(),
    
    attachVisibilityEventListeners: function () {
        window.addEventListener("blur", this.onBlur);
        window.addEventListener("focus", this.onFocus);
        document.addEventListener("visibilitychange", this.onVisibilityChange);
    },
    
    removeVisibilityEventListeners: function () {
        window.removeEventListener("blur", this.onBlur);
        window.removeEventListener("focus", this.onFocus);
        document.removeEventListener("visibilitychange", this.onVisibilityChange);
    },
    
    attachKeyEventListeners: function () {
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    },
    
    removeKeyEventListeners: function () {
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
    },
    
    onBlur: function () {
        this.pause();
    },
    
    onFocus: function () {
        this.play();
    },
    
    onVisibilityChange: function () {
        if (document.hidden) {
            this.onBlur();
        } else {
            this.onFocus();
        }
    },
    
    onKeyDown: function (event) {
        let code;
        if (!shouldCaptureKeyEvent(event)) { return; }
        code = event.code || KEYCODE_TO_CODE[event.keyCode];
        if (KEYS.indexOf(code) !== -1) { this.keys[code] = true; }
    },
    
    onKeyUp: function (event) {
        let code;
        code = event.code || KEYCODE_TO_CODE[event.keyCode];
        delete this.keys[code];
    }
});