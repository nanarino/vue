<script setup lang="ts">
import { onUnmounted, inject, onMounted, nextTick } from "vue"
import type { TabPanelProps, TabPanelInject } from "."

const props = defineProps<TabPanelProps>()
const tabPanelInject = inject<TabPanelInject>("tabPanelInject")

onMounted(() => {
    if (tabPanelInject) {
        tabPanelInject.data.push(props)
    }
})

onUnmounted(async () => {
    await nextTick()
    if (tabPanelInject) {
        const tab = tabPanelInject.data.findLast(x => x.label === props.label)
        tab &&
            tabPanelInject.data.splice(
                0,
                Infinity,
                ...tabPanelInject.data.filter(x => x !== tab)
            )
    }
})
</script>
<template>
    <section
        class="na-tab-panel"
        v-show="tabPanelInject?.active?.value === props.label"
    >
        <slot></slot>
    </section>
</template>
<style scoped>
:where(.na-tab-panel) {
    display: contents;
}
</style>
