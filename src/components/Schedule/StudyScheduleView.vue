<!-- 스터디 일정들 조회 -->
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from 'axios';
import moment from 'moment';
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer/Footer.vue";

const route = useRoute();
const router = useRouter();
const studyclubId = route.params.studyclubId;


const schedules = ref([]);

const userInfo = ref(null);
const loaded = ref(false);

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
        console.log('로그인: ', userInfo.value.id);
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


const fetchStudySchedules = async (id) => {
  console.log(id);
  try {
    const response = await axios.get(`http://localhost:30003/study-schedule/studyclub/${id}`);
    const data = response.data;
    console.log(data);

    const scheduleArray = [];

    data.studySchedules.forEach(studySchedule => {
      const startDate = moment(studySchedule.startDatetime).format('YYYY-MM-DDTHH:mm');
      const endDate = moment(studySchedule.endDatetime).format('YYYY-MM-DDTHH:mm');

      if (studySchedule.useStatus == 'Y') {
        const schedule = {
          id: studySchedule.id,
          title: studySchedule.title,
          content: studySchedule.content,
          start: startDate,
          end: endDate,
          useStatus: studySchedule.useStatus,
          writerId: studySchedule.writerId,
          studyclubId: studySchedule.studyclub
        }
        scheduleArray.push(schedule);
      }
    });

    schedules.value = scheduleArray;
    console.log(schedules.value);

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error.message);
  }
};

onMounted(async () => {
  await fetchStudySchedules(studyclubId);

  const token = localStorage.getItem('token');

  if (token) {
    fetchUserInfo(token);

  } else {
    console.error('토큰이 없습니다.');
  }
})

// 스터디 미팅 상세으로 이동(StudyScheduleInfo)
const navigateToDetail = (id) => {
  router.push(`/study-schedule/schedule/${id}`);
};

// 그룹 스케줄러 화면으로 이동(MemberScheduleView)
const navigateToMemberSchedule = () => {
  router.push(`/member-schedule/${studyclubId}/${userInfo.value.id}`);
}

// 스터디로 이동
const navigateToStudy = () => {
  router.push(`/studyclub/${studyclubId}`);
}
</script>

<template>
  <div class="all">
    <Header></Header>
    <div class="wrapper">
      <div class="container">
        <div class="scheduleTitle">스터디 미팅</div>
        <div class="buttonBox">
          <button @click.stop="navigateToStudy">스터디</button>
          <button @click.stop="navigateToMemberSchedule">그룹 스케줄러</button> 
        </div>
        <div v-for="(row, index) in schedules" class="list">
          <div class="list-item">
            <div class="item">
              <div class="rowTitle">{{ index + 1 }}. {{ row.title }}</div>
              <div class="Time">
                <div class="rowTime">시작시간: {{ row.start }}</div>
                <div class="rowTime">종료시간: {{ row.end }}</div>
              </div>
            </div>
            <button class="deatils" @click.stop="navigateToDetail(row.id)">상세</button>
          </div>
        </div>
      </div>
    </div>

    <Footer></Footer>
  </div>


</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 30px;
}

.wrapper {
  margin-left: 12.5%;
  margin-right: 12.5%;
  width: 75%;
  display: grid;
}

.all {
  display: grid;
  grid-template-rows: 100px minmax(780px, auto) 200px;
  align-items: start;
}

.scheduleTitle {
  font-size: 30px;
  text-align: center;
  margin-top: 50px;
}

.buttonBox {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.add-btn {
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.list {
  font-size: 20px;
  text-align: left;
  width: 100%;
  max-width: 1000px;
  padding: 1px;
  box-sizing: border-box;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  height: 100px;
}

.Time {
  display: flex;
  justify-content: space-between;
}

.rowTime {
  padding: 10px;
  font-size: 15px;
}

.deatils {
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>