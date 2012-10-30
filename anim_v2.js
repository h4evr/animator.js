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
            alert(rule);
        }
    };

    // Detect browser prefix that must be applied.
    (function () {
        var prefixes = [ '', 'Moz', 'webkit', 'o', 'ms', 'khtml' ];
        var elm = document.createElement('div');

        for (var i = 0; i < prefixes.length; ++i) {
            if (typeof(elm.style[prefixes[i] + 'AnimationName']) !== 'undefined') {
                browser = '-' + prefixes[i].toLowerCase() + '-';
                jsBrowser = prefixes[i];
                return;
            }
        }
    }());

    // Create a new style element for placing all the animations.
   /* var animationsStyle = document.createElement("style");
    animationsStyle.setAttribute("id", "animations");
    document.head.appendChild(animationsStyle);*/

    var extend = function (o1, o2) {
        var res = {},
            k;
        
        o2 = o2 || {};
        for (k in o2) {
            if (o2.hasOwnProperty(k)) {
                res[k] = o2[k];
            }
        }

        o1 = o1 || {};
        for (k in o1) {
            if (o1.hasOwnProperty(k)) {
                res[k] = o1[k];
            }
        }

        return res;
    };

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

        animations[name] = {
            "animationName": name,
            "animate": animate,
            "defs": defs,
			"destTo": destTo
        };

        return animations[name];
    };

    /**
     * Bind the animation to a DOM object.
     * @param obj The DOM object to bind the animation to.
     * @param defs A map with the animation definitions:
     *  duration, times, timingFunction, delay, direction.
     * @return An object with the functions "start" and "stop".
     */
    var animate = function (obj, defs) {
        if (!obj) {
            throw new TypeError("obj must be a string or a DOMObject");
        }

        if (typeof(obj) === 'string') {
            obj = document.getElementById(obj);
        }

		var name = this.animationName + obj.id;
		defs = extend(defs, this.defs);
		
		// Add the animation rule.
		var styleSheet = document.createElement("style");
		document.head.appendChild(styleSheet);
        
        return {
            "animationName": name,
            "obj": obj,
            "defs": defs,
            "start": start,
            "stop": stop,
			"autoDestroy": defs.autoDestroy || true,
			"animSheet": styleSheet,
			"destTo": this.destTo
        };
    };

    /**
     * Start an animation.
     * @param defs Optional. Definitions to override the ones provided in the
     * "animate" function.
     */
    var start = function (defs) {
        defs = extend(defs, this.defs);

        var duration = defs.duration || 1,
            times = defs.times || 'infinite',
            timingFunction = defs.timingFunction || 'ease',
            delay = defs.delay || 0,
            direction = defs.direction || 'normal';

		var vars = defs.vars;		
		
		var destTo = this.destTo;
		
		if (vars) {
			for (var k in vars)	{
				if (vars.hasOwnProperty(k)) {
					destTo = destTo.replace("%" + k + "%", vars[k]);
				}
			}	
		}
		
		this.animSheet.textContent = "@" + browser + "keyframes " + this.animationName + " { " + destTo + " }";
		
        this.obj.style[jsBrowser + 'Animation'] = this.animationName + " " +
					                              duration + "s " +
					                              timingFunction + " " +
					                              delay + "s " +
					                              times + " " +
					                              direction;
					                              
        this.obj.style[jsBrowser + 'AnimationPlayState'] = 'running';
        this.obj.style[jsBrowser + 'AnimationFillMode'] = 'forwards';
        this.obj.style[jsBrowser + 'BackfaceVisibility'] = 'hidden';
        this.obj.style[jsBrowser + 'Perspective'] = '1000';

		var self = this;
        var onFinish = function () {
            self.obj.removeEventListener(animationEndEventName[browser], onFinish, false);
            self.obj.style[jsBrowser + 'Animation'] = '';

			if (self.autoDestroy) {
				document.head.removeChild(self.animSheet);
				self.animSheet = null;
			}            
            
            if (defs.finish) {
                defs.finish.call(self.obj, self);
            }
        };

        self.obj.addEventListener(animationEndEventName[browser], onFinish, false);

        return this;
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
        }

        return this;
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
        "get": get,
        "getPrefix": function (js) {
        	if (js) {
        		return jsBrowser;
        	} else {
        		return browser;
        	}
        }
    };
}());

window.Animator = Animator;

// Hack for easier access to the head node.
document.head = document.head || document.getElementsByTagName('head')[0];