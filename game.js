let boardTop = document.getElementById('board-top');
let boardBot = document.getElementById('board-bot');
let resultHistory = [];
let score = 0;
let gameOptions = {
    time: 15000,
    numRange: 10,
    mathOperations: ['sum', 'res', 'multi', 'div']
};
/*#########
START PAGE
###########*/
let startPage = () => {
    /*FUNCTION VARIABLES*/


    /*BOARD TOP*/
    let titleTest = document.createElement('h1');
    titleTest.textContent = 'TESTING TITLE'

    /*BOARD BOTTOM*/
    let startBtn = document.createElement('button');
    startBtn.classList.add('button');
    startBtn.setAttribute('id', 'start-btn');
    startBtn.setAttribute('type', 'button');
    startBtn.setAttribute('onclick', 'countdown()')
    startBtn.textContent = 'START GAME';

    /*ELEMENT RENDER*/
    boardTop.replaceChildren(titleTest)
    boardBot.replaceChildren(startBtn);
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
            case 'sum':
                a = numGen0();
                b = numGen0();
                correctAnswer = a + b;
                mathText.textContent = `${a} + ${b}`;
                break;
            case 'res':
                a = numGen0();
                b = numGen0();
                correctAnswer = a - b;
                mathText.textContent = `${a} - ${b}`;
                break;
            case 'multi':
                a = numGen0();
                b = numGen0();
                correctAnswer = a * b;
                mathText.textContent = `${a} x ${b}`
                break;
            case 'div':
                a = numGen1();
                b = numGen1();
                if ((a % b) != 0) {
                    correctAnswer = parseFloat((a / b).toFixed(2)) //TODO: FIX ROUNDING ISSUE 
                } else {
                    correctAnswer = a / b
                };
                mathText.textContent = `${a} ÷ ${b}`;
                break;
            default:
                console.log(`something went wrong`);
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
            //console.log(inputAnswer);
            if (numRegex.test(inputAnswer)) {
                event.preventDefault();
                //console.log(`${mathText.textContent}`)
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
    scoreResult.textContent = `Your score is: ${score}`;
    //Clear scores and results
    score = 0;
    resultHistory = [];

    /*BOART BOTTOM*/
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