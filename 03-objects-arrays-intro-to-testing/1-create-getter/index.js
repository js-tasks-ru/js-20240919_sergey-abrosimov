/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const arr = path.split('.')
    return (obj) => {
        let res = obj        
        for (const el of arr) {
            if (!res.hasOwnProperty(el)) {
                return
            }
            res = res[el]            
        }
        return res
    }    
}
