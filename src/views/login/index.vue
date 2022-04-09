<template>
    <div class="login">
        <div class="login-box">
            <div class="title">登录</div>
            <BasicForm @register="registerForm" v-bind="formProps"></BasicForm>
            <div class="btn-box">
                <el-button class="btn" type="primary" @click="login" :loading="state.btnLoading">
                    登录
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import BasicForm, { useForm } from '@/components/BasicForm/index.vue'
import { useSystemStore } from '@/stores/system.js'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const systemStore = useSystemStore()

const router = useRouter()

const state = reactive({
    btnLoading: false
})

const [registerForm, { componentProps: formProps, getFormData, validate }] = useForm({
    labelWidth: '65px',
    schema: [
        {
            prop: 'username',
            label: '用户名',
            rules: [
                { required: true, message: '用户名不能为空', trigger: 'blur' },
                { min: 3, message: '用户名长度最短3个字符', trigger: 'blur' },
                { max: 20, message: '用户名长度最长20个字符', trigger: 'blur' }
            ],
            render: {
                component: 'el-input'
            }
        },
        {
            prop: 'password',
            label: '密码',
            rules: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { min: 3, message: '密码长度最短3个字符', trigger: 'blur' },
                { max: 20, message: '密码长度最长20个字符', trigger: 'blur' }
            ],
            render: {
                component: 'el-input',
                props: {
                    type: 'password',
                    showPassword: true,
                    onKeyup: e => {
                        const { keyCode } = e
                        if (keyCode !== 13) return
                        login()
                    }
                }
            }
        }
    ],
    modelValue: {}
})

const login = async () => {
    const { valid } = await validate()
    if (!valid) return
    try {
        state.btnLoading = true
        await systemStore.login(getFormData())
        await systemStore.initUserInfo()
        systemStore.addRoutes()
        router.push('/home')
    } catch (error) {
        catchErrorMessage(error)
    } finally {
        state.btnLoading = false
    }
}
</script>

<style lang="scss" scoped>
.login {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-box {
        width: 450px;
        height: 220px;
        box-shadow: var(--el-box-shadow-light);
        border-radius: 4px;
        border: 1px solid var(--el-border-color-light);
        padding: 20px 50px;
        .title {
            font-size: 30px;
            font-weight: 300;
            display: flex;
            justify-content: center;
            margin-bottom: 10px;
        }
        .btn-box {
            display: flex;
            justify-content: center;
            .btn {
                width: 100%;
            }
        }
    }
}
</style>
