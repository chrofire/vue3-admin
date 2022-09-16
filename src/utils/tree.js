/**
 * 数组 转 树
 * @param {array} data 数组
 * @param {object} options 配置项
 * @returns {array}
 */
export function listToTree (data, options = {}) {
    const { idKey = `id`, parentIdKey = `parentId`, childrenKey = `children` } = options

    const map = {}

    data.forEach(node => {
        // 初始化 node children 为 空数组
        node[childrenKey] = []
        map[node[idKey]] = node
    })

    const tree = []

    data.forEach(node => {
        const parent = map[node[parentIdKey]]
        if (parent) {
            parent[childrenKey].push(node)
        } else {
            tree.push(node)
        }
    })

    return tree
}

/**
 * 过滤掉树指定节点及其子节点
 * @param {array} data 树
 * @param {array} idList 需要过滤掉的节点数组
 * @param {object} options 配置项
 * @returns {array}
 */
export function filterTreeNodes (data, idList = [], options = {}) {
    const { idKey = `id`, childrenKey = `children` } = options

    const list = data.map(node => {
        if (idList.includes(node[idKey])) {
            return null
        }

        if (!node[childrenKey]) return node

        return {
            ...node,
            [childrenKey]: filterTreeNodes(node[childrenKey], idList, options)
        }
    })
    return list.filter(Boolean)
}
