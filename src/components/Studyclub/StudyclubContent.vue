<template>
    <div class="container">
        <div class="section">
            <div class="section-title">
                멤버
                <RouterLink v-for="userinfo in userinfos" :to="{ path: `/anotherpage/${userinfo.id}` }"
                    :key="userinfo.id">
                    <p>{{ userinfo.name }} </p>
                </RouterLink>
            </div>
        </div>
        <div class="section">
            <div class="section-title">

                <div class="log">
                    로그
                    <p></p>
                    <p></p>
                    <button @click="goToLogPage">로그 적기</button>
                </div>
                <RouterLink v-for="studylog in studylogs" :to="{ path: `/studyLog/${studylog.studyclubId}` }"
                    :key="studylog.id">
                    <p>{{ studylog.content }} </p>
                </RouterLink>
            </div>
        </div>
        <div class="section">
            <div class="section-title">
                <div class="title">스터디 일정 목록</div>
                <div class="button-container">
                    <button class="add-btn" @click.stop="viewCalendar()">+ 일정 추가</button>
                    <button class="add-btn" @click.stop="viewSchedule()">+ 더보기</button>
                </div>
                <div v-for="(row, index) in schedules" class="list">
                    <div class="list-item">
                        <span>{{ index + 1 }}. {{ row.title }}</span>
                        <!-- <button class="detail-btn" @click.stop="navigateToDetail(row.id)">상세</button> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import axios from 'axios';
import { useRouter, RouterLink, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import moment from 'moment';

const userinfos = ref([]);

const route = useRoute();
const router = useRouter();

// 같은 id
const studyclubId = router.currentRoute.value.params.id;
const id = route.params.id;

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

const fetchStudySchedules = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8080/study-schedule/studyclub/${id}`);
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

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error.message);
    }
};

onMounted(async () => {

    try {
        const response1 = await axios.get(`http://localhost:8080/user/findJoinMemberAndName/${studyclubId}`)
        // 요청이 성공했을 때 받은 데이터를 Vue 컴포넌트 데이터에 저장
        userinfos.value = response1.data
        console.log(userinfos);

        const response2 = await axios.get(`http://localhost:8080/studyLog/findStudyclubLog/${studyclubId}`)
        // 요청이 성공했을 때 받은 데이터를 Vue 컴포넌트 데이터에 저장
        studylogs.value = response2.data
        console.log(studylogs);

        await fetchStudySchedules(id);

        const token = localStorage.getItem('token');

        if (token) {
            fetchUserInfo(token);

        } else {
            console.error('토큰이 없습니다.');
        }



    } catch (error) {
        console.error('데이터를 받아오는 중 에러 발생:', error);
    }
});

const studylogs = ref([]);

const studyschedules = ref([]);
function goToLogPage() {
    router.push(`/addstudylog/${studyclubId}`);
}

const viewSchedule = () => {
        router.push(`/study-schedule/${id}`);    
    };

    const viewCalendar = () => {
        router.push(`/member-schedule/${id}/${userInfo.value.id}`);    
    };

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

.log {
    justify-content: space-between;
    display: flex;
}
</style>