<template>
  <div>
    <h1>로그 생성</h1>
    <form @submit.prevent="createLog">
      <div class="box">
        <label for="content">내용:</label>
        <textarea id="content" v-model="logContent"></textarea>
      </div>
      <!-- 스터디 일정 정보 출력 -->
      <div v-if="schedule">
        <label>스터디 일정:</label>
        <p>{{ schedule.date }} - {{ schedule.time }}</p>
      </div>
      <button type="submit">로그 생성</button>
    </form>
  </div>
</template>

<script setup>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const studyclubId = router.currentRoute.value.params.id;
const logContent = ref('');
const schedule = ref(null); // 스터디 일정 정보를 저장할 변수

// 로그 생성 페이지 진입 시, 전달된 스터디 일정 정보 확인
if (router.currentRoute.value.params.schedule) {
  schedule.value = router.currentRoute.value.params.schedule;
}

async function createLog() {
  try {
    await axios.post(`http://localhost:30003/studyLog/insert`, {
      studyclubId: studyclubId,
      content: logContent.value,
      // 스터디 일정 정보도 함께 전달
      scheduleId: schedule.value ? schedule.value.id : null
    });
    // 로그 생성 후 이전 페이지로 이동
    router.go(-1);
  } catch (error) {
    console.error('로그 생성 중 에러 발생:', error);
  }
}
</script>

<style scoped>
.box {
  border: 1px solid black;
  height: 300px;
}
</style>