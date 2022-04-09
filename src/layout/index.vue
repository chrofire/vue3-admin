<template>
    <div class="main-layout">
        <div class="main-layout-left">
            <div class="top">title</div>
            <div class="bottom">
                <SideBar></SideBar>
            </div>
        </div>
        <div class="main-layout-right">
            <TopBar></TopBar>
            <TagBar></TagBar>
            <div class="main-layout-content">
                <router-view v-slot="{ Component, route }">
                    <transition name="el-fade-in-linear" mode="out-in" appear>
                        <keep-alive :include="tagBarStore.cacheList">
                            <component :is="Component" :key="route.fullPath"></component>
                        </keep-alive>
                    </transition>
                </router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import SideBar from './SideBar/index.vue'
import TopBar from './TopBar/index.vue'
import TagBar from './TagBar/index.vue'
import { useTagBarStore } from '@/stores/tagBar.js'

const tagBarStore = useTagBarStore()
</script>

<style lang="scss" scoped>
.main-layout {
    width: 100%;
    height: 100%;
    display: flex;
    .main-layout-left {
        display: flex;
        flex-flow: column nowrap;
        .top {
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #8c8c8c;
            color: #fff;
        }
        .bottom {
            flex: 1 0;
            min-height: 0;
        }
    }
    .main-layout-right {
        flex: 1 0;
        min-width: 0;
        display: flex;
        flex-flow: column nowrap;
        .main-layout-content {
            display: flex;
            flex: 1 0;
            min-height: 0;
        }
    }
}
</style>