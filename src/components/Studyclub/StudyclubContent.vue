<template>
    <div class="container">
        <div class="section">
            <div class="section-title">
                멤버
                <RouterLink v-for="userinfo in userinfos" :to="{ path: `/mypage/${userinfo.id}` }" :key="userinfo.id">
                    <p>{{ userinfo.name }} </p>
                </RouterLink>
            </div>
        </div>
        <div class="section">
            <div class="section-title">
                로그            로그 적기
                <RouterLink v-for="studylog in studylogs" :to="{ path: `/studyLog/${studylog.studyclubId}` }" :key="studylog.id">
                    <p>{{ studylog.content }} </p>
                </RouterLink>
            </div>
        </div>
        <div class="section">
            <div class="section-title">일정</div>
        </div>
    </div>
</template>

<script setup>

import axios from 'axios';
  import { useRouter,RouterLink } from 'vue-router';
  import { ref, onMounted } from 'vue';

  const userinfos = ref([]);


  const router = useRouter();
  const studyclubId = router.currentRoute.value.params.id;

onMounted(async () => {

try {
  const response = await axios.get(`http://localhost:8080/user/findJoinMemberAndName/${studyclubId}`)
  // 요청이 성공했을 때 받은 데이터를 Vue 컴포넌트 데이터에 저장
  userinfos.value = response.data 

  
} catch (error) {
  console.error('데이터를 받아오는 중 에러 발생:', error);
}
});

const studylogs = ref([]);

onMounted(async () => {

try {
  const response = await axios.get(`http://localhost:8080/studyLog/findStudyclubLog/${studyclubId}`)
  // 요청이 성공했을 때 받은 데이터를 Vue 컴포넌트 데이터에 저장
  studylogs.value = response.data 
  console.log(studylogs.value); 

  
} catch (error) {
  console.error('데이터를 받아오는 중 에러 발생:', error);
}
});

</script>

<style scoped>
    .container {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        gap: 10px;
    }
    .container {
        margin-top: 60px;
    }
    .section {
        border: 1px solid black;
        height: 300px;
    }
</style>