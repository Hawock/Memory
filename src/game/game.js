import Phaser from 'phaser'
import config from '@/game/config'

function launch(containerId) {
  return new Phaser.Game(config)
}

export default launch
export { launch }
