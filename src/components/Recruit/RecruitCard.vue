<script setup>
    import { defineProps } from "vue";

    const props = defineProps({
        recruit: Object
    })
</script>

<template>
    <div>
        <div>{{ recruit.title }}</div>
    </div>
</template>

<style scoped>
    @font-face {
            font-family: '감탄로드돋움체 Bold';
            src: url('@/assets/fonts/감탄로드돋움체 Bold.ttf') format('truetype');
    }

    body * {
        font-family: '감탄로드돋움체 Bold', sans-serif;
    }
</style>