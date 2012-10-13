/**
 * Framework for animating DOM objects using CSS3 animations.
 * @author Diogo Costa <costa.h4evr@gmail.com>
 */
var Animator = (function () {
    "use strict";

    /* Browser prefix. */
    var browser = "";

    /* Browser prefix for JS style setters. */
    var jsBrowser = "";

    /* Where all animations are kept.*/
    var animations = {};

    /*
     * Mapping between the supported browsers and the name
     * of the animationend event.
     */
    var animationEndEventName = {
        '-moz-': 'animationend',
        '-webkit-': 'webkitAnimationEnd',
        '-o-': 'oanimationend',
        '-ms-': 'MSAnimationEnd'
    };

    /* Insert a CSS rule into a stylesheet. */
    var insertRule = function (sheet, rule) {
        try {
            sheet.insertRule(rule, sheet.cssRules.length);
        } catch (e) {
            console.error(rule);
        }
    };

    // Detect browser prefix that must be applied.
    (function () {
        var prefixes = [ '', 'Moz', 'webkit', 'o', 'ms', 'khtml' ];
        var elm = document.createElement('div');

        for (var i = 0; i < prefixes.length; ++i) {
            if (typeof(elm.style[prefixes[i] + 'AnimationName']) !== 'undefined') {
                console.log("[ANIM] Browser Prefix: " + prefixes[i]);
                browser = '-' + prefixes[i].toLowerCase() + '-';
                jsBrowser = prefixes[i];
                return;
            }
        }
    }());

    // Create a new style element for placing all the animations.
    var animationsStyle = document.createElement("style");
    animationsStyle.setAttribute("id", "animations");
    document.head.appendChild(animationsStyle);

    /**
     * Create a new animation. Can be retrieved using the "get" function.
     * @param name The name of animation, used to later retrieve it.
     * @param to A string containing the style to animate to, or a map of
     * percentages to styles (string). Percentages represent a position in the
     * timeline.
     */
    var create = function (name, to, defs) {
        var destTo = "";

        if (typeof(to) === 'string') {
            destTo = "100% { " + to + "}";
        } else {
            for (var i in to) {
                if (to.hasOwnProperty(i)) {
                    destTo += i + " { " +
                                  to[i] +
                              "} ";
                }
            }
        }

        // Add the animation rule.
        insertRule(animationsStyle.sheet, "@" + browser + "keyframes " + name + " { " + destTo + " }");

        animations[name] = {
            "animationName": name,
            "animate": animate
        };
    };

    /**
     * Bind the animation to a DOM object.
     * @param obj The DOM object to bind the animation to.
     * @param defs A map with the animation definitions:
     *  duration, times, timingFunction, delay, direction.
     * @return An object with the functions "start" and "stop".
     */
    var animate = function (obj, defs) {
        return {
            "animationName": this.animationName,
            "obj": obj,
            "defs": defs,
            "start": start,
            "stop": stop
        };
    };

    /**
     * Start an animation.
     * @param defs Optional. Definitions to override the ones provided in the
     * "animate" function.
     */
    var start = function (defs) {
        defs = defs || this.defs || {};

        var duration = defs.duration || 1,
            times = defs.times || 'infinite',
            timingFunction = defs.timingFunction || 'ease',
            delay = defs.delay || 0,
            direction = defs.direction || 'normal';

        this.obj.style[jsBrowser + 'Animation'] = this.animationName + " " +
                                                  duration + "s " +
                                                  timingFunction + " " +
                                                  delay + "s " +
                                                  times + " " +
                                                  direction;
        this.obj.style[jsBrowser + 'AnimationPlayState'] = 'running';

        var self = this;

        var onFinish = function () {
            console.log("[ANIM] " + self.animationName + " finished.");
            self.obj.removeEventListener(animationEndEventName[browser], onFinish, false);
            self.obj.style[jsBrowser + 'Animation'] = '';
            
            if (defs.finish) {
                defs.finish.call(self.obj, self);
            }
        };

        this.obj.addEventListener(animationEndEventName[browser], onFinish, false);
        
        console.log("[ANIM] " + this.animationName + " started.");
    };

    /**
     * Stop an animation. Triggers the "finish" event.
     */
    var stop = function () {
        if (this.obj.style[jsBrowser + 'AnimationName'] === this.animationName) {
            this.obj.style[jsBrowser + 'AnimationPlayState'] = 'paused';

            var finishEvent = document.createEvent('Event');
            finishEvent.initEvent(animationEndEventName[browser], true, true);
            this.obj.dispatchEvent(finishEvent);
            
            console.log("[ANIM] " + this.animationName + " stopped.");
        }
    };

    /**
     * Retrieve an animation by its name.
     * @param name The animation's name.
     * @return The animation object.
     */
    var get = function (name) {
        return animations[name];
    };

    return {
        "create": create,
        "get": get
    };
}());

window.Animator = Animator;
