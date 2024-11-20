let chracters = 'gklmABCDEFGHIJOPQRopqrSTUVWXYZabcdefghinstuKLMNvwxyz'
export const strGen = (length) => {
    let str = ''
    for (let i = 0; i < length; i++) {
        str += chracters.charAt(Math.floor(Math.random() * chracters.length))
    }
    return str;
}

export const saveCache = async (data, key) => {
    console.log('Save Cache function called')
    const currentVersion = await fetchVersion(key)
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }))
    localStorage.setItem(`${key}version`, JSON.stringify(currentVersion))
}

const fetchVersion = async (key) => {
    try {
        let res = await fetch(`/api/blog?getVersion=${key}`);
        let result = await res.json()
        return result;
    }
    catch (err) {
        console.log(err)
        return null;
    }
}

export const loadCache = async (key) => {
    const currentVersion = await fetchVersion(key)
    const prevVersion = JSON.parse(localStorage.getItem(`${key}version`))
    const cache = JSON.parse(localStorage.getItem(key))
    if (cache && prevVersion.key === key && currentVersion.version === prevVersion.version) {
        console.log('cached data available!')
        return cache.data;
    }
    console.log('Versions are not identical.')
    return null;
}
export const checkLocalStorageUsage = () => {
    let totalUsed = 0;
    for (let item in localStorage) {
        if (localStorage.hasOwnProperty(item)) {
            let itemSize = (localStorage.getItem(item).length + item.length) * 2;
            totalUsed += itemSize;
        }
    }
    const totalCapacity = 5 * 1024 * 1024; // Most browsers have a 5 MB limit
    const usedMB = (totalUsed / (1024 * 1024)).toFixed(2);
    const remainingMB = ((totalCapacity - totalUsed) / (1024 * 1024)).toFixed(2);

    console.log(`Approximate localStorage usage: ${usedMB} MB`);
    console.log(`Approximate remaining capacity: ${remainingMB} MB`);
    return { usedMB, remainingMB };
}
