/**
 * 构建树
 * @param {array} data 构建数据数组
 * @param {string} id id
 * @param {string} parentId 父级id
 * @param {string} childrenName childrenName
 * @returns {array}
 */
export function listToTree (
    data,
    id = `id`,
    parentId = `parentId`,
    childrenName = `children`
) {
    const map = {}
    data.forEach(item => {
        item[childrenName] = []
        map[item[id]] = item
    })
    const result = []
    data.forEach(item => {
        const parent = map[item[parentId]]
        if (parent) {
            parent[childrenName].push(item)
        } else {
            result.push(item)
        }
    })
    return result
}

/**
 * 过滤树指定节点及其子节点
 * @param {array} tree 树
 * @param {array} idList 过滤节点ids
 * @param {object} opts 配置项
 * @returns {array}
 */
export function filterTreeItems (
    tree,
    idList = [],
    opts = {
        id: `id`,
        childrenName: `children`
    }
) {
    const res = tree.map(item => {
        if (idList.includes(item[opts.id])) {
            return null
        }
        
        if (!item[opts.childrenName]) return item

        return {
            ...item,
            [opts.childrenName]: filterTreeItems(item[opts.childrenName], idList, opts)
        }
    })
    return res.filter(Boolean)
}
