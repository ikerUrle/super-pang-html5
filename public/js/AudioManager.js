class AudioManager {
  static soundtrackAudio = new Howl({
    src: ["audio/soundtrack.mp3"],
    loop: true,
    volume: 0.5
  });

  static victoryAudio = new Howl({
    src: ["audio/win.mp3"]
  });

  static gameoverAudio = new Howl({
    src: ["audio/gameover.mp3"]
  });

  static hitAudio = new Howl({
    src: ["audio/obstacle_pop.mp3"]
  });

  static playSoundtrack() {
    this.soundtrackAudio.play();
  }

  static playShoot() {
    var sound = new Howl({
      src: ["audio/shoot.mp3"],
      volume: 0.5
    }).play();
  }

  static playBallsBreak() {
    var sound = new Howl({
      src: ["audio/pop.mp3"],
      volume: 0.4
    }).play();
  }
  static playActivateBonus() {
    var sound = new Howl({
      src: ["audio/bonus.mp3"]
    }).play();
  }

  static playHit() {
    this.hitAudio.play();
  }

  static playGameover() {
    this.soundtrackAudio.pause();
    if(!this.gameoverAudio.playing()){
        this.gameoverAudio.play();
    }
  }
  static playVictory() {
    this.soundtrackAudio.pause();
    if (!this.victoryAudio.playing()) {
      this.victoryAudio.play();
    }
  }
}

export { AudioManager };
