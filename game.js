const question=document.getElementById('question'); 
const choices=Array.from(document.getElementsByClassName('choice-text'));
const progressText=document.getElementById('progressText');
const scoreText=document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');

const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentquestion={};
let acceptingAnswers=true;
let score=0;
let questioncounter=0;
let availablequestions=[];

let questions =[];

fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy")
.then((res) => {
    return res.json();
})
.then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
        const formattedQuestion = {
            question: loadedQuestion.question,
        };

        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
        answerChoices.splice(
            formattedQuestion.answer - 1,
            0,
            loadedQuestion.correct_answer
        );

        answerChoices.forEach((choice, index) => {
            formattedQuestion['choice' + (index + 1)] = choice;
        });

        return formattedQuestion;
    });
    game.classList.remove("hidden");
    loader.classList.add("hidden");
    startGame();
})
.catch((err) => {
    console.error(err);
});
// Constant
const CORRECT_BONUS=10;
const MAX_QUESTIONS=3;

startGame=() =>  {
    questioncounter=0;
    score=0;
    availablequestions=[...questions];
    getNewQuestion();
};

getNewQuestion=()=>{

    if(availablequestions.length==0 || questioncounter>=MAX_QUESTIONS){
        //go to end page
        localStorage.setItem('mostRecentScore',score);
        return window.location.assign("end.html");
    }
    questioncounter++;

    progressText.innerText= "Question"+" "+questioncounter+"/"+MAX_QUESTIONS;
    // Progressbar update

    progressBarFull.style.width = (questioncounter / MAX_QUESTIONS) * 100 + "%";


    const questionIndex=Math.floor(Math.random()*availablequestions.length);
    currentquestion=availablequestions[questionIndex];
    question.innerText=currentquestion.question;

    choices.forEach ( choice =>{
        const number =choice.dataset['number'];
        choice.innerText=currentquestion['choice'+number];
    });
    availablequestions.splice(questionIndex,1);
    acceptingAnswers=true;
};

choices.forEach(choice => {
    choice.addEventListener('click',e=>{
        if(!acceptingAnswers) return;

        acceptingAnswers=false;
        const selectedchoice=e.target;
        const selectedAnswer=selectedchoice.dataset['number'];

        const classToApply = 
            selectedAnswer==currentquestion.answer ? "correct" : "incorrect";

            if(classToApply=='correct'){
                incrementScore(CORRECT_BONUS);
            }

        selectedchoice.parentElement.classList.add(classToApply);
        setTimeout( ()=>{
            selectedchoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        },1000);

    });
});

incrementScore=num=>{
    score+=num;
    scoreText.innerText=score;
}



