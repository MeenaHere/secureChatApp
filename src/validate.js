//Checks if the provided data object contains valid user information.
function isValidData(data) {
    if (!isValidString(data.firstName)) {
        console.log('isValidData: wrong first name')
        return false
    }

    if (!isValidString(data.lastName)) {
        console.log('isValidData: wrong last name')
        return false
    }

    if (!isValidString(data.username)) {
        console.log('isValidData: wrong username')
        return false
    }

    if (!isValidString(data.password)) {
        console.log('isValidData: wrong format password')
        return false
    }

    return true
}

//Checks if the provided message object contains valid message information.

function isValidMessage(maybeData) {
    if (!isValidString(maybeData.username)) {
        console.log('isValidMessage: wrong username')
        return false
    }

    if (!isValidString(maybeData.message)) {
        console.log('isValidMessage: wrong message')
        return false
    }

    if (!isValidString(maybeData.channelName)) {
        console.log('isValidMessage: wrong channel name')
        return false
    }

    return true
}

 // Checks if the input is a non-empty string.
function isValidString(input) {
    return typeof input === 'string' && input.length > 0
}

//Checks if the input is a positive integer.
function isPositiveInteger(x) {
    const isNumber = typeof x === 'number'
    const isInteger = x % 1 === 0
    return isNumber && x > 0 && isInteger
}

// Export functions for use in other modules
export { isValidData, isPositiveInteger, isValidMessage }