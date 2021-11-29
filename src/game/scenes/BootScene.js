import {Scene, Utils} from 'phaser'
import background from '@/game/assets/background.png'
import card from '@/game/assets/card.png'
import Card from '@/game/prefabs/card'
import config from '@/game/config'


export default class BootScene extends Scene {
    constructor() {
        super({key: 'BootScene'})
    }

    preload() {
        //загрузка спрайтов
        this.load.image('bg', background)
        this.load.image('card', card)
        for (let i = 1; i < config.cards.length + 1; i++) {
            this.load.image(`card${i}`, require(`../assets/card${i}.png`))
        }
        this.load.audio('theme', require('../assets/sounds/theme.mp3'))
        this.load.audio('complete', require('../assets/sounds/complete.mp3'))
        this.load.audio('success', require('../assets/sounds/success.mp3'))
        this.load.audio('card', require('../assets/sounds/card.mp3'))
        this.load.audio('timeout', require('../assets/sounds/timeout.mp3'))
    }

    create() {
        this.timeout = config.timeout
        this.createSounds()
        this.createBackground()
        this.createText()
        this.createCards()
        this.createTimer()
        this.start()
    }

    start() {
        this.timeout = config.timeout
        this.openedCard = null
        this.openedCardsCount = 0
        this.initCards()
        this.showCards()
        this.timer.paused = false
        this.restarting = false
    }

    restart(){
        this.timer.paused = true
        this.restarting = true
        let count = 0
        let onCardMoveComplete = () => {
            count++
            if(count >= this.cards.length){
                this.start()
            }
        }
        this.cards.forEach(card => {
            card.move({
                x: config.width + card.width,
                y: config.height +  card.height,
                delay: card.position.delay,
                callback: onCardMoveComplete
            })
        })
    }

    initCards() {
        //получаем позиции для размещения карт
        const positions = this.getCardsPositions()
        this.cards.forEach(card => {
            card.init(positions.pop())
        })
    }

    showCards() {
        this.cards.forEach(card => {
            card.depth = card.position.delay
            card.move({
                x: card.position.x,
                y: card.position.y,
                delay: card.position.delay,
            })
        })
    }

    createSounds() {
        this.sounds = {
            card: this.sound.add('card'),
            success: this.sound.add('success'),
            complete: this.sound.add('complete'),
            theme: this.sound.add('theme'),
            timeout: this.sound.add('timeout')
        }
        this.sounds.theme.play({volume: 0.005, loop: true})
    }

    createBackground() {
        this.cards = []
        // добавляем в сцену бэкграунд в координаты 0, 0 верхний левый угол
        //setOrigin устанавливем опорную точку бэкграунда на 0, 0 (по умолчанию она всегда по центру 0.5, 0.5)
        this.add.sprite(0, 0, 'bg').setOrigin(0, 0)
    }

    createText() {
        this.timeoutText = this.add.text(10, 350, `Time: ${this.timeout}`, {
            font: '24px Arial',
            fill: '#ffffff'
        })
    }

    onTimerTick() {
        this.timeoutText.setText(`Time: ${this.timeout}`)
        if (this.timeout <= 0) {
            this.timer.paused = true
            this.sounds.timeout.play({volume: 0.05})
            this.restart()
        }else{
            this.timeout--
        }
    }

    createTimer() {
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true
        })
    }

    createCards() {
        this.cards = []
        for (let value of config.cards) {
            for (let i = 0; i < 2; i++) {
                this.cards.push(new Card(this, value))
            }
        }
        this.input.on('gameobjectdown', this.onCardClicked, this)
    }

    /**
     * Функция обработки нажатия на объект карты
     */
    onCardClicked(pointer, card) {
        if (card.opened) return false
        this.sounds.card.play({volume: 0.05})
        if (this.openedCard) {
            //уже есть открытая карта
            if (this.openedCard.value === card.value) {
                //картинки равны - запомнить
                this.sounds.success.play({volume: 0.05})
                ++this.openedCardsCount
                this.openedCard = null
            } else {
                //картиинки разные - скрыть прошлую
                this.openedCard.close()
                this.openedCard = card
            }
        } else {
            //еще нет открытой картыт
            this.openedCard = card
        }
        card.open()
        if (this.openedCardsCount === this.cards.length / 2) {
            this.sounds.complete.play({volume: 0.05})
            this.restart()
        }
    }

    /**
     * Возвращает массив объектов позиций для карт
     * @returns {[]}
     */
    getCardsPositions() {
        const positions = []
        const cardTexture = this.textures.get('card').getSourceImage()
        const cardWidth = cardTexture.width + 4
        const cardHeight = cardTexture.height + 4
        const offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2 + cardWidth / 2
        const offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2 + cardHeight / 2
        let id = 0
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 5; col++) {
                positions.push({
                    delay:  ++id  * 100,
                    x: cardWidth * col + offsetX,
                    y: cardHeight * row + offsetY
                })
            }
        }
        //возвращаем перемешанный массив позиций
        return Utils.Array.Shuffle(positions)
    }
}
