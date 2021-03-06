import Phaser from "phaser"
import BootScene from '@/game/scenes/BootScene'

export const scene = new BootScene()

export default {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    rows: 2,
    cols: 5,
    cards: [1, 2, 3, 4, 5],
    scene,
    timeout: 3
}
