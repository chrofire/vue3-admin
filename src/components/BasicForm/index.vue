<script>
import { ElForm, ElFormItem } from 'element-plus'
// layout
import { ElRow, ElCol } from 'element-plus'
// select
import { ElSelect, ElOptionGroup, ElOption } from 'element-plus'
// radio
import { ElRadio, ElRadioGroup, ElRadioButton } from 'element-plus'
// checkbox
import { ElCheckbox, ElCheckboxGroup, ElCheckboxButton } from 'element-plus'
import { computed, defineComponent, h, ref, unref } from 'vue'
import { isFunction } from 'lodash-es'
import { getType } from '@/utils/tools'
import { componentMap } from './componentMap'
export { useForm } from './useForm'

export default defineComponent({
    name: 'BasicForm',
    inheritAttrs: false,
    props: {
        schema: {
            type: Array,
            default: () => [],
            required: true
        },
        modelValue: {
            type: Object,
            default: () => ({}),
            required: true
        },
        row: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ['update:modelValue', 'register'],
    setup (props, { attrs, slots, emit, expose }) {
        const formRef = ref(null)

        const formData = computed({
            get () {
                return unref(props.modelValue)
            },
            set (val) {
                emit('update:modelValue', val)
            }
        })

        const genFormItems = schema => {
            return schema.map(formItem => {
                const { label, error, col = {}, render, extra, isShow, ...formItemArgs } = formItem

                const formItemProps = {
                    error: isFunction(error) ? undefined : error,
                    label: isFunction(label) ? undefined : label,
                    ...formItemArgs
                }

                const formItemSlots = {
                    default: () => genFormItem(formItem),
                    label: isFunction(label) ? () => label() : undefined,
                    error: isFunction(error)
                        ? ({ error: errorMessage }) => error(errorMessage)
                        : undefined
                }

                const vnode = h(ElCol, { key: formItem.prop, ...col }, () =>
                    h(ElFormItem, formItemProps, formItemSlots)
                )
                if (typeof isShow !== 'undefined' && typeof isShow === 'function') {
                    return isShow() ? vnode : null
                } else {
                    return vnode
                }
            })
        }

        const genFormItem = formItem => {
            const { render, prop } = formItem
            const renderType = getType(render)

            const scopeData = {
                formItem,
                formData: unref(formData)
            }

            if (!render) {
                return slots[prop]?.(scopeData)
            }

            switch (renderType) {
                case 'object':
                    switch (render.component) {
                        case 'el-input':
                        case 'el-input-number':
                        case 'el-cascader':
                        case 'el-switch':
                        case 'el-slider':
                        case 'el-time-select':
                        case 'el-time-picker':
                        case 'el-date-picker':
                        case 'el-rate':
                        case 'el-color-picker':
                            return genSingleItemComponent(formItem)
                        case 'el-radio-group':
                            return genRadioGroupComponent(formItem)
                        case 'el-checkbox-group':
                            return genCheckboxGroupComponent(formItem)
                        case 'el-select':
                            return genSelectComponent(formItem)
                        default:
                            return h('span', '尚未配置该组件')
                    }
                case 'function':
                    return render(scopeData)
                default:
                    return slots[prop]?.(scopeData)
            }
        }

        const genSingleItemComponent = formItem => {
            const { render, prop } = formItem
            const { component, props = {}, slots = {}} = render

            return h(
                componentMap[component].component,
                {
                    modelValue: formData.value[prop],
                    'onUpdate:modelValue': value => (formData.value[prop] = value),
                    ...props
                },
                slots
            )
        }

        const genRadioGroupComponent = formItem => {
            const { render, prop } = formItem

            // option配置
            const _optionProps = option => {
                const { label } = option
                return {
                    key: label,
                    ...option
                }
            }

            const _optionSlots = option => {
                return option.label
            }

            const {
                type = 'default',
                props = {},
                slots = {},
                options = [],
                optionProps = _optionProps,
                optionSlots = _optionSlots
            } = render

            // radioGroup默认插槽
            const _slots = {
                default: () =>
                    options.map(option => {
                        const Comp = type === `button` ? ElRadioButton : ElRadio
                        return h(Comp, optionProps(option), () => optionSlots(option))
                    })
            }

            return h(
                ElRadioGroup,
                {
                    modelValue: formData.value[prop],
                    'onUpdate:modelValue': value => (formData.value[prop] = value),
                    ...props
                },
                {
                    ..._slots,
                    ...slots
                }
            )
        }

        const genCheckboxGroupComponent = formItem => {
            const { render, prop } = formItem

            // option配置
            const _optionProps = option => {
                const { label } = option
                return {
                    key: label,
                    ...option
                }
            }

            const _optionSlots = option => {
                return option.label
            }

            const {
                type = 'default',
                props = {},
                slots = {},
                options = [],
                optionProps = _optionProps,
                optionSlots = _optionSlots
            } = render

            // checkboxGroup默认插槽
            const _slots = {
                default: () =>
                    options.map(option => {
                        const Comp = type === `button` ? ElCheckboxButton : ElCheckbox
                        return h(Comp, optionProps(option), () => optionSlots(option))
                    })
            }

            return h(
                ElCheckboxGroup,
                {
                    modelValue: formData.value[prop],
                    'onUpdate:modelValue': value => (formData.value[prop] = value),
                    ...props
                },
                {
                    ..._slots,
                    ...slots
                }
            )
        }

        const genSelectComponent = formItem => {
            const { render, prop } = formItem

            // option配置
            const _optionProps = option => {
                const { value } = option
                return {
                    key: value,
                    ...option
                }
            }

            // optionGroup配置
            const _optionGroupProps = option => {
                const { label, children, ...optionArgs } = option
                return {
                    key: label,
                    label,
                    ...optionArgs
                }
            }

            const _optionSlots = option => {
                return option.label
            }

            const {
                props = {},
                slots = {},
                options = [],
                optionProps = _optionProps,
                optionSlots = _optionSlots,
                optionGroupProps = _optionGroupProps
            } = render

            // select默认插槽
            const _slots = {
                default: () =>
                    options.map(option => {
                        if (option.children && Array.isArray(option.children)) {
                            return h(ElOptionGroup, optionGroupProps(option), {
                                default: () =>
                                    option.children.map(opt => {
                                        return h(ElOption, optionProps(opt), () => optionSlots(opt))
                                    })
                            })
                        } else {
                            return h(ElOption, optionProps(option), () => optionSlots(option))
                        }
                    })
            }

            return h(
                ElSelect,
                {
                    modelValue: formData.value[prop],
                    'onUpdate:modelValue': value => (formData.value[prop] = value),
                    ...props
                },
                {
                    ..._slots,
                    ...slots
                }
            )
        }

        const validate = async () => {
            const result = {
                valid: null,
                errors: null
            }
            try {
                result.valid = await unref(formRef).validate()
            } catch (errors) {
                Object.assign(result, {
                    valid: false,
                    errors
                })
            }
            return result
        }
        const validateField = (...args) => unref(formRef).validateField(...args)
        const resetFields = (...args) => unref(formRef).resetFields(...args)
        const scrollToField = (...args) => unref(formRef).scrollToField(...args)
        const clearValidate = (...args) => unref(formRef).clearValidate(...args)

        const formMethods = {
            validate,
            validateField,
            resetFields,
            scrollToField,
            clearValidate
        }

        const exposeData = {
            formRef,
            ...formMethods
        }

        emit('register', exposeData)
        expose(exposeData)

        return () => {
            return h(
                ElForm,
                {
                    ref: formRef,
                    model: unref(formData),
                    labelWidth: '100px',
                    ...attrs
                },
                () =>
                    h(ElRow, props.row, () => {
                        return genFormItems(props.schema)
                    })
            )
        }
    }
})
</script>

<style lang="scss" scoped></style>
