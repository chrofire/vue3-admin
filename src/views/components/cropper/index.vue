<template>
    <div class="w-100% h-100% overflow-auto p-20px">
        <div class="mb-10px">
            <el-button @click="setSrc">设置src</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button @click="toggleCircle">{{ state.circleCropper ? `圆形` : `方形` }}</el-button>
            <el-button @click="toggleRatio">
                {{ options.aspectRatio === 0 ? `不锁定` : `锁定` }}比例
            </el-button>
            <el-button @click="() => console.log(BaseCropperRef)">打印BaseCropperRef</el-button>
            <el-button @click="handleCrop">单独调用裁剪方法</el-button>
        </div>
        <div class="flex items-center">
            <BaseCropper
                class="mr-10px"
                ref="BaseCropperRef"
                :src="state.src"
                @cropped="handleCropped"
                :options="options"
                :circleCropper="state.circleCropper"
                :circleCanvas="state.circleCanvas"
            ></BaseCropper>
            <div class="w-500px h-500px shrink-0 b-1px b-gray">
                <img
                    class="w-100% h-100%"
                    style="object-fit: contain;"
                    v-if="state.previewSrc"
                    :src="state.previewSrc"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, unref } from 'vue'
import BaseCropper from '@/components/BaseCropper/index.vue'

const BaseCropperRef = ref(null)

const state = reactive({
    src: null,
    previewSrc: null,
    circleCropper: false,
    circleCanvas: false
})

const options = reactive({
    aspectRatio: 1
})

const genImage = (width = 100, height = 100) => {
    const canvasEl = document.createElement('canvas')
    canvasEl.width = width
    canvasEl.height = height
    const ctx = canvasEl.getContext('2d')

    const lg = ctx.createLinearGradient(0, 0, width, 0)
    lg.addColorStop(0, '#ff4d4f')
    lg.addColorStop(0.2, '#ff7a45')
    lg.addColorStop(0.4, '#ffa940')
    lg.addColorStop(0.6, '#ffc53d')
    lg.addColorStop(0.8, '#d3f261')
    lg.addColorStop(1, '#73d13d')
    ctx.fillStyle = lg
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height)
    return canvasEl.toDataURL('image/png')
}

const setSrc = () => {
    state.src = genImage(800, 500)
}

const reset = () => {
    Object.assign(state, {
        src: null,
        previewSrc: null
    })
}

const toggleCircle = async () => {
    Object.assign(state, {
        circleCropper: !state.circleCropper,
        circleCanvas: !state.circleCanvas
    })
    const result = await unref(BaseCropperRef).handleCropped(state.circleCropper)
    result && (state.previewSrc = result.objectURL)
}

const toggleRatio = () => {
    options.aspectRatio === 0 ? (options.aspectRatio = 1) : (options.aspectRatio = 0)
}

const handleCrop = async () => {
    console.log(await BaseCropperRef.value.handleCropped(state.circleCropper))
}

const handleCropped = result => {
    state.previewSrc = result.objectURL
}
</script>

<style lang="scss" scoped>
.cropper-preview {
    width: 400px;
    height: 400px;
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}
</style>
