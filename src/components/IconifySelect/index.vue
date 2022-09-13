<template>
    <div
        class="iconify-select"
        v-click-outside:[popperPaneRef]="handleClickOutside"
        @click.stop="toggleSelectContent"
        v-bind="attrs"
    >
        <el-tooltip
            ref="tooltipRef"
            :visible="state.visible"
            :popper-class="styles[`iconify-select__popper`]"
            placement="bottom-start"
            effect="light"
            pure
            transition="el-zoom-in-top"
            :stop-popper-mouse-event="true"
            :gpu-acceleration="false"
            persistent
        >
            <template #default>
                <el-input
                    ref="inputRef"
                    v-model="modelValue"
                    :readonly="true"
                    :clearable="true"
                    :class="[
                        `iconify-select__input`,
                        { 'is-focus': state.visible && validateState !== `error` }
                    ]"
                    @mouseenter="state.inputHovering = true"
                    @mouseleave="state.inputHovering = false"
                    :validate-event="false"
                    :disabled="disabled"
                    :placeholder="placeholder"
                >
                    <template #prefix>
                        <i :class="modelValue"> </i>
                    </template>
                    <template #suffix>
                        <i
                            v-show="!showClose"
                            :class="[
                                'i-ep-arrow-down',
                                'suffix-icon',
                                { 'is-reverse': state.visible }
                            ]"
                        ></i>
                        <i
                            v-show="showClose"
                            class="i-ep-circle-close"
                            @click.stop="resetField"
                        ></i>
                    </template>
                </el-input>
            </template>
            <template #content>
                <div :style="selectContentStyle">
                    <el-scrollbar
                        ref="scrollbarRef"
                        :max-height="maxContentHeight"
                        :view-style="[{ margin: `8px 0` }]"
                    >
                        <div
                            class="iconify-select__icon-list"
                            :style="{
                                minWidth: `${state.inputWidth}px`
                            }"
                        >
                            <div
                                :class="['icon-item', { 'is-current': modelValue === item }]"
                                v-for="item in epIconList"
                                :key="item"
                                @click.stop="handleSelect(item)"
                            >
                                <i :class="[item, 'text-25px', 'text-$el-color-info-dark-2']"></i>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </template>
        </el-tooltip>
    </div>
</template>

<script>
export default {
    name: 'IconifySelect'
}
</script>

<script setup>
import { computed, nextTick, reactive, ref, unref, useAttrs, useCssModule, watch } from 'vue'
import { useDisabled, useFormItem } from 'element-plus'
import { debugWarn } from 'element-plus/lib/utils/index'
import { ClickOutside as vClickOutside } from 'element-plus/lib/directives/index'

import * as epIcons from '@iconify-json/ep'
const epIconList = Object.keys(epIcons.icons.icons).map(
    name => `i-${epIcons.icons.prefix}-${name}`
)

const tooltipRef = ref(null)
const scrollbarRef = ref(null)
const inputRef = ref(null)
const popperPaneRef = computed(() => {
    return tooltipRef.value?.popperRef?.contentRef
})

const attrs = useAttrs()

const props = defineProps({
    modelValue: {
        type: String,
        default: () => undefined
    },
    clearable: {
        type: Boolean,
        default: false
    },
    maxContentHeight: {
        type: Number,
        default: 300
    },
    // form 校验, 只支持 change
    validateEvent: {
        type: Boolean,
        default: true
    },
    disabled: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue', 'visible-change'])

const styles = useCssModule()

const state = reactive({
    visible: false,
    inputWidth: 0,
    inputHovering: false
})

const handleSelect = name => {
    emit('update:modelValue', name)
    handleClickOutside()
}

const { formItem } = useFormItem()

const validateState = computed(() => formItem?.validateState || '')
const selectDisabled = useDisabled()

const toggleSelectContent = () => {
    if (unref(selectDisabled)) return
    state.visible = !state.visible
}

const handleClickOutside = () => {
    state.visible = false
}

const selectContentStyle = computed(() => {
    return {
        width: `${state.inputWidth}px`,
        maxHeight: `${props.maxContentHeight}px`
    }
})

const refreshInputWidth = () => {
    const inputRect = unref(inputRef).$el.getBoundingClientRect()
    state.inputWidth = inputRect.width - 2
}

watch(
    () => state.visible,
    async () => {
        await nextTick()
        emit('visible-change', state.visible)
        inputRef?.value?.blur()
        refreshInputWidth()
    },
    {
        immediate: true
    }
)

const resetField = () => {
    emit('update:modelValue', '')
}

const showClose = computed(() => {
    return props.clearable && props.modelValue && state.inputHovering
})

watch(
    () => props.modelValue,
    () => {
        if (props.validateEvent) {
            if (props.modelValue === null) return
            formItem?.validate?.('change').catch(err => debugWarn(err))
        }
    }
)

const exposeData = {
    state,
    inputRef,
    resetField
}

defineExpose(exposeData)
</script>

<style lang="scss" scoped>
.iconify-select {
    display: inline-flex;
    width: 100%;
}
.iconify-select__input {
    :deep() {
        .el-input__suffix-inner {
            cursor: pointer;
            & > i {
                margin-left: 8px;
            }
        }
        .el-input__inner {
            cursor: pointer;
        }
    }
    &.is-disabled {
        :deep(.el-input__inner) {
            cursor: not-allowed;
        }
    }
    &.is-focus {
        :deep(.el-input__inner) {
            outline: none;
            border-color: var(--el-input-focus-border, var(--el-color-primary));
        }
    }
}
.suffix-icon {
    transition: transform 0.3s;
    transform: rotate(0deg);
    &.is-reverse {
        transform: rotate(-180deg);
    }
}
.iconify-select__icon-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, calc(25px + 8px * 2));
    justify-content: center;
    .icon-item {
        display: flex;
        padding: 8px;
        cursor: pointer;
        transition: background-color 0.3s;
        &.is-current {
            background-color: #e6f7ff;
        }
    }
}
</style>

<style lang="scss" module>
.iconify-select__popper {
    background: var(--el-color-white);
    border: 1px solid var(--el-border-color-light);
    box-shadow: var(--el-box-shadow-light);
}
</style>
