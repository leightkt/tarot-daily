const backendURL = "http://localhost:9000"
const $displayReadings = document.querySelector(".display-readings")
const $question = document.querySelector(".question")
const $date = document.querySelector(".date")
const $backButton = document.querySelector(".back-button")
const $deleteButton = document.querySelector(".delete")
const queryParams = new URLSearchParams(window.location.search)
const readingId = queryParams.get('reading_id')
const userID = queryParams.get('user_id')

$backButton.addEventListener('click', (_) => {
    window.location.replace(`/user.html?user_id=${userID}`)
})

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
        displayCard(reading)
        displayQuestion(reading)
        addDeleteAction(reading)
    })

function displayCard(reading) {
    const $cardName = document.querySelector(".card-name")
    const $cardMeaning = document.querySelector(".card-meaning")
    const $desc = document.querySelector(".desc")
    const $tarotImage = document.querySelector(".tarot-img")
    
    $cardName.innerText = reading.card.name
    $tarotImage.src = `/assets/tarot/${reading.card.name_short}.jpg`
    $tarotImage.alt = `${reading.card.name}`
    $cardMeaning.innerText = getMeaning(reading, $tarotImage)
    $desc.innerText = reading.card.desc
}

function displayQuestion(reading){
    $question.textContent = reading.question
    $date.textContent = reading.date
}

function getMeaning(reading, $tarotImage){
    if (reading.direction === "up"){
        return `Up: ${reading.card.meaning_up}`
    } else {
        $tarotImage.classList.add("upside-down")
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