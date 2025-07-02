let skoreUloh = {}; 
const maxHints = 2;  //nastavenie poctu napoved
let hintsUsed = 0;  
const hintsUsedPerQuestion = {};
const answeredCorrectly = new Set();


//Kontrola spravnosti odpovede na otazku + pridanie a aktualizovanie skore  

function submitAnswer(ulohaId, otazkaId) {
    const questionId = `uloha${ulohaId}-otazka${otazkaId}`;
    if (answeredCorrectly.has(questionId)) return;

    const answerInput = document.getElementById(questionId);
    const answer = answerInput.value;
    const hintsCount = hintsUsedPerQuestion[questionId] || 0;

    fetch('/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({questionId, answer, hintsUsed: hintsCount})
    })
    .then(response => response.json())
    .then(data => {
        const feedbackElement = document.getElementById(`feedback-${questionId}`);
        if (data.correct) {
            answeredCorrectly.add(questionId);
            if (!skoreUloh[`uloha${ulohaId}`]) {
                skoreUloh[`uloha${ulohaId}`] = 0; 
            }
            skoreUloh[`uloha${ulohaId}`] += data.score; 
            answerInput.disabled = true; 
            feedbackElement.textContent = "Správne!";
            
            document.getElementById(`uspesnost-uloha${ulohaId}`).textContent = `Úspešnosť: ${ulohaId}%`
            updateOverallSuccess(); 
        } else {
            feedbackElement.textContent = "Nesprávne, skús to znova.";
        }
    })
    .catch(error => console.error('Error:', error));
}


//Vyuzitie napovied pre ulohy

function getHint(ulohaId, otazkaId) {
    const questionId = `uloha${ulohaId}-otazka${otazkaId}`;
    if (answeredCorrectly.has(questionId)) {
        alert("Na túto otázku ste už odpovedali správne. Ďalšia nápoveda nie je potrebná.");
        return;
    }
    if (hintsUsed >= maxHints) {
        alert("Dosiahli ste maximálny počet nápoved.");
        return;
    }

    const hintNumber = hintsUsedPerQuestion[questionId] || 0;
    fetch(`/hint/${ulohaId}/${otazkaId}/${hintNumber}`)
    .then(response => response.json())
    .then(data => {
        const feedbackElement = document.getElementById(`feedback-${questionId}`);
        feedbackElement.textContent = data.hint;
        hintsUsed++;
        hintsUsedPerQuestion[questionId] = hintNumber + 1;

        const hintsRemainingElement = document.getElementById('hintsRemaining');
        hintsRemainingElement.textContent = `Zostávajúce nápovedy: ${maxHints - hintsUsed}`;
    })
    .catch(error => console.error('Error:', error));
}


//Aktualizacia celkoveho skore + prepocet na percenta

function updateOverallSuccess() {
     const maxScores = {
	 "uloha1": 100,
	 "uloha2": 100,  //nastavenie maximalneho poctu bodov za ulohu
	 "uloha3": 150
	 };

    let totalScores = 0;
    let completedTasks = Object.keys(skoreUloh).length; 

    for (const [ulohaId, score] of Object.entries(skoreUloh)) {
        totalScores += score;
        let taskSuccess = score; // Since score is already total for task
        let percentage = (taskSuccess / maxScores[ulohaId]) * 100;
        localStorage.setItem(`uspesnost-${ulohaId}`, percentage.toString());
        if (document.getElementById(`uspesnost-${ulohaId}`)) {
            document.getElementById(`uspesnost-${ulohaId}`).textContent = `Úspešnosť: ${percentage.toFixed(0)}%`;
        }
    }

    
}



