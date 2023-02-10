// define buttons
const signupButton = document.querySelector('#signup')
const loginButton = document.querySelector('#login')

// define signup fields
const field_email = document.querySelector('#email')
const field_password = document.querySelector('#password')


// declare click event on buttons
loginButton.addEventListener('click', () => {
    performLogin()
})

signupButton.addEventListener('click', () => {
    // redirect to login page
    window.location.replace('../signup/index.html');
})

async function performLogin() {
    // flag to determine if all fields are valid
    let valid = true

    // store field errors
    let errors = []

    // check email field
    const email = field_email.value
    if (!email.length || !validateEmail(email)) {
        // update flag
        valid = false

        // store error
        const error = {
            'msg': 'Email is invalid'
        }
        errors.push(error)
    }

    // check password field
    const password = field_password.value
    if (!password.length) {
        // update flag
        valid = false

        // store error
        const error = {
            'msg': 'Password is invalid'
        }
        errors.push(error)
    }


    if (valid) {
        // hide alert
        hideAlert()

        // disable button
        loginButton.setAttribute('disabled', 'disabled')

        // send request
        await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })
            .then(response => response.json())
            .then(response => {
                // no errors
                if (!response['errors'].length) {
                    hideAlert()

                    // store token
                    localStorage.setItem('token', response['token'])

                    // redirect to dashboard
                    window.location.replace('../dashboard/index.html');
                }
                // response have errors
                else {
                    // show errors
                    showAlert(response['errors'])
                }
            })
            .catch(requestError => {
                console.error(requestError)

                const error = [{'msg': 'Server is not available'}]
                showAlert(error)
            });

        // enable button
        loginButton.removeAttribute('disabled')

    } else {
        // show alert
        showAlert(errors)
    }
}

/**
 * show error in alert section
 * @param _errors {array} example ['error one', 'error two']
 * @return {void}
 */
function showAlert(_errors) {
    const alert = document.querySelector('#alert')

    // convert errors into paragraphs
    const errorHTML = _errors
        .map(error => `<p>${error['msg']}</p>`)
        .join('');

    // set alert text
    alert.innerHTML = errorHTML

    // show alert
    alert.style.display = 'block'
}

/**
 * hide alert section
 * @return {void}
 */
function hideAlert() {
    const alert = document.querySelector('#alert')
    alert.style.display = 'none'
}