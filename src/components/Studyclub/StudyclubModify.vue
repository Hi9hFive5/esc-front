<script setup>
    import { reactive, onMounted } from "vue";
    import { useRoute } from 'vue-router';
    
    const route = useRoute();
    const id = route.params.id;

    const state = reactive({
        category: []
    })

    const studyclub = reactive({
        name: "",
        introduce: "",
        memberLimit: "",
        endDate: "",
        studyId: 0
    })

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

    const fetchStudyclub = async(id) => {
        
        try {
            const response = await fetch(`http://localhost:8080/studyclub/detail/${id}`);

            if(!response.ok) {
                throw new Error('response is not ok');
            }

            const data = await response.json();
            
            studyclub.name = data.name;
            studyclub.introduce = data.introduce;
            studyclub.memberLimit = data.memberLimit;
            studyclub.studyId = data.studyId;
            studyclub.endDate = splitDate(data.endDate);

        } catch(error) {
            console.error('fetch error: ' + error.message);
        }
    };
    
    const modifyStudyclub = async() => {
        
        const modifyData = {
            name: studyclub.name,
            introduce: studyclub.introduce, 
            memberLimit: studyclub.memberLimit,
            endDate: studyclub.endDate,
            studyId: studyclub.studyId,
        }

        try {
            const response = await fetch(`http://localhost:8080/studyclub/modify/5`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(modifyData)
            });

            if(!response) {
                throw new Error('Network response was not ok');
            }
            
        } catch(error) {
            console.error('There was a problem with the fetch operation:', error.message);
        }
    };

    const splitDate = (date) => {
        return date.slice(0, 10);
    };

    onMounted(async() => {
        await fetchCategory();
        await fetchStudyclub(id);
    });
</script>

<template>
    <div class="container">
        <div class="title">스터디클럽 수정</div>
        <div class="info">
            <div class="name">스터디클럽 이름: 
                <input class="content" v-model="studyclub.name"/>
            </div>
            <div class="introduce">스터디클럽 소개: </div>
            <textarea class="content" cols="50" rows="5" v-model="studyclub.introduce"/>
            <div class="number">스터디클럽 정원: 
                <input type="number" class="content" v-model="studyclub.memberLimit"/>
            </div>
            <div class="category">스터디클럽 카테고리: 
                <select class="content" v-model="studyclub.studyId">
                    <option v-for="item in state.category" :value="item.id"> {{ item.studyName }} </option>
                </select>
            </div>
            <div class="date">스터디클럽 시험일: 
                <input type="date" class="content" v-model="studyclub.endDate">
            </div>
            <div class="goal">스터디클럽 목표 점수: 
                <input type="text" class="content">
            </div>
            <div class="submit" @click="modifyStudyclub">
                <button>수정하기</button>
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