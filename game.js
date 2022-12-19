let boardTop = document.getElementById('board-top');
let boardBot = document.getElementById('board-bot');
let resultHistory = [];
let score = 0;
let gameOptions = {
    time: undefined, 
    numRange: undefined, 
    mathOperations: [] 
};

/*#########
START PAGE
###########*/
let startPage = () => {
    /*FUNCTION VARIABLES*/
    let options = {
        time: [15000, 30000, 60000], //can only choose one
        range: [10, 100, 1000, 9999], //can only choose one
        mathOps: [['+', '-'], ['x', '÷'], ['#²', '√#']] //multiple choise
    }
    //This function creats a checkbox  element for every option available.
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
                    text.textContent = `${selection/1000}s`;
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
    settingLoop (mathSetting, options.mathOps);

    /*BOARD BOTTOM*/
    let startBtn = document.createElement('button');
    startBtn.classList.add('button');
    startBtn.setAttribute('id', 'start-btn');
    startBtn.setAttribute('type', 'button');
    startBtn.textContent = 'START GAME';

    /*ELEMENT RENDER*/
    boardTop.replaceChildren(settingTitle, settingWindow)
    boardBot.replaceChildren(startBtn);

    startBtn.addEventListener('click', () => {
        let checkTime = document.querySelector('[name=time]:checked');
        let checkRange = document.querySelector('[name=range]:checked');
        let checkOps = [];
        document.querySelectorAll('[name=operation]:checked').forEach(sel => {
            checkOps.push(sel.value)
        });
        gameOptions.time = options.time[checkTime.value];
        gameOptions.numRange = options.range[checkRange.value];
        checkOps.forEach(check  => {
            gameOptions.mathOperations.push(...options.mathOps[check])
        })
        console.log(gameOptions);
        if ( gameOptions.time == undefined || gameOptions.numRange == undefined || gameOptions.mathOperations == [])  {
            console.log(`wrong setting`)
        } else {countdown()}
})}

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
    /*FUNCTION VARIABLES*/
    let activeOperators = gameOptions.mathOperations;
    let numRegex = /^\-*[0-9]+(.[0-9]*)?$/;
    let correctAnswer, inputAnswer;
    let numGen0 = () => { //for numbers 0 and up
        return Math.round(Math.random() * gameOptions.numRange)
    }
    let numGen1 = () => { //for numbers 1 and up
        return Math.ceil(Math.random() * gameOptions.numRange)
    }
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
                a =  numGen1();
                correctAnswer = a ** 2;
                console.log(correctAnswer);
                mathText.textContent  = `${a}²`
                break;
            case '√#':
                a = numGen1();
                correctAnswer = +(Math.sqrt(a).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]) //FROM https://stackoverflow.com/questions/4187146/truncate-number-to-two-decimal-places-without-rounding
                console.log(correctAnswer);
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

    inputArea.addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            inputAnswer = +(inputArea.value);
            if (numRegex.test(inputAnswer)) {
                event.preventDefault();
                console.log(`input is ${inputAnswer}, answer is ${correctAnswer}`);
                resultHistory.push(
                    {
                        mathText: mathText.textContent,
                        userAnswer: inputAnswer,
                        answerResult: answerCheck(inputAnswer, correctAnswer)
                    }
                )
                console.log(`the score is ${score}`)
                inputArea.value = "";
                mathGen()
            } else {
                console.log('please enter a number')
                inputArea.value = "";
            }
        }
    })

    /*ELEMENT RENDER*/
    boardTop.replaceChildren(timeBar, mathText);
    boardBot.replaceChildren(inputArea);
    inputArea.focus(); //To type immediately in the answer box

    /*FUNCTION CALLBACK 1min TIMER*/
    let time = gameOptions.time;
    timeRem.style.animationDuration = `${time / 1000}s`

    setTimeout(() => {
        resultWindow();
    }, time);
}


/*#########
RESULT PAGE
###########*/
let resultWindow = () => {
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
        answerLine.textContent = `${result.mathText} = ${result.userAnswer}`;
        answerLine.setAttribute('data-result', `${result.answerResult}`)
    })

    let scoreResult = document.createElement('p');
    scoreResult.classList.add('result-text');
    scoreResult.textContent = `Your score is: ${score}`; //TODO Save high score on local storage
    //Clear and resets scores, results  and  settings;
    score = 0;
    resultHistory = [];
    gameOptions.time = undefined;
    gameOptions.numRange =  undefined;
    gameOptions.mathOperations  =  [];


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