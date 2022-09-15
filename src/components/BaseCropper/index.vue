<template>
    <div
        class="cropper-wrapper"
        :class="[circleCropper ? 'cropper-circle' : '']"
        :style="wrapperStyle"
    >
        <img v-show="false" ref="imgRef" :src="src" />
    </div>
</template>

<script setup>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { debounce } from 'lodash-es'
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, unref, watch } from 'vue'

const props = defineProps({
    width: {
        type: [Number, String],
        default: 500
    },
    height: {
        type: [Number, String],
        default: 500
    },
    src: {
        type: String
    },
    // 圆形裁剪
    circleCropper: {
        type: Boolean,
        default: false
    },
    // 圆形数据
    circleCanvas: {
        type: Boolean,
        default: false
    },
    // cropper options
    options: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['cropped', 'ready'])

const wrapperStyle = computed(() => {
    return {
        width: typeof props.width === 'number' ? `${props.width}px` : props.width,
        height: typeof props.height === 'number' ? `${props.height}px` : props.height
    }
})

const defaultOptions = {
    // 锁定比例
    aspectRatio: 1
}

const imgRef = ref(null)
const instance = shallowRef(null)

const init = async () => {
    await nextTick()
    const imgEl = unref(imgRef)

    instance.value = new Cropper(imgEl, {
        ...defaultOptions,
        ...props.options,
        ready () {
            emit('ready', instance)
            handleCropped(props.circleCanvas, true)
        },
        crop () {
            debounceHandleCropped(props.circleCanvas, true)
        },
        zoom () {
            debounceHandleCropped(props.circleCanvas, true)
        },
        cropmove () {
            debounceHandleCropped(props.circleCanvas, true)
        }
    })
}

// 裁剪
const handleCropped = async (circleCanvas = false, emitEvent = false) => {
    if (!instance.value) return
    const canvasEl = circleCanvas
        ? getCircleCroppedCanvas() // 圆形裁剪
        : unref(instance).getCroppedCanvas() // 方形裁剪

    return new Promise(resolve => {
        canvasEl.toBlob(blob => {
            if (!blob) return
            const fileReader = new FileReader()
            fileReader.readAsDataURL(blob)
            fileReader.onloadend = e => {
                const result = {
                    blob,
                    dataURL: e.target.result,
                    objectURL: URL.createObjectURL(blob),
                    imageInfo: unref(instance).getData()
                }
                resolve(result)
                emitEvent && emit('cropped', result)
            }
        }, 'image/png')
    })
}

// 裁剪防抖
const debounceHandleCropped = debounce(handleCropped, 100)

// 获取 圆形裁剪 canvas
const getCircleCroppedCanvas = () => {
    const rawCanvas = unref(instance).getCroppedCanvas()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const width = rawCanvas.width
    const height = rawCanvas.height
    canvas.width = width
    canvas.height = height
    ctx.drawImage(rawCanvas, 0, 0, width, height)
    ctx.globalCompositeOperation = 'destination-in'
    // 椭圆 / 圆
    ctx.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI, true)
    ctx.fill()
    return canvas
}

// 销毁实例
const destroyInstance = () => {
    instance.value?.destroy()
    instance.value = null
}

watch(
    () => props.src,
    newVal => {
        if (!newVal) {
            destroyInstance()
        } else {
            init()
        }
    },
    {
        immediate: true
    }
)

watch(
    () => props.options,
    () => {
        if (!instance.value) return
        destroyInstance()
        init()
    },
    {
        deep: true
    }
)

onBeforeUnmount(() => {
    destroyInstance()
})

defineExpose({
    instance,
    init,
    handleCropped,
    debounceHandleCropped,
    getCircleCroppedCanvas,
    destroyInstance
})
</script>

<style lang="scss" scoped>
.cropper-wrapper {
    --rect-size: 8px;

    background: #eee;
    background-image:
        linear-gradient(
            45deg,
            rgb(0 0 0 / 25%) 25%,
            transparent 0,
            transparent 75%,
            rgb(0 0 0 / 25%) 0
        ),
        linear-gradient(
            45deg,
            rgb(0 0 0 / 25%) 25%,
            transparent 0,
            transparent 75%,
            rgb(0 0 0 / 25%) 0
        );
    background-position: 0 0, var(--rect-size) var(--rect-size);
    background-size: calc(var(--rect-size) * 2) calc(var(--rect-size) * 2);
}
.cropper-circle {
    :deep() {
        .cropper-view-box,
        .cropper-face {
            border-radius: 50%;
        }
    }
}
</style>
