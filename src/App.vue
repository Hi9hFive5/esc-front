<script setup>
    import Header from "@/components/Header/Login_Header.vue";
    import Footer from "@/components/Footer/Footer.vue";
    import Login from "@/components/Login/Login.vue"; 
    import RecruitList from "@/components/Recruit/RecruitList.vue";
</script>

<template>
        <Header></Header>

        <Login></Login>
        <RecruitList></RecruitList>

        <Footer></Footer>  
</template>

<style scoped>
@font-face {
    font-family: '감탄로드돋움체 Bold';
    src: url('@/assets/fonts/감탄로드돋움체 Bold.ttf') format('truetype');
}

body {
    font-family: '감탄로드돋움체 Bold', sans-serif;
}

</style>