let boardTop = document.getElementById('board-top');
let boardBot = document.getElementById('board-bot');
let resultHistory = [];
let score = 0;
let gameSettings = {
    time: undefined,
    numRange: undefined,
    mathOperations: [],
    saveRecord: ''
};
/*#########
HELP DIALOG
###########*/
let openHelp = document.querySelector('.help');
let helpWindow = document.querySelector('dialog');
let closeBtn = document.getElementById('modal-close');
let langBtn = document.querySelectorAll('[data-lang]');
let langTxt = document.querySelectorAll('[data-text]');

openHelp.addEventListener('click', () => {
    helpWindow.showModal()
})

closeBtn.addEventListener('click', () => {
    helpWindow.close()
})

langBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        const target = document.querySelector(btn.dataset.lang)
        langTxt.forEach((txt) => {
            txt.classList.remove('active')
        })
        langBtn.forEach((btn) => {
            btn.classList.remove('active')
        })
        btn.classList.add('active');
        target.classList.add('active');
    })
})



/*#########
START PAGE
###########*/
let startPage = () => {
    /*FUNCTION VARIABLES*/
    let options = {
        time: [10000, 30000, 60000, 180000], //can only choose one
        range: [10, 100, 1000, 9999], //can only choose one
        mathOps: [['+', '-'], ['x', '÷'], ['#²', '√#']], //multiple choise
        save: { //this is for high score check
            time: undefined,
            range: undefined,
            operation: []
        }
    }
    //This function creates a checkbox  element for every option available.
    let settingLoop = (setting, option) => {
        option.forEach(selection => {
            let label = document.createElement('label');
            setting.appendChild(label);

            let checkbox = document.createElement('input');
            checkbox.classList.add('setting-checkbox');
            checkbox.setAttribute('value', option.indexOf(selection));

            let text = document.createElement('span');
            text.classList.add('setting-text');

            switch (option) {
                case options.time:
                    checkbox.setAttribute('type', 'radio');
                    checkbox.setAttribute('name', 'time');
                    text.textContent = `${selection / 1000}s`;
                    break;
                case options.range:
                    checkbox.setAttribute('type', 'radio');
                    checkbox.setAttribute('name', 'range');
                    text.textContent = `< ${selection}`;
                    break;
                case options.mathOps:
                    checkbox.setAttribute('type', 'checkbox');
                    checkbox.setAttribute('name', 'operation')
                    text.textContent = `${selection[0]}  ${selection[1]}`;
                    break;
                default:
                    console.log('Something went wrong with settingLoop');
            }
            label.appendChild(checkbox);
            label.appendChild(text);

        })
    }

    /*BOARD TOP*/
    let settingTitle = document.createElement('span');
    settingTitle.classList.add('setting-title');
    settingTitle.textContent = 'Settings';

    let timeSetting = document.createElement('div');
    timeSetting.classList.add('setting-option');

    let rangeSetting = document.createElement('div');
    rangeSetting.classList.add('setting-option');

    let mathSetting = document.createElement('div');
    mathSetting.classList.add('setting-option');

    let settingWindow = document.createElement('div');
    settingWindow.classList.add('setting-window');

    settingWindow.appendChild(timeSetting);
    settingLoop(timeSetting, options.time);

    settingWindow.appendChild(rangeSetting);
    settingLoop(rangeSetting, options.range);

    settingWindow.appendChild(mathSetting);
    settingLoop(mathSetting, options.mathOps);

    let highScore = document.createElement('span');

    /*BOARD BOTTOM*/
    let startBtn = document.createElement('button');
    startBtn.classList.add('button');
    startBtn.setAttribute('id', 'start-btn');
    startBtn.setAttribute('type', 'button');
    startBtn.textContent = 'START GAME';

    /*ELEMENT RENDER*/
    boardTop.replaceChildren(settingTitle, settingWindow, highScore)
    boardBot.replaceChildren(startBtn);


    //High score save check by setting
    let checkbox = document.querySelectorAll('.setting-checkbox');
    checkbox.forEach(item => {
        item.addEventListener('click', (event) => {
            switch (event.target.name) {
                case 'operation':
                    if (event.target.checked == false) {
                        options.save.operation.splice(options.save.operation.indexOf(event.target.value), 1);
                    } else {
                        options.save.operation.push(event.target.value)
                        options.save.operation.sort()
                    }
                    break;
                default:
                    options.save[event.target.name] = event.target.value
            }
            if (localStorage.getItem(`t${options.save.time}r${options.save.range}o${options.save.operation}`)) {
                highScore.textContent = `Record: ${localStorage.getItem(`t${options.save.time}r${options.save.range}o${options.save.operation}`)}`
            } else { highScore.textContent = '' }

        })
    })

    startBtn.addEventListener('click', () => {
        let checkTime = document.querySelector('[name=time]:checked');
        let checkRange = document.querySelector('[name=range]:checked');
        let checkOps = [];
        gameSettings.saveRecord = `t${options.save.time}r${options.save.range}o${options.save.operation}`
        document.querySelectorAll('[name=operation]:checked').forEach(sel => {
            checkOps.push(sel.value)
        });
        gameSettings.time = options.time[checkTime.value];
        gameSettings.numRange = options.range[checkRange.value];
        checkOps.forEach(check => {
            gameSettings.mathOperations.push(...options.mathOps[check])
        })
        if (gameSettings.time == undefined || gameSettings.numRange == undefined || gameSettings.mathOperations.length < 1) {
            console.log(`wrong setting`)
        } else { countdown() }
    })
}

/*#########
COUNTDOWN BEFORE GAMESTART PAGE
###########*/
let countdown = () => {

    /*BOARD TOP*/
    let startCounter = document.createElement('div');
    let timeDisplay = document.createElement('span');
    startCounter.classList.add('countdown');
    startCounter.appendChild(timeDisplay);
    timeDisplay.classList.add('countdown-number');
    timeDisplay.textContent = 3; //CHANGED TO 1 FOR DEV PURPOSES! DEFAULT IS 3

    /*ELEMENT RENDER*/
    boardTop.replaceChildren(startCounter);
    boardBot.replaceChildren();

    /*FUNCTION CALLBACK*/
    let interval = setInterval(() => {
        if (timeDisplay.textContent <= 1) {
            gameStart()
            clearInterval(interval)
        } else { timeDisplay.textContent -= 1 }
    }, 1000)
}


/*#########
GAME START PAGE
###########*/
let gameStart = () => {
    /*PLACEHOLDER:mathActive class for board-top and board-bot for mobile keypad*/
    boardTop.classList.add('mobile');
    boardBot.classList.add('mobile');
    /*FUNCTION VARIABLES*/
    let activeOperators = gameSettings.mathOperations;
    let numRegex = /^\-*[0-9]+(.[0-9]*)?$/;
    let correctAnswer, inputAnswer;
    let numGen0 = () => { //for numbers 0 and up
        return Math.round(Math.random() * gameSettings.numRange)
    }
    let numGen1 = () => { //for numbers 1 and up
        return Math.ceil(Math.random() * gameSettings.numRange)
    }
    let keypadKeys = ['DEL', 'C', '7', '8', '9', '4', '5', '6', '1', '2', '3', '-', '0', '.', 'ENTER']

    //Math generator
    function mathGen() {
        let a, b;
        let opeRandom = Math.round(Math.random() * (activeOperators.length - 1));
        switch (activeOperators[opeRandom]) {
            case '+':
                a = numGen0();
                b = numGen0();
                correctAnswer = a + b;
                mathText.textContent = `${a} + ${b}`;
                break;
            case '-':
                a = numGen0();
                b = numGen0();
                correctAnswer = a - b;
                mathText.textContent = `${a} - ${b}`;
                break;
            case 'x':
                a = numGen0();
                b = numGen0();
                correctAnswer = a * b;
                mathText.textContent = `${a} x ${b}`
                break;
            case '÷':
                a = numGen1();
                b = numGen1();
                if ((a % b) != 0) {
                    correctAnswer = +((a / b).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0])
                    //FROM https://stackoverflow.com/questions/4187146/truncate-number-to-two-decimal-places-without-rounding
                } else {
                    correctAnswer = a / b
                };
                mathText.textContent = `${a} ÷ ${b}`;
                console.log(correctAnswer);
                break;
            case '#²':
                a = numGen1();
                correctAnswer = a ** 2;
                mathText.textContent = `${a}²`
                break;
            case '√#':
                a = numGen1();
                correctAnswer = +(Math.sqrt(a).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]) //FROM https://stackoverflow.com/questions/4187146/truncate-number-to-two-decimal-places-without-rounding
                mathText.textContent = `√${a}`
                break;
            default:
                console.log(`something went wrong with mathgen`);
        }
    }

    //Answer Check
    function answerCheck(val1, val2) {
        if (val1 == val2) {
            score++;
            return 'correct'
        } else { return 'wrong' }
    }

    /*BOARD TOP*/
    let timeBar = document.createElement('div');
    let timeRem = document.createElement('div');
    timeBar.classList.add('time-bar');
    timeBar.appendChild(timeRem);
    timeRem.classList.add('time-rem');

    let mathText = document.createElement('span');
    mathText.classList.add('math-text');
    mathGen()


    /*BOARD BOTTOM*/
    let inputArea = document.createElement('input');
    inputArea.setAttribute('id', 'user-answer');
    inputArea.setAttribute('inputmode', 'none')
    inputArea.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            inputAnswer = +(inputArea.value);
            if (numRegex.test(inputAnswer)) {
                event.preventDefault();
                resultHistory.push(
                    {
                        mathText: mathText.textContent,
                        userAnswer: inputAnswer,
                        answerResult: answerCheck(inputAnswer, correctAnswer),
                        RightAnswer: correctAnswer
                    }
                )
                //console.log(answerCheck(inputAnswer, correctAnswer))
                inputArea.value = "";
                mathGen()
            } else {
                console.log('please enter a number')
                inputArea.value = "";
            }
        }
    })
    /*Mobile keypad*/
    let keypadDiv = document.createElement('div');
    keypadDiv.classList.add('keypad');

    keypadKeys.forEach((keys) => {
        let key = document.createElement('button');
        key.classList.add('keypad-key')
        key.setAttribute('data-key', `${keys}`)
        key.textContent = `${keys}`

        keypadDiv.appendChild(key);
    })

    let keypadBtn = keypadDiv.querySelectorAll('[data-key]');

    keypadBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            let target = document.getElementById('user-answer');
            switch (btn.textContent) {
                case 'ENTER':
                    let enterEvt = new KeyboardEvent('keydown', {
                        "key": "Enter",
                        "keyCode": 13,
                        "which": 13,
                        "code": "Enter",
                        "location": 0,
                        "altKey": false,
                        "ctrlKey": false,
                        "metaKey": false,
                        "shiftKey": false,
                        "repeat": false
                    });
                    target.dispatchEvent(enterEvt)
                    break;
                case 'DEL':
                    target.value = target.value.substring(0, target.value.length-1)
                    break;
                case 'C':
                    target.value = '';
                    break;
                default:
                    target.value += btn.textContent
            }
        })
    })
    /*ELEMENT RENDER*/
    boardTop.replaceChildren(timeBar, mathText);
    boardBot.replaceChildren(inputArea, keypadDiv);
    inputArea.focus(); //To type immediately in the answer box

    /*FUNCTION CALLBACK 1min TIMER*/
    let time = gameSettings.time;
    timeRem.style.animationDuration = `${time / 1000}s`

    setTimeout(() => {
        resultWindow();
    }, time);
}


/*#########
RESULT PAGE
###########*/
let resultWindow = () => {
    /*PLACEHOLDER:mathActive class for board-top and board-bot for mobile keypad*/
    boardTop.classList.remove('mobile');
    boardBot.classList.remove('mobile');
    /*FUNCTION VARIABLES*/

    /*BOARD TOP*/
    let resultTitle = document.createElement('h1');
    resultTitle.classList.add('result-title');
    resultTitle.textContent = 'Results';

    let resultList = document.createElement('ul');
    resultList.classList.add('result-list')

    resultHistory.forEach(result => {
        let answerLine = document.createElement('li');

        resultList.appendChild(answerLine);
        answerLine.classList.add('answer');
        answerLine.innerHTML = `${result.mathText} = ${result.userAnswer} <span>${result.RightAnswer}</span>`;
        answerLine.setAttribute('data-result', `${result.answerResult}`)
    })

    let scoreResult = document.createElement('p');
    scoreResult.classList.add('result-text');
    scoreResult.textContent = `Your score is: ${score}`;
    if (score > localStorage.getItem(gameSettings.saveRecord)) { //Saving highscore to localStorage
        localStorage.setItem(gameSettings.saveRecord, score);
    }
    //Clear and resets scores, results  and  settings;
    score = 0;
    resultHistory = [];
    gameSettings.time = undefined;
    gameSettings.numRange = undefined;
    gameSettings.mathOperations = [];
    gameSettings.saveRecord = '';


    /*BOARD BOTTOM*/
    let returnBtn = document.createElement('button');
    returnBtn.classList.add('button');
    returnBtn.setAttribute('type', 'button');
    returnBtn.setAttribute('id', 'return-button');
    returnBtn.textContent = 'Return to main menu';
    returnBtn.setAttribute('onclick', 'startPage()');

    /*ELEMENT RENDER*/
    boardTop.replaceChildren(resultTitle, resultList, scoreResult)
    boardBot.replaceChildren(returnBtn);
}


startPage()