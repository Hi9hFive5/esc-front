<template>
    <div class="container">
        <div class="section">
            <div class="section-title">멤버</div>
        </div>
        <div class="section">
            <div class="section-title">로그</div>
        </div>
        <div class="section">
            <div class="section-title">일정</div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
    .container {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        gap: 10px;
    }
    .container {
        margin-top: 60px;
    }
    .section {
        border: 1px solid black;
        height: 300px;
    }
</style>