/**
 * @class boot
 * A Phaser scene
 */
var Phaser = require('phaser'),
  game = require('../game');

module.exports = {

  preload: function () {

    // add any images for the pre-loader here
    game.analytics.trackEvent('scene', 'preload', 'boot');
    game.load.spritesheet('dude', '/assets/dude.png', 32, 48);
    game.load.image('bg', 'assets/bg.jpg');
    game.load.image('horizontal', 'assets/platform.png');
    game.load.image('vertical', 'assets/vertical.png');

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
