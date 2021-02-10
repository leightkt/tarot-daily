console.log("%cHey you beautiful genderfull unicorn!", "color: magenta")
const backendURL = "http://localhost:9000"
const $loginForm = document.querySelector(".login-form")
const $welcome = document.querySelector(".welcome")
const $displayReadings = document.querySelector(".display-readings")
const $getReadingForm = document.querySelector(".get-reading")
const $newReading = document.querySelector(".new-reading")
const $saveButton = document.querySelector(".save")
const $backButton = document.querySelector(".back")
let userID = null
let question = null

addActionToGetReading()
addActionToLogin()
addActionToBack()

if (userID){
    fetch(`${backendURL}/users/${userID}`)
        .then(response => response.json())
        .then(user => {
            welcomeUser(user)
        })
}

function addActionToLogin() {
    $loginForm.addEventListener('submit', (event) => {
        event.preventDefault()
    
        const formdata = new FormData($loginForm)
        const user_name = formdata.get('user_name')
        const password = formdata.get('password')
        getSavedReadings(user_name, password)
    })
}

function getSavedReadings(user_name, password){
    fetch(`${backendURL}/login`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_name: user_name,
            password: password
        })
    })
        .then(response => response.json())
        .then(user => {
            if (user.errors){
                console.log(user.errors)
            }
            else {
                console.log(user)
                userID = user.id
                welcomeUser(user)
            }
        })
}

function welcomeUser(user){
    $welcome.innerText = `Welcome ${user.name}!`
    $welcome.parentNode.classList.remove("hidden")
    $loginForm.classList.add("hidden")
    $displayReadings.classList.remove("hidden")
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
    $readingPageLink.href = `show.html?reading_id=${reading.id}&user_id=${userID}`

    $readingPageLink.appendChild($readingbutton)

    $displayReadings.append($date, $question, $readingPageLink)
}

function addActionToGetReading() {
    $getReadingForm.addEventListener('submit', (event) => {
        event.preventDefault()
        $displayReadings.classList.add("hidden")
        $getReadingForm.classList.add("hidden")
        $newReading.classList.remove("hidden")

        const formdata = new FormData($getReadingForm)
        question = formdata.get('question')

        fetch(`${backendURL}/reading`)
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
    console.log(tarotCard.direction)
    if (tarotCard.direction === "up"){
        return `Up: ${tarotCard.card[0].meaning_up}`
    } else {
        return `Down ${tarotCard.card[0].meaning_rev}`
    }
}

function addActionToBack(){
    $backButton.addEventListener('click', (_) => {
        $newReading.classList.add("hidden")
        $displayReadings.classList.remove("hidden")
    })
}

function addActionToSave(tarotCard){
    $saveButton.addEventListener('click', (_) => {

        fetch(`${backendURL}/readings`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                reading: {
                    question: question,
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
                    $displayReadings.classList.remove("hidden")
                    $getReadingForm.classList.remove("hidden")
                    $newReading.classList.add("hidden")
                })
    })
}