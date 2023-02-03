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

    return true

}

function isValidMessage(maybeData) {
    const validPart = isValidData(maybeData)
    if (!validPart) {
        return false
    }

    if (!isPositiveInteger(maybeData.id)) {
        console.log('isValidUser: wrong id')
        return false
    }

    return true
}

function isNonEmptyString(input) {
    typeof input === 'string' && input.length > 0
    return true
}

function isPositiveInteger(x) {
    const isNumber = typeof x === 'number'
    const isInteger = x % 1 === 0
    return isNumber && x > 0 && isInteger
}

export { isValidData, isPositiveInteger }