<template>
  <div :id="containerId" v-if="downloaded">
    <Button :disabled="scene.restarting" @click="newGame" label="Restart" class="p-button-raised p-button-rounded" />
  </div>
  <div class="placeholder" v-else>
    Downloading ...
  </div>
</template>

<script>
import { scene } from '@/game/config'
export default {
  watch: {
    'scene.restarting'(){
      console.log(this.scene.restarting)
    }
  },
  data() {
    return {
      downloaded: false,
      gameInstance: null,
      containerId: 'game-container',
      game: null,
      scene
    }
  },
  async mounted() {
    this.game = await import(/* webpackChunkName: "game" */ '@/game/game')
    this.downloaded = true
    this.$nextTick(() => {
      this.gameInstance = this.game.launch(this.containerId)
    })
  },
  destroyed() {
    this.gameInstance.destroy(false)
  },
  methods: {
    newGame(){
      this.scene.restart()
    }
  }
}
</script>

<style lang="scss" scoped>
.placeholder {
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
}
</style>
