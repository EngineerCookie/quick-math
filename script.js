let mathTarget = document.querySelector("[data-math-problem]")
const operator = ['sum', 'res', 'multi', 'div'];
let correctAnswer, inputAnswer;

function mathGen() {
    let a, b;
    let opeRandom = Math.round(Math.random() * (operator.length - 1));
    switch (operator[opeRandom]) {
        case 'sum':
            a = Math.round(Math.random() * 10);
            b = Math.round(Math.random() * 10);
            correctAnswer = a + b;
            mathTarget.textContent = `${a} + ${b}`;
            break;
        case 'res':
            a = Math.round(Math.random() * 10);
            b = Math.round(Math.random() * 10);
            correctAnswer = a - b;
            mathTarget.textContent = `${a} - ${b}`;
            break;
        case 'multi':
            a = Math.round(Math.random() * 10);
            b = Math.round(Math.random() * 10);
            correctAnswer = a * b;
            mathTarget.textContent = `${a} x ${b}`
            break;
        case 'div':
            a = Math.ceil(Math.random() * 10);
            b = Math.ceil(Math.random() * 10);
            if ((a % b) != 0) { correctAnswer = parseFloat((a / b).toFixed(2)) } else { correctAnswer = a / b };
            mathTarget.textContent = `${a} ÷ ${b}`;
            break;
        default:
            console.log(`something went wrong`);
    }
}

mathGen()


/*##########
INPUT DETECTION
########### */
let answerBox = document.querySelector('#answer-box');
let numRegex = /^\-*[0-9]+(.[0-9]*)?$/
//console.log(answerBox.value)

//console.log(numRegex.test(answerBox.value))

function answerCheck (val1, val2) {
    if (val1 == val2) {
        return 'correct'
    } else {return 'wrong'}
}

answerBox.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        inputAnswer = answerBox.value
        if (numRegex.test(answerBox.value)) {
            event.preventDefault();
            console.log(`input is ${inputAnswer}, answer is ${correctAnswer}`)
            console.log(answerCheck(inputAnswer, correctAnswer))
            answerBox.value = "";
            mathGen()
        } else {
            console.log('please enter a number')
            answerBox.value = "";
        }

    }
})
