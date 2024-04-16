<!-- 스터디 일정 추가 -->
<script setup>
    import { defineProps, reactive, ref, onMounted } from "vue";
    import { useRoute, useRouter } from 'vue-router';
    import axios from 'axios';
    import moment from 'moment';
    import Header from "@/components/Header/Header.vue";
    import Footer from "@/components/Footer/Footer.vue";
    
    const route = useRoute();
    const router = useRouter();
    const id = route.params.studyclubId;
    const startDate = route.params.start;
    const endDate = route.params.end;
    const memberId = route.params.memberId;
    const title = ref();
    const content = ref();
    const start = ref();
    const end = ref();
    const participantList = ref();
    const studyclubId = ref();

    const members = ref();

    const selectMember = ref('');
   
    // 리더만 작성할 수 있게 v-if 필요


    onMounted(async() => {
        studyclubId.value = Number(id);

        const startDateTime = moment(startDate, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
        const formattedStartDate = startDateTime.format('YYYY-MM-DDTHH:mm');
        start.value = formattedStartDate;

        const endDateTime = moment(endDate, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
        const formattedEndDate = endDateTime.format('YYYY-MM-DDTHH:mm');
        end.value = formattedEndDate;


        await fetchMember(studyclubId.value);
    });

    // 멤버목록 가져오기
    async function fetchMember(id) {
        try{
            const response = await axios.get(`http://localhost:8080/user/findJoinMemberAndName/${id}`);
            const data = response.data;
            
            unselectedMembers.value = data;
        } catch (error) {
            console.error('이벤트 데이터를 불러오는 중 오류 발생:', error);
        }
    }


    async function saveStudySchedule() {
        const startDateTime = moment(start.value);
        const formattedStartDate = startDateTime.format('YYYY-MM-DD HH:mm:ss');
        start.value = formattedStartDate;

        const endDateTime = moment(end.value);
        const formattedEndDate = endDateTime.format('YYYY-MM-DD HH:mm:ss');
        end.value = formattedEndDate;

        const select = [];
        if(selectedMembers.value.length > 0) {
            selectedMembers.value.forEach(member => {
                select.push(member.memberId);
            });
        }
        const postData = {
            title: title.value,
            content: content.value,
            start: start.value, 
            end: end.value,
            useStatus: 'Y',
            studyclubId: studyclubId.value,
            writerId: memberId,        //추후 변경
            participantList: select
        }
        console.log(postData);

        try {
            await axios.post(
                `http://localhost:8080/study-schedule/save`,
                postData
            );
            
        } catch(error) {
            console.error('There was a problem with the fetch operation:', error.message);
        }

        router.push(`/study-schedule/${studyclubId.value}`);
    }

    // 선택된 멤버
    const selectedMembers = ref([]);

    // 선택하지 않은 멤버
    const unselectedMembers = ref();


    // 선택된 멤버 추가
    function addParticipant(id) {
        const index = unselectedMembers.value.findIndex(member => member.id === id);
        if (index !== -1) {
            const selectedMember = unselectedMembers.value.splice(index, 1)[0];
            selectedMembers.value.push(selectedMember);
        }
    }

    // 선택된 멤버 삭제
    async function removeParticipant(id) {
        const index = selectedMembers.value.findIndex(member => member.id === id);
        if (index !== -1) {
            const unselectedMember = selectedMembers.value.splice(index, 1)[0];
            unselectedMembers.value.push(unselectedMember);
        }
    }

    
</script>

<template>
    <Header></Header>
    <div class="container">
        <div class="title">스터디 일정 등록</div>
        <div class="info">
            <div class="name">제목: 
                <input class="content" v-model="title"/>
            </div>
            <div class="introduce">내용: </div>
                <textarea class="content" cols="50" rows="5" v-model="content"/>
            <div class="date">시작 시간: 
                <input type="datetime-local" class="content" v-model="start">
            </div>
            <div class="date">종료 시간: 
                <input type="datetime-local" class="content" v-model="end">
            </div>
             <div class="member">참여 멤버:
                <select class="content" v-model="selectMember" @change="addParticipant(selectMember.id)">
                    <option disabled value="">선택해주세요</option>
                    <option v-for="item in unselectedMembers" :value="item" > {{ item.name }} </option>
                </select>
                <div class="selectedMember" v-for="item in selectedMembers" :value="item.id">
                    <div>{{ item.name }}</div>
                    <button @click="removeParticipant(item.id)">삭제</button>
                </div>
            </div>
            <div class="submit" @click="saveStudySchedule()">
                <button>등록하기</button>
            </div>
        </div> 
    </div>
    <Footer></Footer>
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

    .selectedMember{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>