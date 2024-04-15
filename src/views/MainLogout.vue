<template>
    <Header/>

    <div class="wrapper">
        <section>
            <login></login>
        </section>
    </div>
    <Footer/>
</template>

<script setup>
    import login from '../components/Login/Main.vue';
    import Header from "@/components/Header/Login_Header.vue";
    import Footer from "@/components/Footer/Footer.vue";
</script>

<style scoped>

</style>