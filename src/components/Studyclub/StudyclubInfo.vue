<script setup>
  import { reactive, ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const id = route.params.id;

  const state = reactive({
    studyclub: {},
    category: {},
    goal: {},
    exam: {}
  });

  const fetchStudyclub = async(id) => {
    try {
        const response = await fetch(`http://localhost:30003/studyclub/detail/${id}`);

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
        const response = await fetch(`http://localhost:30003/studyclub/category/${id}`);

        if(!response.ok) {
            throw new Error('response is not ok');
        }

        const data = await response.json();
        state.category = data;

    } catch(error) {
        console.error('fetch error: ' + error.message);
    }
  }

  const fetchGoal = async(id) => {
    try {
        const response = await fetch(`http://localhost:30003/studyclub/study-goal/${id}`);

        if(!response.ok) {
            throw new Error('response is not ok');
        }

        const data = await response.json();
        state.goal = data;

    } catch(error) {
        console.error('fetch error: ' + error.message);
    }
  }

  const fetchExam = async(id) => {
    try {
          const response = await fetch(`http://localhost:30003/studyclub/study-exam/${id}`);

          if(!response.ok) {
              throw new Error('response is not ok');
          }

          const data = await response.json();
          state.exam = data;

          state.exam["examDate"] = splitDate(state.exam["examDate"]);
          state.studyclub["diff"] = calcDate(state.exam["examDate"]);

      } catch(error) {
          console.error('fetch error: ' + error.message);
      }
  }

  const splitDate = (date) => {

    return date.slice(0, 10);
  }

  const calcDate = (date) => {

    const currentDate = new Date(new Date().toISOString().slice(0, 10));
    console.log(date);

    return Math.trunc((new Date(date) - currentDate) / (1000 * 60 * 60 * 24));
  };

  onMounted(async() => {
    await fetchStudyclub(id);
    await fetchCategory(state.studyclub["id"]);
    await fetchGoal(id);
    await fetchExam(id);
  })
</script>

<template>
    <div>스터디그룹 페이지</div>
    <div class="hello">👋 <{{ state.studyclub["name"] }}>에 오신 것을 환영합니다!</div>
    <div class="info">
        <div class="d-day"> {{ state.category["studyName"] }} 시험일: {{ state.exam["examDate"]}}  (D - {{ state.studyclub["diff"] }})</div>
        <div class="goal">목표 점수: {{ state.goal["score"] }}</div>
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