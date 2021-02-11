
const backendURL = "http://localhost:9000"
const $welcome = document.querySelector(".user-greeting")
const $displayReadings = document.querySelector(".display-readings")
const $getReadingForm = document.querySelector(".get-reading")
const $newReading = document.querySelector(".new-reading")
const $saveButton = document.querySelector(".save")
const $backButton = document.querySelector(".back-button")
const $logoutButton = document.querySelector(".logout")
const searchParams = new URLSearchParams(window.location.search)
const userID = searchParams.get('user_id')
let question = null

getSavedReadings()
addActionToGetReading()
addActionToBack()
logoutAction()

function getSavedReadings(){
    fetch(`${backendURL}/users/${userID}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(user => {
            if (user.errors){
                console.log(user.errors)
            }
            else {
                welcomeUser(user)
            }
        })
}

function welcomeUser(user){
    $welcome.innerText = `Welcome ${user.name}!`
    displayReadings(user)
}

function displayReadings(user) {
    user.readings.forEach(reading => appendReading(reading))
}

function appendReading(reading) {
    const $date = document.createElement('h4')
    const $question = document.createElement('h4')
    const $readingbutton = document.createElement('button')
    const $readingPageLink = document.createElement('a')
    
    $date.innerText = reading.date
    $question.innerText = reading.question
    $readingbutton.innerText = "See Reading"
    $readingPageLink.href = `showCard.html?reading_id=${reading.id}&user_id=${userID}`

    $readingPageLink.appendChild($readingbutton)

    $displayReadings.append($date, $question, $readingPageLink)
}

function addActionToGetReading() {
    $getReadingForm.addEventListener('submit', (event) => {
        event.preventDefault()
        event.target.reset()
        toggleHidden([$displayReadings, $getReadingForm, $newReading])

        const formdata = new FormData($getReadingForm)
        question = formdata.get('question')

        fetch(`${backendURL}/reading`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.token}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(tarotCard => {
                displayCard(tarotCard)
                addActionToSave(tarotCard)
            })
    })
}

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

function getMeaning(tarotCard){
    if (tarotCard.direction === "up"){
        return `Up: ${tarotCard.card[0].meaning_up}`
    } else {
        return `Down: ${tarotCard.card[0].meaning_rev}`
    }
}

function addActionToBack(){
    $backButton.addEventListener('click', (_) => {
        toggleHidden([$newReading, $displayReadings, $getReadingForm])
    })
}

function addActionToSave(tarotCard){
    $saveButton.addEventListener('click', (_) => {

        fetch(`${backendURL}/readings`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.token}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                reading: {
                    question: question.trim(),
                    user_id: userID,
                    card_id: tarotCard.card[0].id,
                    direction: tarotCard.direction
                }
            })
        })
                .then(response => response.json())
                .then(result => {
                    appendReading(result)
                    question = null
                    toggleHidden([$displayReadings, $getReadingForm, $newReading])
                    $getReadingForm.reset()
                })
    })
}

function toggleHidden(elements){
    elements.forEach(element => {element.classList.toggle("hidden")})
}

function logoutAction(){
    $logoutButton.addEventListener('click', (_) => {
        localStorage.removeItem('token')
        location.replace('/')
    })
}