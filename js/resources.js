/*
This is simple an image loading utility. It eases the process of loading
image files so that they can be used within your game. It also includes
a simple "caching" layer so it will reuse cached images if you attempt
to load the same image multiple times.
*/
(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

/*
This is the publicly accessible image loading function. It accepts
an array of strings pointing to image files or a string for a single
image. It will then call our private image loading function accordingly.
*/
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {

            //pass in an array of images
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        }
            //if there is no array, call the image loader directly.
        else {
            _load(urlOrArr);
        }
    }

    //This is our private image loader function, it is called by 
    //the public image loader function.
    function _load(url) {
        if(resourceCache[url]) {

            //return previously loaded image from resourseCache array.
            return resourceCache[url];
        }

        else {

            //if an image is not in the resourseCache array load image.
            var img = new Image();
            img.onload = function() {

                //cache the properly loaded image
                resourceCache[url] = img;

                //call all of the onReady() callbacks we have defined.
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };

            //Set the initial cache value to false.
            //point the images src attribute to the passed-in URL.
            resourceCache[url] = false;
            img.src = url;
        }
    }

    //this is the same as calling load() for cached images.
    function get(url) {
        return resourceCache[url];
    }

    //checks if all the images requested, have been loaded.
    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
                !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    //This function will add a function to the callback stack that is called
    //when all requested images are properly loaded.
    function onReady(func) {
        readyCallbacks.push(func);
    }

    //This object defines the publicly accessible functions available to
    //developers by creating a global Resources object.
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();

//asigns audio to sounds in an array.
var sounds = [
    new Audio('audio/electroBoing.mp3'),
    new Audio('audio/failBoing.mp3'),
    new Audio('audio/ooweee.mp3'),
    new Audio('audio/upBoing.mp3'),
    new Audio('audio/walking.mp3'),
    new Audio('audio/Frogschirping.mp3'),
    new Audio('audio/yeaahh.mp3')
];