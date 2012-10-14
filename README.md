Animator.js
===========

A CSS3-powered library for Javascript. 

Made specially for mobile programming, it has a small footprint: **only 1.8kB**, when minifyed!
There is, however, no fallback mechanism in case the browser does not support CSS3 animations.

Usage Example
-------------

Create an animation:

    Animator.create('fade', {
        "0%": "opacity:0;",
        "100%": "opacity:1;"
    });

Retrieve it by name and bind it to an object, specifying the duration, how many times
it must run and a function that must be called when the animation finishes:

    var anim = Animator.get('fade').animate('obj1', { 
        duration: 1, 
        times: 1,
        finish: function () {
            console.log("[ANIM] on finish called!");
        }
    });

And finally, start it!

    anim.start();

You can stop it any time using:

    anim.stop();

Check the `index.html` file for a complete example, including chaining animations.

Documentation
-------------

To-Do :)


