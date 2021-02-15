console.log("%cHey you beautiful genderfull unicorn!", "color: magenta")
const backendURL = "http://localhost:9000"
const $loginForm = document.querySelector(".login-form")
const $errors = document.querySelector(".errors")
const $signUpButton = document.querySelector(".sign-up")
const $signupForm = document.querySelector(".signup-form")
const $signupErrors = document.querySelector(".signup-errors")
const $backToLoginButton = document.querySelector(".back-to-login")


$loginForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formdata = new FormData($loginForm)
    const user_name = formdata.get('user_name')
    const password = formdata.get('password')
    login(user_name, password)
})

function login(user_name, password){
    fetch(`${backendURL}/login`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user: {
                user_name,
                password
            }
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.errors){
                $errors.classList.remove("hidden")
                $errors.innerText = data.errors
            }
            else {
                const token = data.token
                localStorage.setItem('token', token)
                $loginForm.reset()
                window.location.replace(`user.html?user_id=${data.user_id}`)
            }
        })
}

$signUpButton.addEventListener('click', (event) => {
    event.preventDefault()
    toggleHidden([$loginForm, $signupForm, $signUpButton, $signUpButton.parentElement])
})

$signupForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const name = formData.get('name')
    const user_name = formData.get('username')
    const password = formData.get('password')
    const star_sign = formData.get('star-sign')

    fetch(`${backendURL}/users`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user: {
                name,
                user_name,
                password,
                star_sign
            }
        })
    })
    .then(response => response.json())
        .then(data => {
            if (data.errors){
                console.log(data.errors)
                toggleHidden([$signupErrors])
                $signupErrors.innerText = data.errors[0]
            }
            else {
                toggleHidden([$signupErrors, $backToLoginButton])
                $signupErrors.textContent = "Thanks for signing up! Please log in with your new information!"
                $signupForm.reset()
            }
        })
})

$backToLoginButton.addEventListener('click', (_) => {
    toggleHidden([$backToLoginButton, $signupErrors, $signupForm, $loginForm])
})

function toggleHidden(elements){
    elements.forEach(element => {element.classList.toggle("hidden")})
}