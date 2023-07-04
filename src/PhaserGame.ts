import Phaser from 'phaser';

import { Bootstrap, Game } from './scenes'

var game:any;

export function loadScene() {
  const config  = {
    type: Phaser.AUTO,
    parent: 'phaser-container',
    backgroundColor: '#282c34',
    scale: {
      mode: Phaser.Scale.ScaleModes.RESIZE,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: true
      },
    },
    pauseOnBlur: false,
    scene: [Bootstrap, Game],
  }
  
  game = new Phaser.Game(config);
}

export function startGame() {
  (game.scene.getScene('game') as Game).startGame();
}
