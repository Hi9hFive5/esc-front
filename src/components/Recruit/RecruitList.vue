<script setup>
    import { reactive, ref, onMounted } from 'vue';
    import RecruitCard from './RecruitCard.vue';

    const state = reactive({
        recruitList: [],
        category: []
    });

    const selectedCategory = ref();

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
    };

    const fetchCategory = async() => {

        try {
            const response = await fetch('http://localhost:8080/studyclub/category');

            if(!response.ok) {
                throw new Error('response is not ok');
            }

            const data = await response.json();
            state.category = data;

        } catch(error) {
            console.error('fetch error: ' + error.message);
        }
    };

    onMounted(async() => {
        await fetchRecruitList();
        await fetchCategory();
    });

</script>

<template>
    <div class="filter">
        <form class="sort">
            <label>
                <input type="radio" name="filter" value="recent"> 최신순 &nbsp;
            </label>
            <label>
                <input type="radio" name="filter" value="popular"> 인기순
            </label>
        </form>
        <select class="category" v-model="selectedCategory">
            <option v-for="item in state.category" :value="item.id"> {{ item.studyName }} </option>
        </select>
    </div>
    <div>
        <RecruitCard class="card" v-for="recruit in state.recruitList" :key="recruit.id" :recruit="recruit"></RecruitCard>
    </div>
</template>

<style scoped>
    @font-face {
        font-family: "감탄로드돋움체 Bold";
        src: url("@/assets/fonts/감탄로드돋움체 Bold.ttf") format("truetype");
    }
    body * {
        font-family: "감탄로드돋움체 Bold", sans-serif;
    }
   .filter {
        margin: 20px 15px;
        display: flex;
        justify-content: space-between;
    }
    .card {
        margin: 10px 0px;
    }
    .category {
        text-align: center;
        width: 100px;
        height: 20px;
        font-size: 15px;
    }
</style>