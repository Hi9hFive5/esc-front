<!-- 스터디 일정들 조회 -->
<script setup>
    import { reactive, ref, onMounted } from "vue";
    import { useRoute, useRouter } from "vue-router";
    import axios from 'axios';
    import moment from 'moment';
    // import Save from "@/components/StudyScheduleSave.vue";
    // import { StudyScheduleInfo as Info } from "@/components/Schedule/StudyScheduleInfo.vue";
    
    const route = useRoute();
    const router = useRouter();
    const studyclubId = route.params.studyclubId;
    const memberId = ref();

    const schedules = ref([]);

    const fetchStudySchedules = async(id) => {
        console.log(id);
        try {
            const response = await axios.get(`http://localhost:8080/study-schedule/studyclub/${id}`);
            const data = response.data;
            console.log(data);

            const scheduleArray = [];

            data.studySchedules.forEach(studySchedule => {
                const startDate = moment(studySchedule.startDatetime).format('YYYY-MM-DDTHH:mm');
                const endDate = moment(studySchedule.endDatetime).format('YYYY-MM-DDTHH:mm');

                if(studySchedule.useStatus == 'Y'){
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

        } catch(error) {
            console.error('There was a problem with the fetch operation:', error.message);
        }
    };

    onMounted(async() => {
        await fetchStudySchedules(studyclubId);
    })

    const navigateToDetail = (id) => {
        router.push(`/study-schedule/schedule/${id}`);
    };

    const newSchedule = () => {
        router.push(`/study-schedule/save/${studyclubId}`);    
    };

</script>

<template> 
  <div class="container">
    <div class="scheduleTitle">스터디 일정 목록</div>
    <div class="button-container">
      <!-- <button class="add-btn" @click.stop="newSchedule()">+ 추가하기</button> -->
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
        <button class="detail-btn" @click.stop="navigateToDetail(row.id)">상세</button>
      </div>        
      </div>
    </div>
  <!-- </div> -->
</template>

<style>

.container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 30px;
    }
    .scheduleTitle {
        font-size: 30px;
        text-align: center;
        margin-top: 50px;
    }
    .button-container {
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
    .detail-btn {
        padding: 5px 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
</style>