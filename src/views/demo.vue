<template>
    <div class="demo">
        <BasicForm @register="registerForm" v-bind="formProps">
            <template #templateInput="{ formItem, formData }">
                <el-input v-model="formData[formItem.prop]"></el-input>
            </template>
        </BasicForm>
        <el-button type="primary" @click="validateFunc">validate</el-button>
        <el-button type="primary" @click="resetFields()">resetFields</el-button>
        <el-button type="primary" @click="() => console.log(getFormData())">getFormData</el-button>
    </div>
</template>

<script lang="jsx" setup>
import BasicForm, { useForm } from '@/components/BasicForm/index.vue'

const [registerForm, {
    componentProps: formProps,
    getInstance,
    getFormData,
    setFormData,
    validate,
    validateField,
    resetFields,
    scrollToField,
    clearValidate
}] = useForm({
    labelWidth: '90px',
    schema: [
        {
            prop: 'input',
            label: 'input',
            rules: { required: true, message: 'input不能为空', trigger: 'blur' },
            col: {
                span: 12
            },
            render: {
                component: 'el-input'
            }
        },
        {
            prop: 'inputNumber',
            label: '密码',
            rules: [
                { required: true, message: 'inputNumber不能为空', trigger: 'blur' }
            ],
            col: {
                span: 12
            },
            render: {
                component: 'el-input-number'
            }
        },
        {
            prop: 'radioGroup',
            label: 'radioGroup',
            rules: [
                { required: true, message: 'radioGroup不能为空', trigger: 'change' }
            ],
            col: {
                span: 12
            },
            render: {
                component: 'el-radio-group',
                options: Array.from({ length: 3 }, (_, i) => {
                    return {
                        label: `label${i}`,
                        content: `content${i}`
                    }
                }),
                optionSlots: option => {
                    return option.content
                }
            }
        },
        {
            prop: 'checkboxGroup',
            label: 'checkboxGroup',
            labelWidth: '150px',
            rules: [
                { required: true, message: 'checkboxGroup不能为空', trigger: 'change' }
            ],
            col: {
                span: 12
            },
            render: {
                component: 'el-checkbox-group',
                options: Array.from({ length: 3 }, (_, i) => {
                    return {
                        label: `label${i}`,
                        content: `content${i}`
                    }
                }),
                optionSlots: option => {
                    return option.content
                }
            }
        },
        {
            prop: 'select',
            label: 'select',
            rules: [
                { required: true, message: 'select不能为空', trigger: 'change' }
            ],
            col: {
                span: 12
            },
            render: {
                component: 'el-select',
                options: Array.from({ length: 100 }, (_, i) => {
                    return {
                        value: `value${i}`,
                        label: `label${i}`
                    }
                })
            }
        },
        {
            prop: 'selectOptionGroup',
            label: 'selectOptionGroup',
            labelWidth: '150px',
            rules: [
                { required: true, message: 'selectOptionGroup不能为空', trigger: 'change' }
            ],
            col: {
                span: 12
            },
            render: {
                component: 'el-select',
                options: Array.from({ length: 3 }, (_, i) => {
                    return {
                        value: `value${i}`,
                        label: `label${i}`,
                        children: Array.from({ length: 6 }, (_, j) => {
                            return {
                                value: `value${i}-${j}`,
                                label: `label${i}-${j}`
                            }
                        })
                    }
                })
            }
        },
        {
            prop: 'renderInput',
            label: 'renderInput',
            rules: [
                { required: true, message: 'renderInput不能为空', trigger: 'blur' }
            ],
            col: {
                span: 12
            },
            render: ({ formItem, formData }) => {
                return (
                    <el-input v-model={formData[formItem.prop]}></el-input>
                )
            }
        },
        {
            prop: 'templateInput',
            label: 'templateInput',
            labelWidth: '115px',
            rules: [
                { required: true, message: 'templateInput不能为空', trigger: 'blur' }
            ],
            col: {
                span: 12
            }
        }
    ],
    modelValue: {}
})

const validateFunc = async () => {
    const res = await validate()
    console.log(res)
}

</script>

<style lang="scss" scoped>
.demo {
    width: 100%;
    height: 100%;
    padding: 10px;
}
</style>
