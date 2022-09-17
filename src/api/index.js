const api = {}

const modules = import.meta.glob(`./**/*.js`, { eager: true })

const entries = Object.entries(modules).map(([key, value]) => {
    let keyArr = key.replaceAll('./', '').replaceAll('/', '.').replace(/\.js$/g, '').split('.')
    // index中的内容存放到父级对象中
    keyArr = keyArr[keyArr.length - 1] === `index` ? keyArr.slice(0, -1) : keyArr
    return [
        keyArr,
        { ...value }
    ]
}).sort((a, b) => a[0].length - b[0].length)

entries.forEach(([keyArr, value]) => {
    keyArr.reduce((prev, item, index) => {
        if (index === keyArr.length - 1) {
            return (prev[item] = value)
        } else {
            return prev[item] ? prev[item] : (prev[item] = {})
        }
    }, api)
})

export const useApi = path => {
    if (!path) return api
    const arr = path.split('.')
    const res = arr.reduce((prev, item, index) => {
        if (!prev[item]) throw new Error(`${arr.slice(0, index + 1).join('.')} 路径错误`)
        return prev[item]
    }, api)
    return res
}

export default api