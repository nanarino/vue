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
            <div>
                <Button ghost primary="success" round title="健康碼">
                    <template #prefix>
                        <iconify-icon icon="line-md:cellphone-arrow-up" />
                    </template>
                </Button>
                <Button primary="warning" square title="手機禁止">
                    <template #suffix>
                        <iconify-icon icon="line-md:cellphone-off-twotone" />
                    </template>
                </Button>
            </div>
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
            <Button ghost @click="() => message('載入中...')" auto-loading>
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
div {
    --font-size-body: 32px;
    --border-width-button: 4px;
    display: flex;
    justify-content: center;
    gap: 1em;
}
</style>
