<script setup lang="ts">
import { reactive, provide, h, watch, createTextVNode, computed } from "vue"
import type { TabGroupProps, TabPanelInject, TabPanelProps, TabLabel } from "."
import close from "../../assets/close.svg?raw"

const props = withDefaults(defineProps<TabGroupProps>(), {
    renderRemoveIcon: () => (
        h("i", {
            innerHTML: close,
            style: `
                display: inline-flex;
                width: var(--font-size-tabs, var(--font-size-body));
                height: var(--font-size-tabs, var(--font-size-body));
            `,
        })
    ),
})
const data = reactive<TabPanelInject["data"]>([])
const labels = computed(() =>
    Object.fromEntries(
        data.map(tab => [
            tab.label,
            props.renderLabelsText?.(tab.label) ?? createTextVNode(tab.label),
        ])
    )
)
const active = defineModel<TabLabel>("modelValue", { default: "" })
watch(active, v =>
    emit(
        "change",
        data.find(x => x.label === v)
    )
)
const emit = defineEmits<{
    change: [tab?: TabPanelProps]
    close: [tab: TabPanelProps]
}>()
provide<TabPanelInject>("tabPanelInject", {
    active,
    data,
})
</script>
<template>
    <section>
        <ul
            :class="{
                'na-layout-header': true,
                'na-tabs': true,
                lg: props.size === 'lg',
            }"
        >
            <li
                class="na-tab"
                v-for="tab of data"
                :key="tab.label"
                :data-active="active === tab.label || null"
            >
                <button class="na-tab-name" @click="active = tab.label">
                    <component :is="labels[tab.label]" />
                </button>
                <button
                    class="na-tab-operation"
                    v-if="tab.closeable"
                    @click="
                        () => {
                            const index = data.findLastIndex(
                                x => x.label === tab.label
                            )
                            data.splice(
                                0,
                                Infinity,
                                ...data.filter(x => x.label !== tab.label)
                            )
                            if (active === tab.label) {
                                active =
                                    data.at(index)?.label ??
                                    data.at(-1)?.label ??
                                    ''
                            }
                            emit('close', tab)
                        }
                    "
                >
                    <component :is="props.renderRemoveIcon" />
                </button>
            </li>
        </ul>
        <main class="na-layout-content">
            <slot></slot>
        </main>
    </section>
</template>
<style scoped>
section {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    gap: 2px;
}
main {
    flex: 1;
    overflow-y: hidden;
}
.na-tab-operation :deep(svg) {
    width: 1em;
    height: 1em;
}
</style>
