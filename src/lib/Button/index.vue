<script setup lang="ts">
import { computed } from "vue"
import type { ButtonProps } from "."

const props = defineProps<ButtonProps>()
const loading = defineModel<boolean>("loading", { default: false })
// 沒有設計內置 loading 所以只 disabled 但是外部可以獲取 然後修改 prefix
const disabled = computed(() => loading.value || props.disabled)
async function handleClick(e: MouseEvent) {
    if (props.autoLoading) loading.value = true
    await props.onClick?.(e)
    loading.value = false
}
</script>
<template>
    <button
        class="na-button"
        :data-primary="primary || null"
        :disabled
        @click="handleClick"
    >
        <slot name="prefix" :loading />
        <span><slot /></span>
        <slot name="suffix" :loading />
    </button>
</template>
<style scoped>
button {
    gap: 8px;
}
</style>
