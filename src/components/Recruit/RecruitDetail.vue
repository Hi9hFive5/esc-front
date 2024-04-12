<script setup>
    import { reactive, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    
    const route = useRoute();
    const id = route.params.id;

    const state = reactive({
      recruit: {},
      studyclub: {},
      category: {}
    });

    const fetchRecruit = async(id) => {
        try {
            const response = await fetch(`http://localhost:8080/recruit/detail/${id}`);
            
            if(!response.ok) {
                throw new Error('response is not ok');
            }

            const data = await response.json();
            state.recruit = data;

        } catch(error) {
            console.error('fetch error: ' + error.message);
        }
    }

    const fetchStudyclub = async(id) => {
        try {
            const response = await fetch(`http://localhost:8080/studyclub/detail/${id}`);

            if(!response.ok) {
                throw new Error('response is not ok');
            }

            const data = await response.json();
            state.studyclub = data;

        } catch(error) {
            console.error('fetch error: ' + error.message);
        }
    }

    const fetchCategory = async(id) => {
        try {
            const response = await fetch(`http://localhost:8080/studyclub/category/${id}`);

            if(!response.ok) {
                throw new Error('response is not ok');
            }

            const data = await response.json();
            state.category = data;

        } catch(error) {
            console.error('fetch error: ' + error.message);
        }
    }

    onMounted(async() => {
        await fetchRecruit(id);
        await fetchStudyclub(state.recruit["clubId"]);
        await fetchCategory(state.studyclub["studyId"]);
    });
</script>

<template>
    <div class="post-header">
        <div class="title-area">
            <div class="title">{{ state.recruit["title"] }}</div>
            <div class="createdDate">{{ state.recruit["createdDate"] }}</div>
        </div>
        <div class="writer-area">
            <div class="writer">{{ state.recruit["writerId"] }}</div>
        </div>
    </div>
    <hr>
    <div>
        <div class="section">
            <div class="section-title">🌟 스터디클럽 이름</div>
            <div class="section-content">{{ state.studyclub["name"] }}</div> 
        </div>
        <div class="section">
            <div class="section-title">🌈 스터디클럽 소개</div>
            <div class="section-content">{{ state.studyclub["introduce"] }}</div>
        </div>
        <div class="section">
            <div class="section-title">✅ 모집 내용</div>
            <div class="section-subtitle">모집 인원: {{ state.studyclub["memberLimit"] }}명 </div>
            <div class="section-subtitle" style="margin-bottom: 20px;">카테고리: {{ state.category["studyName"] }}</div>
            <div class="section-content">{{ state.recruit["content"] }}</div> 
        </div>
        <div class="section">
            <div class="section-title">📅 진행 기간</div>
            <div class="section-content">~ {{ state.studyclub["endDate"] }}까지</div> 
        </div>
        <hr>
        <button>신청하기</button>
    </div>
</template>

<style scoped>
    .post-header {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }
    .title {
        text-align: center;
        font-size: 35px;
        margin: 10px;
        margin-bottom: 20px;
    }
    .createdDate {
        color: gray;
        margin: 10px;
    }
    .writer {
        margin: 10px;
        margin-top: 55px;
    }
    .section {
        margin: 30px 20px;
        text-align: left;
    }
    .section-title {
        font-size: 20px;
        margin: 10px;
    }
    .section-subtitle {
        margin-left: 45px;
        margin-bottom: 10px;
    }
    .section-content {
        margin-left: 40px;
    }
</style>