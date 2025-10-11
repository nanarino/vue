<script setup lang="ts">
import { Button } from "@/lib/Button"
import { message } from "@/scripts/client/message"
</script>
<template>
    <main style="display: contents">
        <section>
            <Button @click="() => message('常規')"> 常規 </Button>
            <Button
                @click="() => message({ content: '主題', primary: 'primary' })"
                primary
            >
                主題
            </Button>
            <Button
                @click="() => message({ content: '成功', primary: 'success' })"
                primary="success"
            >
                成功
            </Button>
            <Button
                @click="() => message({ content: '危險', primary: 'danger' })"
                primary="danger"
                size="lg"
            >
                危險
                <template #suffix>
                    <iconify-icon icon="twemoji:fearful-face" />
                </template>
            </Button>
            <Button
                @click="() => message({ content: '警告', primary: 'warning' })"
                primary="warning"
                size="sm"
            >
                <template #prefix>
                    <iconify-icon icon="material-symbols:warning-rounded" />
                </template>
                警告
            </Button>
            <Button @click="() => message('載入中...')" auto-loading>
                <template #prefix="{ loading }">
                    <iconify-icon
                        icon="line-md:loading-twotone-loop"
                        v-show="loading"
                    />
                </template>
                自訂載入中圖示並等待
            </Button>
        </section>
    </main>
</template>
<style scoped>
section {
    display: grid;
    gap: 8px;
}
</style>
