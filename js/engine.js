//This engine is available globally via the Engine variable and it also makes
//the canvas' context (ctx) object globally available to make writing app.js
//a little simpler to work with.

//A game engine works by drawing the entire game screen over and over.
//When your player moves across the screen, it may look like just that
//image/character is moving or being drawn but that is not the case.
//What's really happening is the entire "scene" is being drawn over
//and over, presenting the illusion of animation.

//Variables to be used in this scope.
//the canvas element and 2D context
var Engine = (function(global) {

    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 707;
    canvas.height = 606;
    doc.body.appendChild(canvas);

//starting point the the game loop. create a constant value "dt"
//for the smooth operation of the game.
    function main() {

        //define the constant "dt"
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        //when in-play, the time delta is passed to function update.
        if (!player.paused) {
            update(dt);
            render();
        }

        //lastTime is passed the value now.
        lastTime = now;

        //draw another frame in the browser.
        win.requestAnimationFrame(main);
    };

    //initializing the lastTime needed for the game loop.
    function init() {
        lastTime = Date.now();
        main();
    }

    //the main function calls this function to update an entity's data.
    function update(dt) {
        updateEntities(dt);
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        player.update();
    }

    //This function initially draws the 'game level', it will then call
    //the renderEntities function. This function is called every
    //game tick (or loop of the game engine).
    //then sets the initial header.
    function render() {

        document.getElementsByClassName('lives')[0].innerHTML = 'Lives:  ' +
        player.lives.join(' ');
        document.getElementsByClassName('level')[0].innerHTML = 'Level:  ' +
        player.level;
        document.getElementsByClassName('score')[0].innerHTML = 'Score:  ' +
        player.score;

        //Image array used to set the floor, or background.
        var rowImages = [
                'images/water-block.png',
                'images/grass-lite-block.png',
                'images/grass-block.png',
                'images/grass-dark-block.png',
                'images/grass-block.png',
                'images/stone-block.png',
                'images/stone-block.png'
            ],

            numRows = 6,
            numCols = 7,
            row, col;

        //drawing the background image, using the rowImage array as defined
        //by the numRows and numCols values.
        //placing the bridge image randomly, inplace of one of the water images.
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                if (row == 0 && col == player.exit) {
                    ctx.drawImage(Resources.get('images/bridge.png'), col * 101, row * 83);
                }

                else {
                    ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
                }
            }
        }

        renderEntities();
    }

    //in each loop or tick this defines(renders) the player, enemys and items in the app.js
    function renderEntities() {

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
        item.render();
    }

    //loads all the images needed to draw the game
    Resources.load([
        'images/water-block.png',
        'images/grass-lite-block.png',
        'images/grass-block.png',
        'images/grass-dark-block.png',
        'images/stone-block.png',
        'images/bridge.png',
        'images/enemy-bug-1.png',
        'images/enemy-bug-2.png',
        'images/enemy-bug-3.png',
        'images/enemy-bug-4.png',
        'images/char-1.png',
        'images/char-2.png',
        'images/char-3.png',
        'images/char-4.png',
        'images/item-1.png',
        'images/item-2.png',
        'images/item-3.png',
        'images/item-4.png',
        'images/item-5.png'
    ]);
    Resources.onReady(init);

    /*
     Assign the canvas' context object to the global variable (the window
     object when run in a browser) so that developers can use it more
     easily from within their app.js files.
    */
     global.ctx = ctx;
})(this);
