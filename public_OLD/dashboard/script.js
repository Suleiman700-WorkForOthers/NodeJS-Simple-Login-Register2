
// check if user is logged-in
async function checkIsLogged() {
    // retrieve the token from local storage
    const token = localStorage.getItem('token')

    await fetch('http://localhost:3000/auth/is-logged', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(response => {
            // user is logged-in
            if (response['state']) {
                const userData = response['userData']

                // show user data in dashboard
                document.querySelector('#id').innerText = userData['_id']
                document.querySelector('#fullname').innerText = userData['fullname']
                document.querySelector('#email').innerText = userData['email']
            }
            // user is not logged-in
            else {
                // redirect to login page
                window.location.replace('../login/index.html');
            }
        })
        .catch(error => {
            // redirect to login page
            window.location.replace('../login/index.html');
        });
}

checkIsLogged()


// declare logout button click
document.querySelector('#logout').addEventListener('click', async () => {
    // delete token from local storage
    localStorage.removeItem('token')

    // redirect to login page
    window.location.replace('../login/index.html');
})