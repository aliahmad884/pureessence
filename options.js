let chracters = 'gklmABCDEFGHIJOPQRopqrSTUVWXYZabcdefghinstuKLMNvwxyz'
export const strGen = (length) => {
    let str = ''
    for (let i = 0; i < length; i++) {
        str += chracters.charAt(Math.floor(Math.random() * chracters.length))
    }
    return str
}
