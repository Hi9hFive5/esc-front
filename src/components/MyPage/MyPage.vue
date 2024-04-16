<template>
<div>
  <div>{{ state.userInfo["nickname"] }}님의 마이페이지</div>
  <div class="profile">
    <img src="@/assets/profile.png" alt="">
  </div>
  <div class="user-info">
    <div></div>
    <div></div>
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
<!-- 3개
    모집글 펼치면 신청 목록
    수정하기 버튼 추가  -->
</template>

<script setup>
  import { useRoute, useRouter,RouterLink } from 'vue-router';
  import { reactive, ref, onMounted } from 'vue';
  import UserProps from '@/components/MyPage/UserProps.vue';

  const route = useRoute();
  const id = route.params.id;


  const state = reactive({
    userInfo: {},
    userStudyclubs: {},
    userApplications: {},
    userLogs: {},
    userRecruits: {}
  });

  const selectedRecruitApplications = ref([]);

  const fetchUserInfo = async() => {
    try {
      const response = await fetch(`http://localhost:8080/user/${id}`);

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
      const response = await fetch(`http://localhost:8080/user/joinStudyClub/${id}`);

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
      const response = await fetch(`http://localhost:8080/recruit-apply/user/${id}`);

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
      const response = await fetch(`http://localhost:8080/studyLog/findWritingStudyclubLogById/${id}`);

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
      const response = await fetch(`http://localhost:8080/recruit/list/${id}`);

      if(!response.ok) {
          throw new Error('response is not ok');
      }

      const data = await response.json();
      state.userRecruits = data;

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

.smallPage {
    background-color: white;
    width: 180px;
    height: 210px;
    padding: 20px;
    color: black;
    overflow-y: auto;
    font-size: 15px;

}
.profile img {
  margin-top: 20px;
  padding: 30px;
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
#newBtn {
  font-size: 7px; /* 폰트 크기 조정 */
  padding: 3px 6px; /* 내부 여백 조정 */
}
.userImage {
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
}
</style>