<template>
    <el-config-provider :locale="zhCn" :message="{ max: 1 }">
        <router-view />
    </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>

<style lang="scss">
@import "@/styles/index.scss";
</style>
