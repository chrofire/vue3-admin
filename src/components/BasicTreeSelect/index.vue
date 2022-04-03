<template>
    <div
        class="tree-select"
        v-click-outside:[popperPaneRef]="handleCloseTreeContent"
        @click.stop="toggleTreeContent"
    >
        <el-tooltip
            ref="tooltipRef"
            v-model:visible="state.visible"
            :popper-class="styles[`tree-select-popper`]"
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
                    v-model="state.inputVal"
                    :readonly="true"
                    :clearable="true"
                    :class="[
                        `tree-select-input`,
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
                            <ElIconRender
                                name="ArrowDown"
                                color="var(--el-input-icon-color,var(--el-text-color-placeholder))"
                            />
                        </el-icon>
                        <el-icon
                            v-show="showClose"
                            :class="[`suffix-icon`]"
                            @click.stop="resetField"
                        >
                            <ElIconRender
                                name="CircleClose"
                                color="var(--el-input-icon-color,var(--el-text-color-placeholder))"
                            />
                        </el-icon>
                    </template>
                </el-input>
            </template>
            <template #content>
                <div :style="treeContentStyle">
                    <el-scrollbar
                        ref="scrollbarRef"
                        :max-height="maxContentHeight"
                        :view-style="[{ margin: `6px 0` }]"
                    >
                        <slot>
                            <el-tree
                                ref="treeRef"
                                class="tree-select-tree"
                                :style="{
                                    minWidth: `${state.inputWidth}px`
                                }"
                                v-bind="attrs"
                            />
                        </slot>
                    </el-scrollbar>
                </div>
            </template>
        </el-tooltip>
    </div>
</template>

<script>
export default {
    name: 'BasicTreeSelect',
    inheritAttrs: false
}
</script>

<script setup>
import { computed, nextTick, reactive, ref, unref, useAttrs, useCssModule, watch } from 'vue'
import ElIconRender from '@/components/ElIconRender/index.vue'
import { useFormItem } from 'element-plus'
import { debugWarn } from 'element-plus/lib/utils/index'
import { ClickOutside as vClickOutside } from 'element-plus/lib/directives/index'
const tooltipRef = ref(null)
const scrollbarRef = ref(null)
const inputRef = ref(null)
const treeRef = ref(null)
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
    inputVal: undefined,
    inputWidth: 0,
    inputHovering: false
})

const { form, formItem } = useFormItem()

const validateState = computed(() => formItem?.validateState || '')
const selectDisabled = computed(() => props.disabled || form?.disabled)

const toggleTreeContent = () => {
    if (unref(selectDisabled)) return
    state.visible = !state.visible
}

const handleCloseTreeContent = () => {
    state.visible = false
}

const treeContentStyle = computed(() => {
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

// 重置选中值，表单resetFields后需要调用
const resetField = () => {
    emit('update:modelValue', undefined)
    state.inputVal = undefined
    unref(treeRef)?.setCurrentKey(null)
}

const showClose = computed(() => {
    return props.clearable && props.modelValue && state.inputHovering
})

watch(
    () => props.modelValue,
    () => {
        if (props.validateEvent) {
            formItem?.validate?.('change').catch(err => debugWarn(err))
        }
    }
)

const exposeData = {
    state,
    inputRef,
    treeRef,
    resetField
}

defineExpose(exposeData)
</script>

<style lang="scss" scoped>
.tree-select-input {
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
:deep(.tree-select-tree) {
    display: inline-block;
    .el-tree-node__content {
        padding-right: 10px;
    }
}
</style>

<style lang="scss" module>
.tree-select-popper {
    background: var(--el-color-white);
    border: 1px solid var(--el-border-color-light);
    box-shadow: var(--el-box-shadow-light);
}
</style>
