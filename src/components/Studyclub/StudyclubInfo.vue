<script setup>
  import { reactive, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const id = route.params.id;

  const state = reactive({
    studyclub: {},
    category: {}
  });

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
    await fetchStudyclub(id);
    await fetchCategory(state.studyclub["studyId"]);
  })
</script>

<template>
    <div>스터디그룹 페이지</div>
    <div class="hello">👋 <{{ state.studyclub["name"] }}>에 오신 것을 환영합니다!</div>
    <div class="info">
        <div class="d-day"> {{ state.category["studyName"] }} 시험일: {{ state.studyclub["endDate"] }}  (D - n)</div>
        <div class="goal">목표 점수: 추가추가추가추가</div>
        <div class="introduce">{{ state.studyclub["introduce"] }}</div>
    </div>
</template>
    
<style scoped>
    .hello {
        text-align: center;
        font-size: 30px;
        margin: 30px;
    }
    .info {
        text-align: center;
    }
    .goal {
        margin: 10px;
    }
    .introduce {
        margin: 30px;
    }
</style>