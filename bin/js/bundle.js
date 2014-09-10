(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @class base
 * This is the root file for the Phaser Boilerplate. All other files are included from this one.
 **/

var game = require('./game'),
    boot = require('./scenes/boot.js'),
    preloader = require('./scenes/preloader'),
    mainMenu = require('./scenes/mainMenu'),
    mainGame = require('./scenes/mainGame'),
    Analytics = require('./classes/Analytics.js');

// set the default language
game.language = "en";

// add add states
game.state.add('boot', boot, false);
game.state.add('preloader', preloader, false);
game.state.add('mainMenu', mainMenu, false);
game.state.add('mainGame', mainGame, false);

game.analytics = new Analytics("hello-world");

// kick off the game
game.state.start('boot');

},{"./classes/Analytics.js":2,"./game":4,"./scenes/boot.js":6,"./scenes/mainGame":7,"./scenes/mainMenu":8,"./scenes/preloader":9}],2:[function(require,module,exports){
/**
 * @class Analytics
 * A wrapper around Google Analytics
 */
/*globals ga*/

var Analytics = function (category) {

  if (!category) {
    throw new this.exception("No category defined");
  }

  this.active = (window.ga) ? true : false;
  this.category = category;
};

Analytics.prototype.trackEvent = function (action, label, value) {
  if (!this.active) {
    return;
  }

  if (!action) {
    throw new this.exception("No action defined");
  }

  if (value) {
    window.ga('send', this.category, action, label, value);
  } else if (label) {
    window.ga('send', this.category, action, label);
  } else {
    window.ga('send', this.category, action);
  }

};

Analytics.prototype.exception = function (message) {
  this.message = message;
  this.name = "AnalyticsException";
};

module.exports = Analytics;

},{}],3:[function(require,module,exports){
(function (global){
/**
 * @class Label
 * An extention to the text class, that adds some default styling
 *
 * @extends Phaser.Text
 */
var Phaser = (typeof window !== "undefined" ? window.Phaser : typeof global !== "undefined" ? global.Phaser : null),
  game = require('../game');

/**
 * @constructor
 *
 * @param x {Number} Horizontal position
 * @param y {Number} Verticle position
 * @param textContext {String} The text to display
 * @param fontStyle {Object} Optional style of the text
 */
var Label = function (x, y, textContent, fontStyle) {

  // set a basic style
  var style = fontStyle || {
    font: '30px Arial',
    fill: '#4488cc',
    align: 'center'
  };

  // call the superclass method
  Phaser.Text.call(this, game, x, y, textContent, style);
  this.anchor.setTo(0.5, 0.5);

};

Label.prototype = Object.create(Phaser.Text.prototype);
Label.prototype.constructor = Label;

module.exports = Label;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../game":4}],4:[function(require,module,exports){
(function (global){
/**
 * @class game
 * This is used to store a reference to the Phaser game object
 **/
var Phaser = (typeof window !== "undefined" ? window.Phaser : typeof global !== "undefined" ? global.Phaser : null);

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', null);

module.exports = game;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
/**
 * @class locale
 * A simple object to store translations for each language requred
 */
module.exports = {
  "en": {
    "boot": {
      "labelTitle": "Loading..."
    },
    "mainMenu": {
      "labelTitle": "CLICK TO START!\n\nPLAYER 1: Control the onion head\nwith the up, down, left, and right arrow keys.\n\nPLAYER 2: Control the girl with\nthe A, W, S, and D keys."
    },
    // "mainGame": {
    //   "labelTitle": "Play my game!"
    // }
  }
};

},{}],6:[function(require,module,exports){
(function (global){
/**
 * @class boot
 * A Phaser scene
 */
var Phaser = (typeof window !== "undefined" ? window.Phaser : typeof global !== "undefined" ? global.Phaser : null),
  game = require('../game');

module.exports = {

  preload: function () {

    // add any images for the pre-loader here
    game.analytics.trackEvent('scene', 'preload', 'boot');
    game.load.spritesheet('dude', '/assets/dude.png', 32, 48);
    game.load.image('bg', 'assets/bg.jpg');
    game.load.image('horizontal', 'assets/platform.png');
    game.load.image('vertical', 'assets/vertical.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('player', 'assets/player.png', 96, 130);
  },

  create: function () {

    game.analytics.trackEvent('scene', 'create', 'boot');

    // max number of fingers to detect
    this.input.maxPointers = 1;

    // auto pause if window looses focus
    this.stage.disableVisibilityChange = true;

    if (game.device.desktop) {
      this.stage.scale.pageAlignHorizontally = true;
    }
    
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setScreenSize();

    game.state.start('preloader', true, false);
  }

};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../game":4}],7:[function(require,module,exports){
/**
 * @class mainGame
 * A Phaser scene
 */
var game = require('../game'),
  localisation = require('../locale'),
  Label = require('../classes/label');

var cursors, player, player2, stars, platforms, ledge;

var create = function() {
    game.analytics.trackEvent('scene', 'create', 'mainGame');

    game.stage.backgroundColor = '#ffecb3';
    game.physics.startSystem(Phaser.Physics.ARCADE);

    platforms = game.add.group();

    platforms.enableBody = true;

    var horizontalCoordinates = [
        [0, 60],
        [60, 140],
        [0, 220],
        [180, 500],
        [440, 520],
        [180, 420],
        [-80, 500],
        [260, 60],
        [260, 260],
        [260, 340],
        [520, 260],
        [520, 340],
        [440, 180],
        [700, 80],
        [600, 420],
    ];

    var verticalCoordinates = [
        [180, 220],
        [180, 500],
        [440, 260],
        [520, 340],
        [640, 520],
        [720, 520],
        [260, 140],
        [260, -120],
        [100, 300],
        [20, 300],
        [340, 60],
        [520, -80],
        [620, 0],
        [700, 80],
    ];

    for (i = 0; i < horizontalCoordinates.length; i++) {
        ledge = platforms.create(horizontalCoordinates[i][0], horizontalCoordinates[i][1], 'horizontal');
        ledge.body.immovable = true;
    }

    for (i = 0; i < verticalCoordinates.length; i++) {
        ledge = platforms.create(verticalCoordinates[i][0], verticalCoordinates[i][1], 'vertical');
        ledge.body.immovable = true;
    }

    stars = game.add.group();

    stars.enableBody = true;

    var star = stars.create(10, 10, 'star');
    star.body.immovable = true;

    star = stars.create(770, 570, 'star');
    star.body.immovable = true;

    player = game.add.sprite(0, 0, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0;
    player.body.gravity.y = 0;
    player.body.collideWorldBounds = true;
    player.animations.add('walk');
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    player.animations.add('up', [0], 10, true);
    player.animations.add('down', [0], 10, true);

    player2 = game.add.sprite(0, 0, 'player');
    player2.scale.setTo(0.4, 0.4);
    game.physics.arcade.enable(player2);
    player2.body.bounce.y = 0;
    player2.body.gravity.y = 0;
    player2.body.collideWorldBounds = true;
    player2.animations.add('walk');
    cursors = game.input.keyboard.createCursorKeys();
};

var update = function() {
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(player2, platforms);

    player.body.velocity.x = 0;
    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
        player.animations.play('right');
    } else if (cursors.up.isDown) {
        player.body.velocity.y = -150;
        player.animations.stop();
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 150;
        player.animations.stop();
    } else {
        player.body.velocity.y = 0;
        player.animations.stop();
        player.frame = 4;
    }

    var left2 = game.input.keyboard.addKey(Phaser.Keyboard.A);
    var right2 = game.input.keyboard.addKey(Phaser.Keyboard.D);
    var up2 = game.input.keyboard.addKey(Phaser.Keyboard.W);
    var down2 = game.input.keyboard.addKey(Phaser.Keyboard.S);

    if (left2.isDown) {
        player2.body.velocity.x = -150;
        player2.animations.play('walk');
    } else if (right2.isDown) {
        player2.body.velocity.x = 150;
        player2.animations.play('walk');
    } else if (up2.isDown) {
        player2.body.velocity.y = -150;
        player2.animations.stop();
    } else if (down2.isDown) {
        player2.body.velocity.y = 150;
        player2.animations.stop();
    } else {
        player2.body.velocity.y = 0;
        player2.animations.stop();
        player2.frame = 4;
    }

    var restartKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
    if (restartKey.isDown) {
      restartGame();
    }
    
};

var restartGame = function() {
  game.analytics.trackEvent('scene', 'create', 'restartGame');

   game.state.start('mainMenu');
}

module.exports = {
  create: create,
  update: update,
  restartGame: restartGame, 
};

},{"../classes/label":3,"../game":4,"../locale":5}],8:[function(require,module,exports){
(function (global){
/**
 * @class mainMenu
 * A Phaser scene
 */
var Phaser = (typeof window !== "undefined" ? window.Phaser : typeof global !== "undefined" ? global.Phaser : null),
  game = require('../game'),
  localisation = require('../locale'),
  Label = require('../classes/label');

module.exports = {

  create: function () {

    game.analytics.trackEvent('scene', 'create', 'mainMenu');

    var tween,
      style = {
        font: '24px Montserrat',
        fill: '#ffffff',
        align: 'center'
      };

    // set the background colour
    game.stage.backgroundColor = '#000000';
    game.add.sprite(0, 0, 'bg');

    // add a label based on our custom class
    this.labelTitle = new Label(game.width * 0.5, game.height * 0.5, localisation[game.language].mainMenu.labelTitle, style);
    this.labelTitle.alpha = 0;
    game.add.existing(this.labelTitle);

    // fade the label in
    tween = this.add.tween(this.labelTitle);
    tween.to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
    tween.onComplete.add(this.addPointerEvents, this);
  },

  addPointerEvents: function () {
    
    // add an input listener
    this.input.onDown.addOnce(this.startGame, this);
  },

  startGame: function () {
    
    // go to the main game scene
    game.state.start('mainGame', true, false);
  }

};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../classes/label":3,"../game":4,"../locale":5}],9:[function(require,module,exports){
(function (global){
/**
 * @class preloader
 * A Phaser scene
 */
var Phaser = (typeof window !== "undefined" ? window.Phaser : typeof global !== "undefined" ? global.Phaser : null),
  game = require('../game');

module.exports = {

  preload: function () {

    game.analytics.trackEvent('scene', 'preload', 'preloader');

    game.stage.backgroundColor = '#000000';

    var bmd = game.add.bitmapData(game.width, game.height);
    bmd.context.fillStyle = '#fff';
    bmd.context.fillRect(0, game.height - 10, game.width, 10);
    bmd.dirty = true;

    this.loadingBar = this.add.sprite(game.world.centerX, game.world.centerY, bmd);
    this.load.setPreloadSprite(this.loadingBar);

    // load any other assets here
  },

  create: function () {

    game.analytics.trackEvent('scene', 'create', 'preloader');

    var tween = this.add.tween(this.loadingBar)
      .to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
    tween.onComplete.add(this.startMainMenu, this);
  },

  startMainMenu: function () {
    game.state.start('mainMenu', true, false);
  }

};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../game":4}]},{},[1])