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
