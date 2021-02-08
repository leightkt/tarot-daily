const backendURL = "http://localhost:9000"
const $displayReadings = document.querySelector(".display-readings")
const queryParams = new URLSearchParams(window.location.search)
const readingId = queryParams.get('reading_id')
const userID = queryParams.get('user_id')

fetch(`${backendURL}/readings/${readingId}`)
    .then(response => response.json)
    .then(reading => console.log(reading))

function displayCard(tarotCard) {
    const $cardName = document.querySelector(".card-name")
    const $cardSuit = document.querySelector(".card-suit")
    const $cardMeaning = document.querySelector(".card-meaning")
    const $desc = document.querySelector(".desc")
    
    $cardName.innerText = tarotCard.card[0].name
    $cardSuit.innerText = tarotCard.card[0].suit
    $cardMeaning.innerText = getMeaning(tarotCard)
    $desc.innerText = tarotCard.card[0].desc
}