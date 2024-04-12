<script setup>
    import { reactive, ref, onMounted } from "vue";
    import { useRoute } from 'vue-router';
    
    const route = useRoute();
    const id = route.params.id;

    const state = reactive({
        category: [],
        goals: []
    })

    const name = ref();
    const introduce = ref();
    const memberLimit = ref();
    const endDate = ref();
    const selectedCategory = ref();
    const selectedGoal = ref();

    const fetchCategory = async() => {

        try {
            const response = await fetch('http://localhost:8080/studyclub/category');
            // 작성자 id 경로에 추후 추가

            if(!response.ok) {
                throw new Error('response is not ok');
            }

            const data = await response.json();
            state.category = data;

        } catch(error) {
            console.error('fetch error: ' + error.message);
        }
    };

    const fetchGoals = async() => {

        try {
            const response = await fetch(`http://localhost:8080/studyclub/goal/${selectedCategory.value}`);

            if(!response.ok) {
                throw new Error('response is not ok');
            }

            const data = await response.json();
            state.goals = data;
            
        } catch(error) {
            console.error('fetch error: ' + error.message);
        }
    }

    const registStudyClub = async() => {
        
        const postData = {
            name: name.value,
            introduce: introduce.value, 
            memberLimit: memberLimit.value,
            endDate: endDate.value,
            studyId: selectedCategory.value,
            goalId: selectedGoal.value
        }

        console.log(postData);

        try {
            const response = await fetch(`http://localhost:8080/studyclub/regist/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                    body: JSON.stringify(postData)
            });

            if(!response) {
                throw new Error('Network response was not ok');
            }
            
        } catch(error) {
            console.error('There was a problem with the fetch operation:', error.message);
        }
    };

    onMounted(async() => {
        await fetchCategory();
    });
</script>

<template>
    <div class="container">
        <div class="title">스터디클럽 등록</div>
        <div class="info">
            <div class="name">스터디클럽 이름: 
                <input class="content" v-model="name"/>
            </div>
            <div class="introduce">스터디클럽 소개: </div>
                <textarea class="content" cols="50" rows="5" v-model="introduce"/>
            <div class="number">스터디클럽 정원: 
                <input type="number" class="content" v-model="memberLimit"/>
            </div>
            <div class="category">스터디클럽 카테고리: 
                <select class="content" v-model="selectedCategory" @change="fetchGoals()">
                    <option v-for="item in state.category" :value="item.id"> {{ item.studyName }} </option>
                </select>
            </div>
            <div class="date">스터디클럽 시험일: 
                <input type="date" class="content" v-model="endDate">
            </div>
            <div class="goal">스터디클럽 목표 점수: 
                <select class="content" v-model="selectedGoal">
                    <option v-for="item in state.goals" :value="item.id"> {{ item.score }} </option>
                </select>
            </div>
            <div class="submit" @click="registStudyClub">
                <button>등록하기</button>
            </div>
        </div> 
    </div>
</template>

<style scoped>
   .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 30px;
   }
    .title {
        font-size: 30px;
        text-align: center;
        margin-top: 50px;
    }
    .info {
        margin: 40px;
        align-items: center;
    }
    .info div {
        margin: 10px;
    }
    .content {
        margin-left: 10px;
    }
    .submit {
        display: flex;
        justify-content: center;
        padding: 20px;
    }
</style>