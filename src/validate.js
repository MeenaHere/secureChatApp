function isValidData(data) {
    if (!isNonEmptyString(data.firstName)) {
        console.log('isValidUser: wrong first name')
        return false
    }

    if (!isNonEmptyString(data.lastName)) {
        console.log('isValidUser: wrong last name')
        return false
    }

    if (!isNonEmptyString(data.username)) {
        console.log('isValidUser: wrong username')
        return false
    }

    if (!isNonEmptyString(data.password)) {
        console.log('isValidUser: wrong format password')
        return false
    }
    return true
}

function isValidMessage(maybeData) {
    if (!isNonEmptyString(maybeData.username)) {
        console.log('isValidUser: wrong username')
        return false
    }

    if (!isNonEmptyString(maybeData.message)) {
        console.log('isValidUser: wrong message')
        return false
    }

    if (!isNonEmptyString(maybeData.channelName)) {
        console.log('isValidUser: wrong channel name')
        return false
    }

    return true
}

function isNonEmptyString(input) {
    return typeof input === 'string' && input.length > 0
}

function isPositiveInteger(x) {
    const isNumber = typeof x === 'number'
    const isInteger = x % 1 === 0
    return isNumber && x > 0 && isInteger
}

export { isValidData, isPositiveInteger, isValidMessage }