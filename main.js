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
let times = 0

// const word = ["百年好合", "永浴愛河", "永結同心", "天作之合", "百年好合", "永浴愛河", "永結同心", "天作之合",] // 測試用

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
}

function resetUnits(...revealUnits) {//重設卡片
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

function addScore(score) { //增加分數
  document.querySelector('.score').innerHTML = `${score}`
}

function showGameFinished() {
  const div = document.createElement('div')
  div.classList.add('completed')
  div.innerHTML = `
      <p>恭喜闖關完成!</p>
      <p>總計嘗試 : ${times} 次</p>
      <p>通關密碼："1213"</p>
    `
  const header = document.querySelector('#header')
  header.before(div)
}


function dispatchUnitAction(unit) {
  if (!unit.classList.contains('back')) {
    return
  }
  switch (gameStatus) {
    case GAME_STATE.FirstCardAwaits:
      flopUnit(unit)
      revealUnits.push(unit)
      gameStatus = GAME_STATE.SecondCardAwaits
      break
    case GAME_STATE.SecondCardAwaits:
      flopUnit(unit)
      times += 1
      revealUnits.push(unit)
      if (revealUnits[0].dataset.content === revealUnits[1].dataset.content) {//配對正確
        gameStatus = GAME_STATE.CardsMatched
        pairUnits(...revealUnits)
        revealUnits = []
        addScore(point += 1)
        gameStatus = GAME_STATE.FirstCardAwaits
        if (point === 12) { //達到完成分數
          showGameFinished(point)
          revealUnits = []
          gameStatus = GAME_STATE.GameFinished
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
