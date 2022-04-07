<template>
    <div
        class="el-icon-select"
        v-click-outside:[popperPaneRef]="handleCloseSelectContent"
        @click.stop="toggleSelectContent"
        v-bind="{
            style: attrs.style,
            class: attrs.class
        }"
    >
        <el-tooltip
            ref="tooltipRef"
            v-model:visible="state.visible"
            :popper-class="styles[`select-popper`]"
            placement="bottom-start"
            :fallback-placements="['bottom-start', 'top-start', 'right', 'left']"
            effect="light"
            pure
            trigger="click"
            transition="el-zoom-in-top"
            :stop-popper-mouse-event="false"
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
                        `select-input`,
                        { 'is-focus': state.visible && validateState !== `error` }
                    ]"
                    @mouseenter="state.inputHovering = true"
                    @mouseleave="state.inputHovering = false"
                    :validate-event="false"
                    :disabled="disabled"
                    :placeholder="placeholder"
                >
                    <template #suffix>
                        <el-icon
                            v-show="!showClose"
                            :class="[`suffix-icon`, { 'is-reverse': state.visible }]"
                        >
                            <ElIconsModule.ArrowDown></ElIconsModule.ArrowDown>
                        </el-icon>
                        <el-icon
                            v-show="showClose"
                            :class="[`suffix-icon`]"
                            @click.stop="resetField"
                        >
                            <ElIconsModule.CircleClose></ElIconsModule.CircleClose>
                        </el-icon>
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
                        <slot>
                            <div
                                class="icon-list"
                                :style="{
                                    minWidth: `${state.inputWidth}px`
                                }"
                            >
                                <div
                                    class="icon-item"
                                    v-for="icon in ElIconList"
                                    :key="icon.name"
                                    @click="handleSelect(icon.name)"
                                    :class="{
                                        current: modelValue === icon.name
                                    }"
                                >
                                    <ElIconWrapper
                                        v-bind="{
                                            icon,
                                            size: 25,
                                            color: 'var(--el-input-text-color,var(--el-text-color-regular))'
                                        }"
                                    ></ElIconWrapper>
                                </div>
                            </div>
                        </slot>
                    </el-scrollbar>
                </div>
            </template>
        </el-tooltip>
    </div>
</template>

<script>
export default {
    name: 'ElIconSelect',
    inheritAttrs: false
}
</script>

<script setup>
import { computed, h, nextTick, reactive, ref, unref, useAttrs, useCssModule, watch } from 'vue'
import * as ElIconsModule from '@element-plus/icons-vue'
import { ElIcon, useFormItem } from 'element-plus'
import { debugWarn } from 'element-plus/lib/utils/index'
import { ClickOutside as vClickOutside } from 'element-plus/lib/directives/index'

const ElIconList = Object.values(ElIconsModule)

const ElIconWrapper = {
    name: 'ElIconWrapper',
    inheritAttrs: false,
    props: {
        icon: Object
    },
    render () {
        return h(ElIcon, this.$attrs, () => this.icon?.render())
    }
}

const tooltipRef = ref(null)
const scrollbarRef = ref(null)
const inputRef = ref(null)
const popperPaneRef = computed(() => {
    return tooltipRef.value?.popperRef?.contentRef
})

const attrs = useAttrs()

const props = defineProps({
    modelValue: {
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
}

const { form, formItem } = useFormItem()

const validateState = computed(() => formItem?.validateState || '')
const selectDisabled = computed(() => props.disabled || form?.disabled)

const toggleSelectContent = () => {
    if (unref(selectDisabled)) return
    state.visible = !state.visible
}

const handleCloseSelectContent = () => {
    state.visible = false
}

const selectContentStyle = computed(() => {
    return {
        width: `${state.inputWidth}px`,
        maxHeight: `${props.maxContentHeight}px`
    }
})

const initInputWidth = () => {
    const inputRect = unref(inputRef).$el.getBoundingClientRect()
    state.inputWidth = inputRect.width - 2
}

watch(
    () => state.visible,
    async () => {
        emit('visible-change', state.visible)
        await nextTick()
        initInputWidth()
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
            if(props.modelValue === null) return
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
.select-input {
    :deep() {
        .el-input__suffix-inner {
            display: flex;
            align-items: center;
            cursor: pointer;
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
.icon-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, calc(25px + 8px * 2));
    justify-content: center;
    .icon-item {
        display: flex;
        padding: 8px;
        cursor: pointer;
        transition: background-color 0.3s;
        &.current {
            background-color: #e6f7ff;
        }
    }
}
</style>

<style lang="scss" module>
.select-popper {
    background: var(--el-color-white);
    border: 1px solid var(--el-border-color-light);
    box-shadow: var(--el-box-shadow-light);
}
</style>
