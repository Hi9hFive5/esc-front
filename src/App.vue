<script setup>
    import Header from "@/components/Header/Login_Header.vue";
    import Footer from "@/components/Footer/Footer.vue";
    import { RouterLink, RouterView, useRouter } from 'vue-router';

    const router = useRouter();
</script>

<template>
        <Header></Header>

        <main class="wrapper">
            <RouterView />
        </main>

        <Footer></Footer>  
</template>


<style scoped>
@font-face {
    font-family: '감탄로드돋움체 Bold';
    src: url('@/assets/fonts/감탄로드돋움체 Bold.ttf') format('truetype');
}

body * {
    font-family: '감탄로드돋움체 Bold', sans-serif;
}

.wrapper {
    margin-left:12.5%;
    margin-right:12.5%;
    width:75%;
}

</style>