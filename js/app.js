//Random number giving a maximum and a minimum.
var random = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

//assigning the heart image to the variable heart.
var heart = '<img src = "images/item-1.png">';

//assigning a random bug(enemy) to diplay, setting speed,
//color and starting point.
var Enemy = function () {
    this.type = random(1, 4);
    this.sprite = 'images/enemy-bug-' + this.type + '.png';
    this.x = this.type * -101;
    this.y = random(0, 4) * 83 + 62;
    this.speed = this.type * 100;
};

//enemy quantity and position updated.
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    var length = allEnemies.length;
    for (var enemy = 0; enemy < length; enemy ++) {
        if (allEnemies[enemy].x > 707) {
            allEnemies.splice(enemy, 1, new Enemy());
        }
    }

    if (length < 4 + Math.floor(player.level / 5)) {
        allEnemies.push(new Enemy());
    }
    else if (length > 4 + Math.floor(player.level / 5)) {
        allEnemies.pop();
    }
};

//renders(draws) the enemy image(spite) on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//setting an array of four enemys at start of game.
var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];

//constructor, placing one of the four items(sprite) randomly,
//a player can "collect" to score or add a life.
var Item = function() {
    this.type = random(1, 6);
    this.sprite = 'images/item-' + this.type + '.png';
    this.x = random(0, 7) * 101;
    this.y = random(0, 4) * 83 + 55;
};

//Draws the sprite from Item on screen
Item.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//constructor method assigning a new Item to item
var item = new Item();

//the sprite for the player is placed in a random location in the
//grass(bottom row). a score of 0(zero) and level 1 are set.
//the three hearts are placed on screen showing the number of lives.
var Player = function (type) {
    this.type = type;
    this.sprite = 'images/char-' + this.type + '.png';
    this.x = random(0, 7) * 101;
    this.y = 402;
    this.exit = random(0, 7);
    this.level = 1;
    this.score = 0;
    this.lives = [heart, heart, heart];
    this.paused = false;
};

//collision checking with "pop or push" to change the number of lives.
Player.prototype.update = function() {

    var length = allEnemies.length;
    for (var enemy = 0; enemy < length; enemy ++) {

        if (Math.abs(allEnemies[enemy].x - this.x) < 50 &&
            Math.abs(allEnemies[enemy].y - this.y) < 66) {

            if (this.type === 1) {//if an Item is collected a
                sounds[1].play();//sound is played from the sound array.
            }

            else {
                sounds[0].play();
            }

            this.lives.pop();
            this.reset();
        }
    }

	//collision check, if player collides with the item,
	//play sound, update score or heart
    if (Math.abs(item.x - this.x) < 50 && Math.abs(item.y - this.y) < 66) {

        if (item.type === 1) {
            sounds[3].play();
            this.lives.push(heart);//a heart will be added to the lives.
        }

        if (item.type === 5) {
            sounds[1].play();
            this.score -= item.type * 100;

            if (this.score < 0){
              this.score = 0;
            }
        }

        else {
            sounds[2].play();
            this.score += item.type * 100;
        }

        item.x = -101;
    }

    else if (this.y < 45) {

    	//if player collides(crosses) with the bridge, increase level,
    	//play a sound and reset Player and Item.
        if (Math.abs(this.exit * 101 - this.x) < 50) {
            sounds[4].play();
            this.level ++;
            item = new Item();
        }
        //if player collides with water decrease level and reset.
        else {
            sounds[5].play();
            this.lives.pop();//a life is removed.
        }

        this.reset();
    }
};

//draws "Player" sprite
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//keyboard input moves player, changes player sprite, pauses or quits game
Player.prototype.handleInput = function (keycode) {

    if (keycode === 'up' && this.y > 44 && !this.paused) {
        this.y -= 83;
    }

    else if (keycode === 'down' && this.y < 377 && !this.paused) {
        this.y += 83;
    }

    else if (keycode === 'left' && this.x > 83 && !this.paused) {
        this.x -= 101;
    }

    else if (keycode === 'right' && this.x < 606 && !this.paused) {
        this.x += 101;
    }

    else if (keycode === 'c') {
        if (this.type === 4) {
            this.type = 1;
        }

        else {
            this.type ++;
        }

        this.sprite = 'images/char-' + this.type + '.png';
    }

    else if (keycode === 'q') {
        this.paused = true;
        var quit = confirm('Press OK to quit or CANCEL to resume.');

        if (quit) {
            window.close();
        }

        else {
            this.paused = false;
        }
    }

    else if (keycode === 'p') {
        if (this.paused) {
            this.paused = false;
        }

        else {
            this.paused = true;
        }
    }
};


//constructor method assigning a new Player to player
var player = new Player(1);

//player is reset or "Game Over" conformation to play again or quit.
//hearts go to zero, plays a sound, if cancel is selected browser window is closed.
Player.prototype.reset = function () {

    if (this.lives.length === 0) {
        document.getElementsByClassName('lives')[0].innerHTML = 'Lives:  ' + this.lives;
        sounds[6].play();
        var gameOver = confirm('Game Over!  Press OK to play again or CANCEL to quit.');

        if (gameOver) {
            player = new Player(this.type);
        }

        else {
            window.close();
        }
    }

    this.x = random(0, 7) * 101;
    this.y = 402;
    ctx.clearRect(this.exit * 101, 0, 101, 171);
    this.exit = random(0, 7);
};

//if one of these keys are detected moves to Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        80: 'p',
        67: 'c',
        81: 'q'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
