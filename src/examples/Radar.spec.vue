<script setup lang="ts">
import { Radar } from "@/components/Radar"
</script>
<template>
    <view style="display: contents">
        <Radar class="my-phone" />
    </view>
</template>
<style scoped>
.my-phone:deep {
    .axis {
        stroke: #555;
        stroke-width: 0.2;
    }
    .scale {
        fill: #f0f0f0;
        stroke: #999;
        stroke-width: 0.2;
    }
    .shape {
        fill-opacity: 0.3;
        stroke-width: 0.5;
    }
    .shape:hover {
        fill-opacity: 0.6;
    }

    .shape.iphone {
        fill: #edc951;
        stroke: #edc951;
    }
    .shape.nexus {
        fill: #cc333f;
        stroke: #cc333f;
    }
    .shape.galaxy {
        fill: #00a0b0;
        stroke: #00a0b0;
    }
}
</style>
