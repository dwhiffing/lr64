import Background from '../sprites/Background'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Credits' })
  }

  create() {
    this.behavior = this.plugins.get('BehaviorPlugin')

    const { width, height } = this.cameras.main
    this.background = new Background(this)

    this.nextButton = this.add
      .image(width / 2 + 4, height - 10, 'tilemap', 56)
      .setInteractive()
      .on('pointerdown', this.nextPage)

    this.prevButton = this.add
      .image(width / 2 - 4, height - 10, 'tilemap', 56)
      .setInteractive()
      .setFlipX(true)
      .on('pointerdown', this.prevPage)

    this.pageIndex = -1
    this.nextPage()
  }

  prevPage = () => {
    this.pageIndex--
    if (this.pageIndex < 0) {
      this.pageIndex = 0
    }
    this.loadPage()
  }

  nextPage = () => {
    this.pageIndex++
    if (this.pageIndex > PAGES.length - 1) {
      return this.scene.start('Game')
    }
    this.loadPage()
  }

  loadPage = () => {
    this.prevButton.setAlpha(this.pageIndex > 0 ? 1 : 0)
    this.pageText?.destroy()
    this.pageText = this.add
      .bitmapText(3, 6, 'pixel-dan', PAGES[this.pageIndex].toUpperCase())
      .setFontSize(5)
  }

  update() {
    this.behavior.preUpdate()
    this.behavior.update()
  }
}

const PAGES = [
  'GAME BY\nDANIEL WHIFFING\n\nMUSIC BY\nPURPLE PLANET',
  'Use arrows to\nmove and aim\n\nUse space to\njump',
  'Use z to\npick up\n\nUse x to\nput down',
  'Use c to\ntoggle your view\n\nUse r to\nrestart level',
  'Use m to\ntoggle mute',
  'The numbers will\nguide your way\n\nGood luck',
]
