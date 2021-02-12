
const backendURL = "http://localhost:9000"
const $welcome = document.querySelector(".user-greeting")
const $horoscope = document.querySelector(".horoscope")
const $displayReadings = document.querySelector(".display-readings")
const $getReadingForm = document.querySelector(".get-reading")
const $newReading = document.querySelector(".new-reading")
const $saveButton = document.querySelector(".save")
const $backButton = document.querySelector(".back-button")
const $logoutButton = document.querySelector(".logout")
const $deleteAccountButton = document.querySelector(".delete-account")
const $confirmDelete = document.querySelector(".confirm-delete")
const searchParams = new URLSearchParams(window.location.search)
const userID = searchParams.get('user_id')
let userQuestion = null

getHoroscope()
getSavedReadings()
addActionToGetReading()
addActionToBack()
logoutAction()
addDeleteAccount()

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
        toggleHidden([$displayReadings, $getReadingForm, $newReading, $welcome.parentNode, document.querySelector("footer")])

        const formdata = new FormData($getReadingForm)
        userQuestion = formdata.get('question')

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
                event.target.reset()
            })
    })
}

function displayCard(tarotCard) {
    const $cardName = document.querySelector(".card-name")
    const $cardMeaning = document.querySelector(".card-meaning")
    const $desc = document.querySelector(".desc")
    const $tarotImage = document.querySelector(".tarot-img")

    
    $cardName.innerText = tarotCard.card[0].name
    $tarotImage.src = `/assets/tarot/${tarotCard.card[0].name_short}.jpg`
    $tarotImage.alt = `${tarotCard.card[0].name}`
    $cardMeaning.innerText = getMeaning(tarotCard, $tarotImage)
    $desc.innerText = tarotCard.card[0].desc
}

function getMeaning(tarotCard, $tarotImage){
    if (tarotCard.direction === "up"){
        return `Up: ${tarotCard.card[0].meaning_up}`
    } else {
        $tarotImage.classList.add("upside-down")
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
                    question: userQuestion.trim(),
                    user_id: userID,
                    card_id: tarotCard.card[0].id,
                    direction: tarotCard.direction
                }
            })
        })
                .then(response => response.json())
                .then(result => {
                    appendReading(result)
                    userQuestion = null
                    toggleHidden([$displayReadings, $getReadingForm, $newReading, document.querySelector("footer")])
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

function getHoroscope(){
    fetch(`${backendURL}/horoscope?user_id=${userID}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(result => {
            $horoscope.textContent = result.horoscope
        })
}

function addDeleteAccount(){
    $deleteAccountButton.addEventListener('click', (_) => {
        confirmDelete()
    })
}

function confirmDelete(){
    toggleHidden([document.querySelector("main"), $logoutButton, $deleteAccountButton, $confirmDelete])
    const $confirmDeleteButton = document.querySelector(".yes-delete")
    const $dontDeleteButton = document.querySelector(".dont-delete")
    $confirmDeleteButton.addEventListener('click', (_) => {
        fetch(`${backendURL}/users/${userID}`, {
            method: "Delete",
            headers: {
                "Authorization": `Bearer ${localStorage.token}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                localStorage.removeItem('token')
                location.replace('/')
            })
    })
    $dontDeleteButton.addEventListener('click', (_) => {
        toggleHidden([document.querySelector("main"), $logoutButton, $deleteAccountButton, $confirmDelete])
    })
}