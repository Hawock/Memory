import { GameObjects }  from 'phaser'

export default class Card extends GameObjects.Sprite {
    constructor(scene, value) {
        super(scene, 0, 0, 'card')
        this.scene = scene
        this.value = value
        //вывод самой карты на сцене
        this.scene.add.existing(this)
        this.setInteractive()
        this.opened = false
    }

    init(position){
        this.position = position
        this.close()
        this.setPosition(-this.width, -this.height,)
    }

    move(params) {
        this.scene.tweens.add({
            targets: this,
            x: params.x,
            y: params.y,
            delay: params.delay,
            ease: 'Linear',
            duration: 250,
            onComplete: () =>  {
                if(params.callback){
                    params.callback()
                }
            }
        })
        //this.setPosition(params.x,  params.y,)
    }

    open(){
        this.flip()
        this.opened = true
    }

    close(){
        if(this.opened){
            this.flip()
            this.opened = false
        }
    }

    flip(){
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            ease: 'Linear',
            duration: 150,
            onComplete: () => {
                this.show()
            }
        })
    }

    show(){
        let texture = this.opened ? `card${this.value}` : 'card'
        this.setTexture(texture)
        this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            ease: 'Linear',
            duration: 150
        })
    }

}
