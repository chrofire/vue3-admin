const path = require('path')

module.exports = (/** @type {import('plop').NodePlopAPI} */ plop) => {
    plop.setGenerator('crudApiTemplate', {
        description: 'crudApi模板生成器',
        // 输入内容
        prompts: [
            {
                // 交互类型
                type: 'input',
                // 字段名
                name: 'moduleName',
                // 交互提示
                message: '请输入 模块名称 (驼峰)',
                validate (val) {
                    if (val) return true
                    return '模块名称不能为空'
                }
            },
            {
                // 交互类型
                type: 'input',
                // 字段名
                name: 'moduleApiPath',
                // 交互提示
                message: '请输入 模块Api路径 (例如: system/user)',
                validate (val) {
                    if (val) return true
                    return '模块Api路径不能为空'
                }
            },
            {
                type: 'input',
                name: 'moduleCnName',
                message: '请输入 模块中文名称',
                validate (val) {
                    if (!val) return '模块中文名称不能为空'
                    const isCnReg = /^[\u4E00-\u9FA5]+$/
                    if (!isCnReg.test(val)) return '模块中文名称必须包含中文'
                    return true
                }
            },
            {
                type: 'checkbox',
                name: 'apiTypeList',
                message: '请选择 需要生成的接口',
                choices: [
                    {
                        name: 'addData',
                        checked: true
                    },
                    {
                        name: 'deleteData',
                        checked: true
                    },
                    {
                        name: 'updateData',
                        checked: true
                    },
                    {
                        name: 'list'
                    },
                    {
                        name: 'pageList',
                        checked: true
                    }
                ]
            },
            {
                // (y/n) 确认
                type: 'confirm',
                name: 'isCustomPath',
                message: '是否需要手动输入文件保存目录路径?',
                default: false
            },
            {
                when (answers) {
                    const { isCustomPath } = answers
                    if (isCustomPath) return true
                    return false
                },
                type: 'input',
                name: 'fileSaveDirPath',
                message: '请输入 文件保存目录路径 (例如: src/api)',
                validate (val) {
                    if (val) return true
                    return '文件保存目录路径不能为空'
                }
            },
            {
                when (answers) {
                    const { isCustomPath } = answers
                    if (isCustomPath) return false
                    return true
                },
                // 单选
                type: 'list',
                name: 'fileSaveDirPath',
                message: '请选择 文件保存目录路径',
                choices: [
                    'src/api'
                ],
                default: 'src/api'
            }
        ],
        // 构建文件 (data) => [] || []
        actions (data) {
            const { moduleName, apiTypeList, fileSaveDirPath } = data

            const apiTypeMap = apiTypeList.reduce((prev, current) => {
                prev[current] = true
                return prev
            }, {})

            Object.assign(data, { apiTypeMap })

            console.log(data)

            return [
                {
                    // 添加文件
                    type: 'add',
                    // 文件路径
                    path: path.resolve(__dirname, `../../${fileSaveDirPath}`, `${moduleName}.js`),
                    // 模板路径
                    templateFile: `plop/templates/crudApiTemplate.js.hbs`,
                    force: true
                }
            ]
        }
    })
}