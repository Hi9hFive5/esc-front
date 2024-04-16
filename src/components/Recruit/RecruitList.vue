<script setup>
    import { reactive, ref, onMounted } from 'vue';
    import RecruitCard from './RecruitCard.vue';
    import { useRouter } from 'vue-router';
    import axios from "axios";
    import Header from "@/components/Header/Header.vue";
    import Footer from "@/components/Footer/Footer.vue";
    
    const router = useRouter();
    const userInfo = ref(null);
    const loaded = ref(false); 

    const navigateTo = (path) => {
        router.push(path);
    }

    const state = reactive({
        recruitList: [],
        category: []
    });

    const selectedCategory = ref();

    const fetchRecruitList = async() => {

        try {
            const response = await fetch("/api/recruit/list");

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
            const response = await fetch('/api/studyclub/category');

            if(!response.ok) {
                throw new Error('response is not ok');
            }

            const data = await response.json();
            state.category = data;

        } catch(error) {
            console.error('fetch error: ' + error.message);
        }
    };

    function makeStudyClub() {
        router.push(`/studyclub-regist/${userInfo.value.id}`)
    }

    function decodeBase64(str) {
        const decoded = atob(str);
        return JSON.parse(decoded);
    }

    function fetchUserInfo(token) {
        const tokenParts = token.split('.');

    if (tokenParts.length === 3) {
        const payload = decodeBase64(tokenParts[1]);
        axios.get(`/api/user/info/${payload.sub}`)
        .then(response => {
            userInfo.value = response.data;
            console.log(userInfo.value);
        })
        .catch(error => {
            console.error('사용자 정보를 가져오는 중 오류가 발생했습니다.', error);
        })
        .finally(() => {
            loaded.value = true;
        });
        } else {
        console.error('잘못된 형식의 JWT 토큰입니다.');
        }
    }

    onMounted(async() => {
        await fetchRecruitList();
        await fetchCategory();

        const token = localStorage.getItem('token');

        if (token) {
        fetchUserInfo(token);
        } else {
        console.error('토큰이 없습니다.');
        }
    });

</script>

<template>
    <div class="all">
    <Header></Header>
    <div class="wrapper">
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
            <div class="fixed" @click="makeStudyClub()">스터디클럽 생성하기</div>
        </div>
        <div>
            <RecruitCard class="card" v-for="recruit in state.recruitList" :key="recruit.id" :recruit="recruit"></RecruitCard>
        </div>
    </div>
    
    <Footer></Footer>
</div>
</template>

<style scoped>
    @font-face {
        font-family: "감탄로드돋움체 Bold";
        src: url("@/assets/fonts/감탄로드돋움체 Bold.ttf") format("truetype");
    }
    .all {
        display: grid;
        grid-template-rows: 100px minmax(780px, auto) 200px;
        align-items: center;
    }

    body * {
        font-family: "감탄로드돋움체 Bold", sans-serif;
    }
    .wrapper {
        margin-left:12.5%;
        margin-right:12.5%;
        width:75%;
        display: grid;
    }
   .filter {
        margin: 20px 15px;
        display: flex;
        justify-content: space-between;
        margin-top: 5%;
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
    .fixed {
        border: 1px solid black;
        border-radius: 20px;
        background-color: aliceblue;
        padding: 20px;
        position: fixed;
        bottom: 50px;
        right: 50px;
        z-index: 999;
    }
</style>