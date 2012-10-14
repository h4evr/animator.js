# Animator.js

A CSS3-powered library for Javascript. 

Made specially for mobile programming, it has a small footprint: **only 1.9kB**, when minified!
There is, however, no fallback mechanism in case the browser does not support CSS3 animations.

## Usage Example

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

## Browser Compatibility

Animator.js was tested on the following browsers:

  - Mozilla Firefox 16
  - Chromium 22
  - Dolphin Browser Mini @ Android 2.3
  - Opera Mobile @ Android 2.3

You can contribute by testing it on other browsers and platforms. 
Then let me know how it went so that I can update this list!

## Documentation

### Animator

* * *
**`create`**

Create a new animation that can be later retrieved using the `get` function.

  - **name**: The name of animation, used to later retrieve it.
  - **to**: 
    A string containing the style to animate to, or a map of percentages to styles (string). 
    Percentages represent a position in the timeline.
  - **defs**: An object with the animation's default definitions:
    - **duration**: The duration of the animation, in seconds.
    - **times**: How many iterations.
    - **timingFunction**: specifies the speed curve of the animation.
      - **linear**:	The animation has the same speed from start to end.
      - **ease**: Default. The animation has a slow start, then fast, before it ends slowly.
      - **ease-in**: The animation has a slow start.
      - **ease-out**: The animation has a slow end.
      - **ease-in-out**: The animation has both a slow start and a slow end.
      - **cubic-bezier(n,n,n,n)**: Define your own values in the cubic-bezier function. Possible values are numeric values from 0 to 1.
    - **delay**: Seconds to wait before starting the animation.
    - **direction**: defines whether or not the animation should play in reverse on alternate cycles.
      - **normal**: Default value. The animation should be played as normal
      - **alternate**: The animation should play in reverse on alternate cycles.
    - **finish**: A function to be called when the animation ends or is stopped by the `stop` function.
    - **Returns**: An Animation object, with the `animate` function.

* * *
**`get`**

Retrieve an animation by its name.

  - **name**: The name of the animation.
  - **Returns**: An Animation object, with the `animate` function.

* * *
### Animation
**`animate`**

Bind an animation to a DOM object.

  - **obj**: The DOM object to bind the animation to or its id.
  - **defs**: Map with definitions of the animation for this binding. 
              Complements the animation default definitions. 
              Check the `create` function for the accepted options.
  - **Returns:** An object with the `start` and `stop` functions. See below.

* * *
**`start`**

Start an animation.

  - **defs**: Map with definitions of the animation for this specific animation. 
              Complements the animation default definitions and the binding ones. 
              Check the `create` function for the accepted options.
  - **Returns:** `this`, in order to support method chaining.

* * *
**`stop`**

Stop an animation. Triggers the `finish` function, if one was specified.

  - **Returns:** `this`, in order to support method chaining.
