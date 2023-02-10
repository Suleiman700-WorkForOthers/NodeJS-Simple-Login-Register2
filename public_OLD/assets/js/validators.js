/**
 * receive email and validate it
 * @param _email {string} example: user@domain.com
 * @return {boolean}
 */
function validateEmail(_email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(_email)) return true
    else return false
}