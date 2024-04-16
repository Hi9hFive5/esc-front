<template>
  <div class="all">
    <Header></Header>
    <div class="wrapper">
      <div>
        <div style="margin: 20px; margin-bottom: 40px;">{{ state.userInfo["nickname"] }}님의 마이페이지</div>
        <div class="profile">
          <img src="@/assets/profile.png">
        </div>
        <div class="user-info">
          <div class="nickname">{{ state.userInfo["nickname"] }}</div>
          <div>포인트: {{ state.userInfo["point"] }}</div>
          <div>레벨: {{ state.userInfo["grade"] }}</div>
        </div>
      </div>

      <div class="container">
          <div class="box">
              <p class="box-title">참여 중인 스터디</p>
              <div class="box-content">
                <UserProps v-for="studyclub in state.userStudyclubs" :value="studyclub.name" :studyclub="studyclub"></UserProps>
              </div>
          </div>
          <div class="box">
              <p class="box-title">작성한 로그</p>
              <div class="box-content">
                <UserProps v-for="log in state.userLogs" :value="log" :log="log"></UserProps>
              </div>
          </div>
          <div class="box">
              <p class="box-title">참여 신청한 모집글</p>
              <div class="box-content">
                <UserProps v-for="application in state.userApplications" :value="application.id" :application="application"></UserProps>
              </div>
          </div>
          <!-- <div class="bigPage">
              <p>작성한 모집글</p>
              <div class="smallPage">
                <UserProps v-for="recruit in state.userRecruits" :value="recruit" :recruit="recruit"></UserProps>
                <div v-for="writeReruit in writeReruits" :key="writeReruit.id">
                      <p> {{ writeReruit.title }}
                        <button type="button" class="btn btn-primary" id="newBtn" data-bs-toggle="modal" @click="showApplicationList(writeReruit)"
                          data-bs-target="#myModal">
                          신청 목록
                      </button>
                    </p>

                    </div>
              </div>
          </div> -->
      <!-- <div class="modal" id="myModal">
        <div class="modal-dialog">
          <div class="modal-content">

            <div class="modal-header">
              <h4 class="modal-title">신청한 회원 목록</h4>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
                <div v-for="selectedRecruitApplication in selectedRecruitApplications" :key="selectedRecruitApplication.id">
                  <p> {{ selectedRecruitApplication.name }} </p>
                    <button @click="acceptApplication(selectedRecruitApplication)">수락</button>
                    <button @click="rejectApplication(selectedRecruitApplication)">거절</button>
                </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
            </div>

          </div>
        </div>
      </div> -->
      </div>
        <div>
          <div class="box" style="height: fit-content;">
              <p class="box-title">작성한 모집글</p>
              <div class="accordion accordion-flush" id="accordionFlushExample">
                <div class="accordion-item" v-for="recruit in state.userRecruits" :value="recruit" :key="recruit.id" :recruit="recruit">
                  <h2 class="accordion-header">
                    <button @click="fetchApplicationList(recruit.id)" class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#flush-collaps${recruit.id}`" aria-expanded="false" :aria-controls="`#flush-collapse${recruit.id}`">
                      {{ recruit.title }}
                    </button>
                  </h2>
                  <div :id="`flush-collaps${recruit.id}`" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body" v-for="apply in state.recruitApplications" >
                      <div class="apply-name">{{ apply.name }}</div>
                      <div class="apply-buttons">
                        <div>수락</div>
                        <div>거절</div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
      </div>
    </div>
    <Footer></Footer>
  </div>

<!-- 3개
    모집글 펼치면 신청 목록
    수정하기 버튼 추가  -->
</template>

<script setup>
  import { useRoute, useRouter,RouterLink } from 'vue-router';
  import { reactive, ref, onMounted } from 'vue';
  import UserProps from '@/components/MyPage/UserProps.vue';
  import Header from "@/components/Header/Header.vue";
  import Footer from "@/components/Footer/Footer.vue";

  const route = useRoute();
  const id = route.params.id;


  const state = reactive({
    userInfo: {},
    userStudyclubs: {},
    userApplications: {},
    userLogs: {},
    userRecruits: {},
    recruitApplications: {}
  });

  const selectedRecruitApplications = ref([]);

  const fetchUserInfo = async() => {
    try {
      const response = await fetch(`http://localhost:30003/user/${id}`);

      if(!response.ok) {
          throw new Error('response is not ok');
      }
      
      const data = await response.json();
      state.userInfo = data;

    } catch(error) {
        console.error('fetch error: ' + error.message);
    }
  }

  const fetchUserStudyclub = async() => {
    try {
      const response = await fetch(`http://localhost:30003/user/joinStudyClub/${id}`);

      if(!response.ok) {
          throw new Error('response is not ok');
      }

      const data = await response.json();
      state.userStudyclubs = data;

    } catch(error) {
        console.error('fetch error: ' + error.message);
    }
  }

  const fetchUserApplication = async() => {
    try {
      const response = await fetch(`http://localhost:30003/recruit-apply/user/${id}`);

      if(!response.ok) {
          throw new Error('response is not ok');
      }

      const data = await response.json();
      state.userApplications = data;

    } catch(error) {
        console.error('fetch error: ' + error.message);
    }
  }

  const fetchUserLog = async() => {
    try {
      const response = await fetch(`http://localhost:30003/studyLog/findWritingStudyclubLogById/${id}`);

      if(!response.ok) {
          throw new Error('response is not ok');
      }

      const data = await response.json();
      state.userLogs = data;

      console.log(state.userLogs);

    } catch(error) {
        console.error('fetch error: ' + error.message);
    }
  }
  
  const fetchUserRecruit = async() => {
    try {
      const response = await fetch(`http://localhost:30003/recruit/list/${id}`);

      if(!response.ok) {
          throw new Error('response is not ok');
      }

      const data = await response.json();
      state.userRecruits = data;

    } catch(error) {
        console.error('fetch error: ' + error.message);
    }
  }

  const fetchApplicationList = async(recruitId) => {
    try {
      const response = await fetch(`http://localhost:8080/recruit-apply/post/${recruitId}`);

      if(!response.ok) {
          throw new Error('response is not ok');
      }

      const data = await response.json();
      state.recruitApplications = data;

    } catch(error) {
        console.error('fetch error: ' + error.message);
    }
  }

  onMounted(async() => {
    await fetchUserInfo();
    await fetchUserStudyclub();
    await fetchUserApplication();
    await fetchUserLog();
    await fetchUserRecruit();
  })


// const file = null;
// const userId = router.currentRoute.value.params.id;

// const handleFileChange = (event) => {
//   file = event.target.files[0];
// };

// const uploadImage = () => {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('userId', userId);

//   axios.post('http://localhost:8080/file/upload', formData)
//     .then(response => {
//       console.log('Image uploaded successfully:', response.data);
//     })
//     .catch(error => {
//       console.error('Error uploading image:', error);
//     });
// };

// const imageUrl = ref('');

// const getImageUrl = async () => {
//   try {
//     const response = await axios.get(`http://localhost:8080/file/${memberId}`);
//     imageUrl.value = URL.createObjectURL(response.data);
//     console.log(imageUrl)

//     console.log(response)
//   } catch (error) {
//     console.error('Error getting image:', error);
//   }
// };
// onMounted(() => {
//   const memberId = router.currentRoute.value.params.id;
//   getImageUrl(memberId);
// });


// const showApplicationList = async (writeReruit) => {
//   try {
//     const response = await axios.get(`http://localhost:8080/recruit-apply/post/${writeReruit.id}`);
//     selectedRecruitApplications.value = response.data;
//     console.log(selectedRecruitApplications.value)
//   } catch (error) {
//     console.error('에러 발생:', error);
//   }
// };
// // const userlists = ref([]);
// const acceptApplication = async (application) => {
//   try {

//     const response = await axios.put(`http://localhost:8080/recruit-apply/accept/${application.id}`);


//     await insertMember(application);

//   } catch (error) {
//     console.error('에러 발생:', error);
//   }
// };

// const insertMember = async (application) => {
//   try {
//     console.log(application.id);
//     console.log(application);

//     const postData = { memberId: application.id, studyclubId: application.recruitPostId, someData: 'someValue' }; 
//     console.log(postData);
//     const response = await axios.post('http://localhost:8080/studyclubMember/insertMember', postData, {
//       headers: {
//         'Content-Type': 'application/json', // JSON 형식으로 데이터를 전송하기 위한 헤더 추가
//       },
//       body: JSON.stringify(postData)           
//     });

//     console.log('새로운 함수 응답 데이터:', response.data);
//   } catch (error) {
//     console.error('새로운 함수 에러 발생:', error);
//   }
// };

// const rejectApplication = async (application) => {
//   try {
//     const response = await axios.put(`http://localhost:8080/recruit-apply/reject/${application.id}`);
//     console.log(response.data);

//   } catch (error) {
//     console.error('에러 발생:', error);
//   }
// };
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.profile {
  display: flex;
  justify-content: center;
}
.wrapper {
    margin-left:12.5%;
    margin-right:12.5%;
    width:75%;
    display: grid;
}
.all {
    display: grid;
    grid-template-rows: 100px minmax(780px, auto) 200px;
    align-items: center;
}

/* .smallPage {
    background-color: white;
    width: 180px;
    height: 210px;
    padding: 20px;
    color: black;
    overflow-y: auto;
    font-size: 15px; */

/* } */
.profile img {
  margin: 20px 0px;
  height: 200px;
  width: 200px;
}
.box {
  flex: 1;
  border: 1px solid black;
  height: 300px;
  padding: 20px;
  margin: 20px;
}
.box-title {
    text-align: center;
    font-size: 20px;
    font-family: '감탄로드돋움체 Bold';
    src: url('@/assets/fonts/감탄로드돋움체 Bold.ttf') format('truetype');
}
.box-content {
  margin-top: 40px;
  padding: 0px, 20px;
}
.nickname {
  font-size: 30px;
  margin: 20px;
}
.user-info {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}
.accodian-body {
  display: flex;
  justify-content: space-between;
}
.apply-name {
  flex: 1;
}
/* .userImage {
    background-color: #ddd;
    width: 120px;
    height: 150px;
    padding: 10px;
    margin-bottom: 20px;
    margin-right: 60px;
    margin-left: 60px;
    justify-content: center;
}
.userInfo {
    background-color: white;
    width: 400px;
    height: 150px;
    padding: 10px;
    margin-bottom: 20px;
    margin-right: 60px;
    margin-left: 60px;
    justify-content: center;
    font-family: '감탄로드돋움체 Bold';
    src: url('@/assets/fonts/감탄로드돋움체 Bold.ttf') format('truetype');
    border: 1px solid black;
} */
</style>