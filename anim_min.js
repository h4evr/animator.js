var Animator=function(){"use strict";var animCounter=0;var ANIM_NAME="animation";var browser="";var jsBrowser="";var animations={};var animationEndEventName={"-moz-":"animationend","-webkit-":"webkitAnimationEnd","-o-":"oanimationend","-ms-":"MSAnimationEnd"};var insertRule=function(sheet,rule){try{sheet.insertRule(rule,sheet.cssRules.length)}catch(e){console.error(rule)}};(function(){var prefixes=["","Moz","webkit","o","ms","khtml"];var elm=document.createElement("div");for(var i=0;i<prefixes.length;++i){if(typeof elm.style[prefixes[i]+"AnimationName"]!=="undefined"){console.log("[ANIM] Browser Prefix: "+prefixes[i]);browser="-"+prefixes[i].toLowerCase()+"-";jsBrowser=prefixes[i];return}}})();var animationsStyle=document.createElement("style");animationsStyle.setAttribute("id","animations");document.head.appendChild(animationsStyle);var create=function(name,to,defs){var destTo="";if(typeof to==="string"){destTo="100% { "+to+"}"}else{for(var i in to){if(to.hasOwnProperty(i)){destTo+=i+" { "+to[i]+"} "}}}insertRule(animationsStyle.sheet,"@"+browser+"keyframes "+name+" { "+destTo+" }");animations[name]={animationName:name,animate:animate}};var animate=function(obj,defs){return{animationName:this.animationName,obj:obj,defs:defs,start:start,stop:stop}};var start=function(defs){defs=defs||this.defs||{};var duration=defs.duration||1,times=defs.times||"infinite",timingFunction=defs.timingFunction||"ease",delay=defs.delay||0,direction=defs.direction||"normal";this.obj.style[jsBrowser+"Animation"]=this.animationName+" "+duration+"s "+timingFunction+" "+delay+"s "+times+" "+direction;this.obj.style[jsBrowser+"AnimationPlayState"]="running";var self=this;var onFinish=function(){console.log("[ANIM] "+self.animationName+" finished.");self.obj.removeEventListener(animationEndEventName[browser],onFinish,false);self.obj.style[jsBrowser+"Animation"]="";if(defs.finish){defs.finish.call(self.obj,self)}};this.obj.addEventListener(animationEndEventName[browser],onFinish,false);console.log("[ANIM] "+this.animationName+" started.")};var stop=function(){if(this.obj.style[jsBrowser+"AnimationName"]===this.animationName){this.obj.style[jsBrowser+"AnimationPlayState"]="paused";var finishEvent=document.createEvent("Event");finishEvent.initEvent(animationEndEventName[browser],true,true);this.obj.dispatchEvent(finishEvent);console.log("[ANIM] "+this.animationName+" stopped.")}};var get=function(name){return animations[name]};return{create:create,get:get}}();window.Animator=Animator