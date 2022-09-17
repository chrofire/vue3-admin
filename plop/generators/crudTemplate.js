const path = require('path')
const fs = require('fs')

module.exports = (/** @type {import('plop').NodePlopAPI} */ plop) => {
    plop.setGenerator('crudTemplate', {
        description: 'crud模板生成器',
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
                type: 'input',
                name: 'parentModulePath',
                message: '请输入 父级模块路径 (例如: system 或 module1/module2) [非必填]',
                validate (val) {
                    return true
                }
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
                message: '请输入 文件保存目录路径 (例如: src/views)',
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
                    'src/views'
                ],
                default: 'src/views'
            }
        ],
        // 构建文件 (data) => [] || []
        actions (data) {
            const { moduleName, parentModulePath, fileSaveDirPath } = data

            // 首字母大写 + 驼峰
            const pascalCaseModuleName = `${moduleName.slice(0, 1).toUpperCase()}${moduleName.slice(1)}`

            // 父级权限路径
            let parentPermissionPath = ''
            // 父级Api路径
            let parentApiPath = ''
            if (parentModulePath) {
                parentPermissionPath = `${parentModulePath.replace('/', ':')}:`
                parentApiPath = `${parentModulePath.replace('/', '.')}.`
            }

            Object.assign(data, { pascalCaseModuleName, parentPermissionPath, parentApiPath })

            console.log(data)

            const fullDirPath = path.resolve(__dirname, `../../${fileSaveDirPath}/${moduleName}`)

            // 删除 moduleName 文件夹
            fs.rmSync(fullDirPath, { recursive: true, force: true })

            // 创建 moduleName 文件夹
            fs.mkdirSync(fullDirPath)

            // return []
            return [
                {
                    // 添加文件
                    type: 'add',
                    // 文件路径
                    path: path.resolve(fullDirPath, `index.vue`),
                    // 模板路径
                    templateFile: `plop/templates/crudTemplate/index.vue.hbs`
                },
                {
                    type: 'add',
                    path: path.resolve(fullDirPath, `${pascalCaseModuleName}ContentDialog.vue`),
                    templateFile: `plop/templates/crudTemplate/contentDialog.vue.hbs`
                },
                {
                    type: 'add',
                    path: path.resolve(fullDirPath, `constant.js`),
                    // 模板路径
                    templateFile: `plop/templates/crudTemplate/constant.js.hbs`
                }
            ]
        }
    })
}