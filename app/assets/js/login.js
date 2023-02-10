
// declare sign in button
const buttonSignin = document.querySelector('#signin')

// declare form
const form = document.querySelector('#form-login')

// declare endpoint
const endpoint = 'localhost:3000/api/login'

// declare form submit
form.addEventListener('submit', (event) => {
    event.preventDefault()

    // get email
    const email = document.querySelector('#email').value

    // get password
    const password = document.querySelector('#password').value

    // send request to server

    console.log('submit')
})