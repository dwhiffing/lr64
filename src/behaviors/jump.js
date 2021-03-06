export const JUMP = {
  options: {
    jumpHeight: 38,
    jumpCount: 2,
    playSound: true,
    emitter: true,
  },

  $create: function (entity, opts) {
    entity.jumpCount = 1

    if (opts.emitter)
      entity.jumpEmitter = entity.scene.particles
        .createEmitter(JUMP_PARTICLE_CONFIG)
        .stop()

    entity.jump = () => {
      if (entity.onLadder) {
        entity.onLadder = false
        entity.play({ key: 'jump' })
        return
      }
      if (entity.tintFill || entity.jumpCount === 0) return

      entity.walkSoundCallback?.remove()
      entity.walkSoundCallback = null

      entity.body.setDamping(false)
      entity.jumpCount--
      entity.body?.setVelocityY(-opts.jumpHeight)
      entity.play({ key: 'jump' })

      if (opts.emitter) entity.jumpEmitter.explode(3)

      if (opts.playSound)
        entity.scene.playSound('jump', [5, 6], { volume: 0.25 })
    }

    entity.land = () => {
      if (!entity.inAir) return

      entity.inAir = false
      entity.body.setDamping(true)

      entity.jumpCount = opts.jumpCount

      if (opts.emitter) entity.jumpEmitter.explode(6)

      if (opts.playSound) {
        entity.scene.playSound('walk', [9, 10], { volume: 0.5 })
      }
    }
  },

  update(entity) {
    if (!entity.body) return

    entity.jumpEmitter?.setPosition(entity.x, entity.y + 4)

    if (entity.body?.onFloor()) {
      entity.land()
    } else {
      entity.body.setAllowGravity(true)
      entity.inAir = true
    }
  },
}

const JUMP_PARTICLE_CONFIG = {
  frame: 18,
  x: 0,
  y: 0,
  lifespan: { min: 400, max: 800 },
  speedX: { min: -10, max: 10 },
  speedY: { min: -10, max: -2 },
  angle: { min: 0, max: 360 },
  rotate: { min: 0, max: 360 },
  gravityY: -3,
  alpha: { start: 0.5, end: 0 },
  scale: { start: 0.3, end: 0 },
  quantity: 1,
}

export const FALL = {
  options: {},

  $create: function (entity, opts) {
    entity.fall = () => {
      if (!entity.body?.onFloor() || !entity.canFall) return
      entity.scene.level.playerCollider.active = false
      entity.scene.time.addEvent({
        delay: 1000,
        callback: () => {
          entity.scene.level.playerCollider.active = true
        },
      })
    }
  },

  update(entity) {},
}
