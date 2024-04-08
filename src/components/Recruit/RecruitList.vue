<script setup>
    import { reactive, onMounted } from 'vue';
    import RecruitCard from './RecruitCard.vue';

    const state = reactive({
        recruitList: []
    });

    const fetchRecruitList = async() => {

        try {
            const response = await fetch("http://localhost:8080/recruit/list");

            if(!response.ok) {
                throw new Error('response is not ok');
            }

            const data = await response.json();
            state.recruitList = data;

        } catch(error) {
            console.log('fetch error: ' + error.message);
        }

        console.log(state.recruitList);

    };

    onMounted(async() => {
        await fetchRecruitList();
    });

</script>

<template>
    <div>
        <RecruitCard v-for="recruit in state.recruitList" :key="recruit.id" :recruit="recruit"></RecruitCard>
    </div>
</template>

<style scoped>

</style>