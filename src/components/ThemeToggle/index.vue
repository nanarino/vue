<script setup lang="ts">
import toggle from "@holy-two/data-theme/dist/toggle"
</script>
<template>
    <button class="na-button" title="theme toggle" data-round @click="toggle">
        <iconify-icon icon="line-md:moon-simple" />
        <iconify-icon icon="line-md:sunny" />
    </button>
</template>
<style scoped>
button {
    position: fixed;
    z-index: 9;
    bottom: 16px;
    right: 16px;

    display: grid;
    --padding-horizonal-button: 16px;

    & iconify-icon {
        grid-area: 1/1/2/2;
        transition: opacity 0.3s;
        font-size: 24px;
    }
}

:root[data-theme="light"] button iconify-icon:first-child {
    opacity: 0;
}

:root[data-theme="dark"] button iconify-icon:last-child {
    opacity: 0;
}
</style>
