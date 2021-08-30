const username= document.getElementById("username");
const saveScoreBtn= document.getElementById("saveScoreBtn");
const finalscore=document.getElementById("finalscore");
const mostRecentScore=localStorage.getItem("mostRecentScore");

const highScores=JSON.parse(localStorage.getItem("highScores")) ||[];  //localstorage ids are stores as a String so we need to convert them into JSON string

const MAX_HIGH_SCORES = 5;

finalscore.innerText=mostRecentScore;

username.addEventListener('keyup', ()=>{
    saveScoreBtn.disabled = !username.value;

});

saveHighScore=(e) =>{
    e.preventDefault();

    const score={
        score:Math.floor(Math.random()*100),
        name:username.value
    };
    highScores.push(score);
    //console.log(highScores);
    highScores.sort((a,b) => b.score - a.score) //gives sorted array

    highScores.splice(5); //at index 5 array is spliced(cut)

    localStorage.setItem('highScores',JSON.stringify(highScores)); //update with high score
    window.location.assign("index.html");

};
