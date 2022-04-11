<template>
    <div class="top-bar">
        <div class="breadcrumb">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item
                    v-for="item in route?.meta?.breadcrumb || []"
                    :key="item.name"
                >
                    <span>{{ item.name }}</span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="user">
            <el-dropdown>
                <div class="nickname">
                    {{ systemStore.userInfo.nickname }}
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="UpdatePasswordDialogRef.openDialog()">修改密码</el-dropdown-item>
                        <el-dropdown-item @click="systemStore.logout()">注销</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <UpdatePasswordDialog ref="UpdatePasswordDialogRef"></UpdatePasswordDialog>
    </div>
</template>

<script setup>
import { useSystemStore } from '@/stores/system.js'
import { ArrowRight } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import UpdatePasswordDialog from './UpdatePasswordDialog.vue'

const UpdatePasswordDialogRef = ref(null)
const route = useRoute()
const systemStore = useSystemStore()
</script>

<style lang="scss" scoped>
.top-bar {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    .user {
        .nickname {
            cursor: default;
        }
    }
}
</style>