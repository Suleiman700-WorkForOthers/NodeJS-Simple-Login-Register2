// define buttons
const signupButton = document.querySelector('button#signup')
const loginButton = document.querySelector('#navigate-login')

// define signup fields
const field_fullname = document.querySelector('#fullname')
const field_email = document.querySelector('#email')
const field_password = document.querySelector('#password')

// define sections
const section_register = document.querySelector('#register-section')
const section_success = document.querySelector('#success-section')


// declare click event on buttons
signupButton.addEventListener('click', () => {
    performSignup()
})

loginButton.addEventListener('click', () => {
    // redirect to login page
    window.location.replace('../login/index.html');
})

// perform signup process
async function performSignup() {
    // flag to determine if all fields are valid
    let valid = true

    // store field errors
    let errors = []

    // check fullname field
    const fullname = field_fullname.value
    if (!fullname.length) {
        // update flag
        valid = false

        // store error
        const error = {
            'msg': 'Fullname is invalid'
        }
        errors.push(error)
    }


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
        signupButton.setAttribute('disabled', 'disabled')

        // send request
        await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullname,
                email,
                password
            })
        })
            .then(response => response.json())
            .then(response => {
                // no errors
                if (!response['errors'].length) {
                    hideAlert()

                    // remove register section
                    section_register.remove()

                    // show successful register section
                    section_success.style.display = 'block'
                }
                // response have errors
                else {
                    // show errors
                    showAlert(response['errors'])

                    console.log(errors)
                }
            })
            .catch(requestError => {
                console.error(requestError)

                const error = [{'msg': 'Server is not available'}]
                showAlert(error)
            });

        // enable button
        signupButton.removeAttribute('disabled')

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