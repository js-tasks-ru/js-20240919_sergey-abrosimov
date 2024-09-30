/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (size == 0) return ''
    let counter = 0
    let result = ''
    for (let i = 0; i <= string.length - 1; i++) {
        if (string[i] == string[i + 1]) counter++
        if (counter == size) {
            counter = 0
            continue
        } else {
            result += string[i]
        }

    }
    return result
}
