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
    const currentVersion = await fetchVersion()
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }))
    localStorage.setItem('blogVersion', currentVersion.version)
}

const fetchVersion = async () => {
    try {
        // let str = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas suscipit maiores vero animi modi totam earum magnam expedita temporibus, libero provident sint ipsa dignissimos veritatis odio, aut numquam blanditiis. Quia.'
        // let arr = str.split('')
        // console.log(arr)
        // console.log('str length: ', arr.length)
        let res = await fetch('/api/blog?getVersion=blog');
        let result = await res.json()
        console.log(result)
        return result;
    }
    catch (err) {
        console.log(err)
        return null;
    }
}

export const loadCache = async (key, time) => {
    const currentVersion = await fetchVersion()
    const prevVersion = localStorage.getItem('blogVersion')
    const cache = JSON.parse(localStorage.getItem(key))
    if (cache && Date.now() - cache.timestamp < time && currentVersion.version === prevVersion) {
        return cache.data;
    }
    console.log('versions are not samed.')
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
