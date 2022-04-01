<script>
import { ElButton, ElDialog } from 'element-plus'
import { defineComponent, h, reactive, ref } from 'vue'
export { useDialog } from './useDialog'
export default defineComponent({
    name: 'BasicDialog',
    inheritAttrs: false,
    props: {
        title: [Function, String],
        render: Function,
        footer: Function,
        confirm: {
            type: [Function, String],
            default: () => '确定'
        },
        confirmProps: {
            type: Object,
            default: () => ({})
        },
        cancel: {
            type: [Function, String],
            default: () => '取消'
        },
        cancelProps: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ['register'],
    setup (props, { attrs, slots, emit, expose }) {
        const dialogRef = ref(null)
        const state = reactive({
            visible: false
        })

        const setVisible = (data = false) => {
            state.visible = data
        }

        // title slot
        const genTitleSlotRender = () => {
            if (typeof props.title === 'string') {
                return () =>
                    h(
                        'div',
                        {
                            class: `el-dialog__title`,
                            style: { minHeight: `var(--el-dialog-font-line-height)` }
                        },
                        props.title
                    )
            }
            return (
                (props.title && (() => props.title()))
                || (slots.title && (() => slots.title()))
                || null
            )
        }

        // default slot
        const genDefaultSlotRender = () => {
            return (
                (props.render && (() => props.render()))
                || (slots.default && (() => slots.default()))
                || null
            )
        }

        // footer slot
        const genFooterSlotRender = () => {
            return (
                (props.footer && (() => props.footer()))
                || (slots.footer && (() => slots.footer()))
                || (() => {
                    const confirmProps = {
                        type: 'primary',
                        size: 'default',
                        ...props.confirmProps
                    }

                    const cancelProps = {
                        size: 'default',
                        ...props.cancelProps
                    }

                    return [
                        h(
                            ElButton,
                            confirmProps,
                            typeof props.confirm === 'function'
                                ? props.confirm
                                : { default: () => props.confirm }
                        ),
                        h(
                            ElButton,
                            cancelProps,
                            typeof props.cancel === 'function'
                                ? props.cancel
                                : { default: () => props.cancel }
                        )
                    ]
                })
            )
        }

        const exposeData = {
            dialogRef,
            state,
            setVisible
        }

        emit('register', exposeData)
        expose(exposeData)

        return () => {
            return h(
                ElDialog,
                {
                    ref: dialogRef,
                    modelValue: state.visible,
                    'onUpdate:modelValue': value => (state.visible = value),
                    'custom-class': 'default-basic-dialog-custom-class',
                    'append-to-body': true,
                    'close-on-click-modal': false,
                    ...attrs,
                    // 劫持title
                    title: ''
                },
                {
                    title: genTitleSlotRender(),
                    default: genDefaultSlotRender(),
                    footer: genFooterSlotRender()
                }
            )
        }
    }
})
</script>

<style lang="scss" scoped></style>
