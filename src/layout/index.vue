<template>
    <div class="main-layout">
        <div class="main-layout-left">
            <div class="top" :style="{
                flexDirection: systemStore.sideBarCollapse ? 'column' : 'row'
            }">
                <div>管理</div>
                <div>系统</div>
            </div>
            <div class="middle">
                <SideBar></SideBar>
            </div>
            <div class="bottom" @click="systemStore.toggleSideBarCollapse()">
                <i class="i-ep-switch"></i>
            </div>
        </div>
        <div class="main-layout-right">
            <TopBar></TopBar>
            <TagBar></TagBar>
            <div class="main-layout-content">
                <router-view v-slot="{ Component, route }">
                    <transition name="el-fade-in-linear" mode="out-in" appear>
                        <keep-alive v-if="isPROD" :include="tagBarStore.cacheList">
                            <component :is="Component" :key="route.fullPath"></component>
                        </keep-alive>
                        <component v-else :is="Component" :key="route.fullPath"></component>
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
import { useSystemStore } from '@/stores/system.js'

const isPROD = import.meta.env.PROD

const tagBarStore = useTagBarStore()
const systemStore = useSystemStore()
</script>

<style lang="scss" scoped>
.main-layout {
    width: 100%;
    height: 100%;
    display: flex;
    .main-layout-left {
        display: flex;
        flex-flow: column nowrap;
        border-right: solid 1px var(--el-menu-border-color);
        .top {
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--el-text-color-secondary);
            border-bottom: solid 1px var(--el-menu-border-color);
        }
        .middle {
            flex: 1 0;
            min-height: 0;
        }
        .bottom {
            height: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-top: 1px solid var(--el-menu-border-color);
            transition: all 0.3s;
            cursor: pointer;
            &:hover {
                color: var(--el-color-primary);
                background-color: var(--el-color-primary-light-9);
            }
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