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
    </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style lang="scss" scoped>
.top-bar {
    height: 50px;
    display: flex;
    align-items: center;
    .breadcrumb {
        margin-left: 10px;
    }
}
</style>