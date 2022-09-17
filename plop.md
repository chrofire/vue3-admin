# plop 使用说明

## crud模板生成器

```sh
$ npx plop
? [PLOP] Please choose a generator. crudTemplate - crud模板生成器
? 请输入 模块名称 (驼峰) role
? 请输入 模块中文名称 角色
? 请输入 父级模块路径 (例如: system 或 path1/path2) [非必填] system
? 是否需要手动输入文件保存目录路径? Yes
? 请输入 文件保存目录路径 (例如: src/views) src/views/system
⠋ {
  moduleName: 'role',
  moduleCnName: '角色',
  parentModulePath: 'system',
  isCustomPath: true,
  fileSaveDirPath: 'src/views/system',
  pascalCaseModuleName: 'Role',
  parentPermissionPath: 'system:',
  parentApiPath: 'system.'
}
✔  ++ \src\views\system\role\index.vue
✔  ++ \src\views\system\role\RoleContentDialog.vue
✔  ++ \src\views\system\role\constant.js
```

## crudApi模板生成器

```sh
$ npx plop
? [PLOP] Please choose a generator. crudApiTemplate - crudApi模板生成器
? 请输入 模块名称 (驼峰) role
? 请输入 模块Api路径 (例如: system/user) role
? 请输入 模块中文名称 角色
? 请选择 需要生成的接口 addData, deleteData, updateData, list, pageList
? 是否需要手动输入文件保存目录路径? Yes
? 请输入 文件保存目录路径 (例如: src/api) src/api/system
⠋ {
    moduleName: 'role',
    moduleApiPath: 'role',
    moduleCnName: '角色',
    apiTypeList: [ 'addData', 'deleteData', 'updateData', 'list', 'pageList' ],
    isCustomPath: true,
    fileSaveDirPath: 'src/api/system',
    apiTypeMap: {
        addData: true,
        deleteData: true,
        updateData: true,
        list: true,
        pageList: true
    }
}
✔  ++ \src\api\system\role.js
```