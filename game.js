let boardTop = document.getElementById('board-top');
let boardBot = document.getElementById('board-bot');
let resultHistory = [];
let score = 0;
let gameOptions = {
    dificulty: undefined,
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
    startBtn.setAttribute('onclick', 'gameStart()')
    startBtn.textContent = 'START GAME';

/*ELEMENT RENDER*/
    boardTop.replaceChildren(titleTest)
    boardBot.replaceChildren(startBtn);
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
    let numGen1 =  ()  => { //for numbers 1 and up
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
    function answerCheck (val1, val2) {
        if (val1 == val2) {
            score++;
            return 'correct'
        } else {return 'wrong'}
    }
    
/*BOARD TOP*/
    let timeBar = document.createElement('h1');
    timeBar.textContent = 'INSERT TIMER BAR HERE';
    let mathText = document.createElement('p');
    mathGen()


/*BOARD BOTTOM*/
    let inputArea = document.createElement('input');
    inputArea.setAttribute('id', 'user-answer');

    inputArea.addEventListener('keypress', (event) => {
        if(event.key === "Enter") {
            inputAnswer = +(inputArea.value);
            //console.log(inputAnswer);
            if (numRegex.test(inputAnswer)) {
                event.preventDefault();
                //console.log(`${mathText.textContent}`)
                console.log(`input is ${inputAnswer}, answer is ${correctAnswer}`);
                //console.log(answerCheck(inputAnswer, correctAnswer));
                resultHistory.push(`${mathText.textContent} = ${inputAnswer} ${answerCheck(inputAnswer, correctAnswer)}`)
                console.log(`the score is ${score}`)
                //console.log(resultHistory);
                inputArea.value = "";
                mathGen()
            } else {
                console.log('please enter a number')
                inputArea.value = "";
            }
        }
    })

    let resultBtn = document.createElement('button');
    resultBtn.classList.add('button');
    resultBtn.setAttribute('type', 'button');
    resultBtn.setAttribute('id', 'result-button');
    resultBtn.textContent = 'Show Rersults';
    resultBtn.setAttribute('onclick', 'resultWindow()')

/*ELEMENT RENDER*/
    boardTop.replaceChildren(timeBar, mathText);
    boardBot.replaceChildren(inputArea, resultBtn);

}




/*#########
RESULT PAGE
###########*/
let resultWindow = () => {
/*FUNCTION VARIABLES*/

/*BOARD TOP*/
    let resultTitle = document.createElement('h1');
    resultTitle.classList.add('title');
    resultTitle.textContent = 'Results';

    let resultList = document.createElement('ul');

    resultHistory.forEach(result => {
        let answerLine = document.createElement('li');
        resultList.appendChild(answerLine);
        answerLine.classList.add('answer');
        answerLine.textContent = result;
    })

    let scoreResult = document.createElement('p');
    scoreResult.textContent = score;
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