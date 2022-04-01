<template>
    <div class="demo">
        <BasicDialog @register="registerDialog" v-bind="dialogProps">
            <!-- <template #title>标题</template> -->
            <!-- <template #default>内容</template> -->
            <!-- <template #footer>底部</template> -->
        </BasicDialog>
        <el-button @click="handleClick">open</el-button>
    </div>
</template>

<script setup>
import BasicDialog, { useDialog } from '@/components/BasicDialog/index.vue'
import { h } from 'vue'

const [registerDialog, {
    componentProps: dialogProps,
    setVisible: setDialogVisible
}] = useDialog({
    title: '标题',
    render () {
        return h('div', null, '内容')
    },
    // confirm: '提交',
    // confirm: () => h('div', null, '提交'),
    confirmProps: {
        onClick: () => confirmDialog()
    },
    cancelProps: {
        onClick: () => setDialogVisible(false)
    },
    onClose () {
        console.log(`onClose`)
    }
})

const handleClick = () => {
    setDialogVisible(true)
    // dialogProps.title = () => h('div', null, 'title')
}

const confirmDialog = () => {
    setDialogVisible(false)
    console.log(`confirmDialog`)
}

</script>

<style lang="scss" scoped>
.demo {
    width: 100%;
    height: 100%;
}
</style>