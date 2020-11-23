const cardArea = document.querySelector('.card-area')
const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished",
}
let gameStatus = GAME_STATE.FirstCardAwaits//原始遊戲狀態

let revealUnits = []
let point = 0

// const word = ["百年好合", "永浴愛河", "永結同心", "天作之合", "百年好合", "永浴愛河", "永結同心", "天作之合",]

const word = ["百年好合", "永浴愛河", "琴瑟和鳴", "相親相愛", "永結同心", "天作之合", "心心相印", "神仙眷屬", "花好月圓", "白頭偕老", "花開富貴", "佳偶天成", "百年好合", "永浴愛河", "琴瑟和鳴", "相親相愛", "永結同心", "天作之合", "心心相印", "神仙眷屬", "花好月圓", "白頭偕老", "花開富貴", "佳偶天成"]

function gameInit() {
  for (let i = 0; i < word.length; i++) { //洗牌
    let a = Math.floor(Math.random() * (i + 1))
    let x = word[i]
    word[i] = word[a]
    word[a] = x
  }
  for (let i = 0; i < word.length; i++) { //渲染圖卡
    cardArea.innerHTML += `
      <div class="col-6 col-sm-4 col-md-3 col-lg-2 p-1">
        <div class="unit back" data-content="${word[i]}">
        </div>
      </div>
  `
  }
}

function flopUnit(e) {//翻牌
  let word = e.dataset.content
  e.innerHTML = `
  <h3>${word}</h3>
  `
  e.classList.remove('back')
  console.log(e)
}

function resetUnits(...revealUnits) {
  revealUnits.map(unit => {
    unit.classList.add('back')
    unit.innerHTML = null
  })
}

function pairUnits(...units) { //固定翻開卡片
  units.map(unit => {
    unit.classList.remove('unit')
    unit.classList.add('paired')
  })
}

function wrongAnimation(...units) {//錯誤提示動畫
  units.map(unit => {
    unit.classList.add('wrong')
    unit.addEventListener('animationend', event => event.target.classList.remove('wrong'), { once: true })
  })
}

function resetCards() { //配對失敗、蓋回卡片
  resetUnits(...revealUnits)
  revealUnits = []
  gameStatus = GAME_STATE.FirstCardAwaits
}

function dispatchUnitAction(unit) {
  if (!unit.classList.contains('back')) {
    return
  }
  switch (gameStatus) {
    case GAME_STATE.FirstCardAwaits:
      flopUnit(unit)
      // 計數器
      revealUnits.push(unit)
      gameStatus = GAME_STATE.SecondCardAwaits
      break
    case GAME_STATE.SecondCardAwaits:
      //計數器
      flopUnit(unit)
      revealUnits.push(unit)
      if (revealUnits[0].dataset.content === revealUnits[1].dataset.content) {//配對正確
        gameStatus = GAME_STATE.CardsMatched
        pairUnits(...revealUnits)
        revealUnits = []
        point += 1
        console.log(point)
        gameStatus = GAME_STATE.FirstCardAwaits
        if (point === 12) { //達到完成分數
          console.log(finish)
          revealUnits = []
          return
        }
      } else { //配對失敗
        gameStatus = GAME_STATE.CardsMatchFailed
        wrongAnimation(...revealUnits)
        setTimeout(resetCards, 1000)
      }
      break

  }
}

gameInit()

document.querySelectorAll('.unit').forEach(unit => {
  unit.addEventListener('click', event => {
    dispatchUnitAction(unit)
  })
})
console.log(word)
