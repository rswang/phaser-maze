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
    "mainMenu": {
      "labelTitle": "Click to continue"
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

module.exports = {

  create: function () {

    game.analytics.trackEvent('scene', 'create', 'mainGame');

    game.stage.backgroundColor = '#fff';
    
    // add sprite
    var player = game.add.sprite(300, 200, 'dude');

    //  Here we add a new animation called 'walk'
    //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
    player.animations.add('walk');
    
    //  And this starts the animation playing by using its key ("walk")
    //  30 is the frame rate (30fps)
    //  true means it will loop when it finishes
    player.animations.play('walk', 20, true);

    // this.labelTitle = new Label(game.width * 0.5, game.height * 0.5, localisation[game.language].mainGame.labelTitle);
    // game.add.existing(this.labelTitle);

  },

  update: function () {
    // add your game loop code here

  },

  restartGame: function () {

    game.analytics.trackEvent('scene', 'create', 'restartGame');

    game.state.start('mainMenu');
  }

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
        font: '30px Arial',
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