const backendURL = "http://localhost:9000"
const $displayReadings = document.querySelector(".display-readings")
const $question = document.querySelector(".question")
const $backButton = document.querySelector(".back-button")
const $deleteButton = document.querySelector(".delete")
const queryParams = new URLSearchParams(window.location.search)
const readingId = queryParams.get('reading_id')
const userID = queryParams.get('user_id')

$backButton.parentNode.href = `/user.html?user_id=${userID}`

fetch(`${backendURL}/readings/${readingId}`, {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${localStorage.token}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
})
    .then(response => response.json())
    .then(reading => {
        console.log(reading)
        displayCard(reading)
        displayQuestion(reading)
        addDeleteAction(reading)
    })

function displayCard(reading) {
    const $cardName = document.querySelector(".card-name")
    const $cardSuit = document.querySelector(".card-suit")
    const $cardMeaning = document.querySelector(".card-meaning")
    const $desc = document.querySelector(".desc")
    
    $cardName.innerText = reading.card.name
    $cardSuit.innerText = reading.card.suit
    $cardMeaning.innerText = getMeaning(reading)
    $desc.innerText = reading.card.desc
}

function displayQuestion(reading){
    $question.textContent = `You asked: ${reading.question} on ${reading.date}`
}

function getMeaning(reading){
    if (reading.direction === "up"){
        return `Up: ${reading.card.meaning_up}`
    } else {
        return `Down: ${reading.card.meaning_rev}`
    }
}

function addDeleteAction(reading){
    $deleteButton.addEventListener('click', (_) => {
        fetch(`${backendURL}/readings/${reading.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.token}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(window.location.replace(`/user.html?user_id=${userID}`))
    })
}