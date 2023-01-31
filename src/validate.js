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
        console.log('isValidUser: wrong passowd')
        return false
    }

    if (!isPositiveInteger(data.id)) {
        console.log('isValidBook: felaktigt id')
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

export { isValidData, isPositiveInteger }