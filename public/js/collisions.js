import { Vec2D } from "./math.js";
import Settings from "./Settings.js";
import { Ball } from "./Ball.js";
import { BonusType, Bonus } from "./Bonus.js";
import { AudioManager } from "./AudioManager.js";

class CollisionManager {
  constructor(hooks, balls, ballFactory, bonuses, bonusFactory, player) {
    this.hooks = hooks;
    this.balls = balls;
    this.bonuses = bonuses;
    this.ballFactory = ballFactory;
    this.bonusFactory = bonusFactory;
    this.player = player;
  }

  checkCollisions() {
    this.balls.forEach(ball => {
      if (ball_to_box(ball, this.player)) {
        if (!this.player.inmune) {
          if (this.player.bonuses.has(BonusType.invulnerability)) {
            this.player.inmune = true;
            this.player.bonuses.delete(BonusType.invulnerability);
            window.setTimeout(() => {
              this.player.inmune = false;
            }, 3000);
          } else {
            this.player.hit = true;
            AudioManager.playHit();
          }
        }
      }
    });
    this.hooks.forEach(hook => {
      this.balls.forEach(ball => {
        if (ball_to_box(ball, hook, false)) {
          this.balls.delete(ball);
          this.hooks.delete(hook);
          AudioManager.playBallsBreak();

          var splitBalls = this.split_ball(ball);
          if (splitBalls) {
            splitBalls.forEach(splitBall => this.balls.add(splitBall));
          }
        }
        if (hook.to_kill) {
          this.hooks.delete(hook);
        }
      });
    });

    this.bonuses.forEach(bonus => {
      this.box_to_box(bonus);
      if (bonus.to_kill) {
        this.bonuses.delete(bonus);
      }
    });
  }

  split_ball(ball) {
    this.spawn_bonus(ball.position);
    if (ball.radius > Settings.MIN_BALL_RADIUS) {
      var balls = new Set();
      var newRadius = Math.floor(ball.radius / 2);
      balls.add(
        this.ballFactory(
          newRadius,
          new Vec2D(ball.x - 2, ball.y),
          new Vec2D(-ball.force.x - 0.5, 2.1),
          ball.color
        )
      );
      balls.add(
        this.ballFactory(newRadius, ball.position, new Vec2D(ball.force.x + 0.5, 2.1), ball.color)
      );
      return balls;
    }
  }

  spawn_bonus(pos) {
    if (Math.random() <= Settings.BONUS_SPAWN_CHANCE) {
      var possibleBonuses = [
        BonusType.extra_hit,
        BonusType.extra_hook,
        BonusType.chain_hook,
        BonusType.invulnerability
      ];
      var bonusChooser = Math.floor(Math.random() * possibleBonuses.length);
      this.bonuses.add(this.bonusFactory(pos, possibleBonuses[bonusChooser]));
    }
  }

  box_to_box(bonus) {
    var collision = false;
    if (bonus.y > Settings.SCREEN_HEIGHT - Settings.MARGIN - 32) {
      if (bonus.x <= this.player.x && this.player.x < bonus.x + 20) {
        collision = true;
      } else if (
        this.player.x >= Settings.SCREEN_WIDTH - Settings.MARGIN - 32 &&
        bonus.x >= Settings.SCREEN_WIDTH - Settings.MARGIN - 20
      ) {
        collision = true;
      }
    }

    if (collision) {
      bonus.to_kill = true;
      this.player.activateBonus(bonus.bonus_type);
      AudioManager.playActivateBonus();
    }
  }
}

function calc_angle(point) {
  /*
    Function that takes a Vec2D object and calculates the angle between it
    and the vector with coordinates (1, 0)
     */

  let x1 = 1,
    y1 = 0;
  let x2 = point.x,
    y2 = point.y;
  let inner_product = x1 * x2 + y1 * y2;
  let len1 = Math.hypot(x1, y1);
  let len2 = Math.hypot(x2, y2);
  return (180 * Math.acos(inner_product / (len1 * len2))) / Math.PI;
}

function ball_to_box(ball, box, solid = false) {
  /*"""Ball to box collision detection algorithm using voronoi regions.
    Calculates which region the ball is in based on this map:
    1|2|3
    4|0|5
    6|7|8
    Fixates the ball's position so that the objects no longer collide if solid
    is set to True and returns a Vec2D object representing the directions
    which the ball needs to change.
    """*/

  let radius = ball.radius;
  let region = -1;
  let box_x_edge = 0;
  let box_y_edge = 0;
  let force_x = 0;
  let force_y = 0;
  let ball_x_fixate = 0;
  let ball_y_fixate = 0;

  if (ball.x > box.x + box.width) {
    //  # 3 or 5 or 8
    if (ball.y > box.y + box.height) {
      //  # 8
      box_x_edge = box.x + box.width;
      box_y_edge = box.y + box.height;
      if ((ball.x - box_x_edge) ** 2 + (ball.y - box_y_edge) ** 2 < radius ** 2) {
        region = 8;
      }
    } else if (ball.y < box.y) {
      //  # 3
      box_x_edge = box.x + box.width;
      box_y_edge = box.y;
      if ((ball.x - box_x_edge) ** 2 + (ball.y - box_y_edge) ** 2 < radius ** 2) {
        region = 3;
      }
    } else {
      //  # 5
      if (box.x + box.width >= ball.x - radius) {
        region = 5;
        ball_x_fixate = 2 * (box.x + box.width - (ball.x - radius));
        force_x = -1;
      }
    }
  } else if (ball.x < box.x) {
    //  # 1 or 4 or 6
    if (ball.y > box.y + box.height) {
      // # 6
      box_x_edge = box.x;
      box_y_edge = box.y + box.height;
      if ((ball.x - box_x_edge) ** 2 + (ball.y - box_y_edge) ** 2 < radius ** 2) region = 6;
    } else if (ball.y < box.y) {
      //  # 1
      box_x_edge = box.x;
      box_y_edge = box.y;
      if ((ball.x - box_x_edge) ** 2 + (ball.y - box_y_edge) ** 2 < radius ** 2) region = 1;
    } else {
      //  # 4
      if (box.x <= ball.x + radius) {
        region = 4;
        ball_x_fixate = 2 * (box.x - (ball.x + radius));
        force_x = -1;
      }
    }
  } else {
    //  # 2 or 7 or 0
    if (ball.y >= box.y + box.height) {
      // # 7
      if (box.y + box.height >= ball.y - radius) {
        region = 7;
        ball_y_fixate = 2 * (box.y + box.height - (ball.y - radius));
        force_y = -1;
      }
    } else if (ball.y <= box.y) {
      // # 2
      if (box.y <= ball.y + radius) {
        region = 2;
        ball_y_fixate = 2 * (box.y - (ball.y + radius));
        force_y = -1;
      }
    } else {
      //  # 0
      region = 0;
      if (ball.force.y >= 0) {
        // # this is actually the same as 2
        ball_y_fixate = 2 * (box.y - (ball.y + radius));
        force_y = -1;
      } else {
        //# this is actually the same as 7
        ball_y_fixate = 2 * (box.y + box.height - (ball.y - radius));
        force_y = -1;
      }
    }
  }

  if (solid) {
    if ([1, 3, 6, 8].includes(region)) {
      let delta_x = ball.x - box_x_edge;
      let delta_y = ball.y - box_y_edge;

      if ([1, 6].includes(region)) {
        if (ball.force.x > 0) force_x = -1;
      } else {
        if (ball.force.x < 0) force_x = -1;
      }

      if ([1, 3].includes(region)) {
        if (ball.force.y > 0) force_y = -1;
      } else {
        if (ball.force.y < 0) force_y = -1;
      }

      let angle = calc_angle(new Vec2D(delta_x, delta_y));
      if (angle > 90.5) angle %= 90;

      if ([1, 6].includes(region)) {
        if (angle <= 31) force_x = 0;
        else if (angle >= 59) force_y = 0;
      } else {
        if (angle <= 31) force_y = 0;
        else if (angle >= 59) force_x = 0;
      }

      if (force_x && force_y) {
        let force_length = (delta_x ** 2 + delta_y ** 2) ** 0.5;
        let lengthen_y = radius / force_length - 1;
        let lengthen_x = (lengthen_y * ball.force.x) / ball.force.y;
        ball_x_fixate = 2 * delta_x * lengthen_x;
        ball_y_fixate = 2 * delta_y * lengthen_y;
      } else if (force_x) {
        let x_pos = (radius ** 2 - (box_y_edge - ball.y) ** 2) ** 0.5;
        if (ball.x > box_x_edge) {
          x_pos = ball.x - x_pos;
          ball_x_fixate = 2 * (box_x_edge - x_pos);
        } else {
          x_pos += ball.x;
          ball_x_fixate = 2 * (box_x_edge - x_pos);
        }
      } else if (force_y) {
        let y_pos = (radius ** 2 - (box_x_edge - ball.x) ** 2) ** 0.5;
        if (ball.y > box_y_edge) {
          y_pos = ball.y - y_pos;
          ball_y_fixate = 2 * (box_y_edge - y_pos);
        } else {
          y_pos += ball.y;
          ball_y_fixate = 2 * (box_y_edge - y_pos);
        }
      }

      ball.position.add(new Vec2D(ball_x_fixate, ball_y_fixate));
    } else if ([0, 2, 4, 5, 7].includes(region)) {
      ball.position.add(new Vec2D(ball_x_fixate, ball_y_fixate));
    }
  }

  if (region !== -1) {
    return new Vec2D(force_x, force_y);
  }
}

export { CollisionManager };
