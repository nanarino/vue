<script setup lang="ts">
import { computed } from "vue"
import type { ButtonProps } from "."

const props = defineProps<ButtonProps>()
const loading = defineModel<boolean>("loading", { default: false })
const disabled = computed(() => loading.value || props.disabled)
async function handleClick(event: MouseEvent) {
    try {
        if (props.autoLoading) loading.value = true
        await props.onClick?.(event)
    } catch (error) {
        console.error(error)
    } finally {
        if (props.autoLoading) loading.value = false
    }
}
</script>
<template>
    <button
        :class="{
            'na-button': true,
            lg: props.size === 'lg',
            sm: props.size === 'sm',
        }"
        :data-primary="primary === true ? '' : primary || null"
        :data-square="square ? '' : null"
        :data-round="round ? '' : null"
        :data-ghost="ghost ? '' : null"
        :disabled
        @click="handleClick"
    >
        <slot name="prefix" :loading />
        <span><slot /></span>
        <slot name="suffix" :loading />
    </button>
</template>
<style scoped>
span:empty {
    display: none;
}
button {
    gap: 8px;
}
</style>
