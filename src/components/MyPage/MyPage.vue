<template>
<div class="container">
    <div class="userImage">
      <form  enctype="multipart/form-data">
        <div>
        <img :src="imageUrl" alt="Uploaded Image">
        </div>
      </form>
        <div>
          <input type="file" @change="handleFileChange">
          <button @click ="uploadImage">Upload</button>
         </div>
    </div> 
    <div class="userInfo">
        <p>이름: {{ userdata.name }} </p>
        <p>이메일: {{ userdata.email }} </p>
        <p>별명: {{ userdata.nickname }} </p>
        <p>등급: {{ userdata.grade }} </p>
    </div>
</div>

<div class="container">
    
    <div class="bigPage">
        <p>참여중인 스터디</p>
        <div class="smallPage">
            <RouterLink v-for="userinfo in userinfos" :to="{ path: `/studyclub/${userinfo.studyclubId}` }" :key="userinfo.id">
                <p>{{ userinfo.studyclubId }}. {{ userinfo.name }} </p>
            </RouterLink>
        </div>
    </div>
    <div class="bigPage">
        <p>참여 신청한 스터디</p>
        <div class="smallPage">
          <RouterLink v-for="userrecruit in userrecruits" :to="{ path: `/recruit/${userrecruit.recruitPostId}` }" :key="userrecruit.id">
                <p> {{ userrecruit.recruitPostId }}. {{ userrecruit.recruitStatus }} </p>
          </RouterLink>
        </div>
    </div>
    <div class="bigPage">
        <p>작성한 로그</p>
        <div class="smallPage">
          <RouterLink v-for="userlog in userlogs" :to="{ path: `/studylog/${userlog.id}` }" :key="userlog.id">
                <p> {{ userlog.content }} </p>
          </RouterLink>
        </div>
    </div>
    <div class="bigPage">
        <p>작성한 모집글</p>
        <div class="smallPage">
          <div v-for="writeReruit in writeReruits" :key="writeReruit.id">
                <p> {{ writeReruit.title }}
                  <button type="button" class="btn btn-primary" id="newBtn" data-bs-toggle="modal" @click="showApplicationList(writeReruit)"
                    data-bs-target="#myModal">
                    신청 목록
                </button>
              </p>

              </div>
        </div>
    </div>
    <!-- The Modal -->
<div class="modal" id="myModal">
  <div class="modal-dialog">
    <div class="modal-content">

      <!-- Modal Header -->
      <div class="modal-header">
        <h4 class="modal-title">신청한 회원 목록</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <!-- Modal body -->
      <div class="modal-body">
          <div v-for="selectedRecruitApplication in selectedRecruitApplications" :key="selectedRecruitApplication.id">
            <p> {{ selectedRecruitApplication.name }} </p>
              <button @click="acceptApplication(selectedRecruitApplication)">수락</button>
              <button @click="rejectApplication(selectedRecruitApplication)">거절</button>
          </div>
      </div>

      <!-- Modal footer -->
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
      </div>

    </div>
  </div>
</div>
</div>
</template>

<script setup>
  import axios from 'axios';
  import { useRouter,RouterLink } from 'vue-router';
  import { ref, onMounted } from 'vue';

  const userinfos = ref([]);
  const userdata = ref([]);
  const userlogs = ref();
  const userrecruits = ref([]);
  const writeReruits = ref([]);
  const selectedRecruitApplications = ref([]);

  const router = useRouter();
  const memberId = router.currentRoute.value.params.id;


onMounted(async () => {

  try {
    const response = await axios.get(`http://localhost:8080/user/joinStudyClub/${memberId}`)
    // 요청이 성공했을 때 받은 데이터를 Vue 컴포넌트 데이터에 저장
    userinfos.value = response.data    

    
  } catch (error) {
    console.error('데이터를 받아오는 중 에러 발생:', error);
  }
});

onMounted(async () => {

try {
  const res = await axios.get(`http://localhost:8080/user/${memberId}`)
  // 요청이 성공했을 때 받은 데이터를 Vue 컴포넌트 데이터에 저장
  userdata.value = res.data    

  
} catch (error) {
  console.error('데이터를 받아오는 중 에러 발생:', error);
}
});

onMounted(async () => {

try {
  const response = await axios.get(`http://localhost:8080/recruit-apply/user/${memberId}`)
  // 요청이 성공했을 때 받은 데이터를 Vue 컴포넌트 데이터에 저장
  userrecruits.value = response.data    
  
} catch (error) {
  console.error('데이터를 받아오는 중 에러 발생:', error);
}
});



onMounted(async () => {

try {
  const response = await axios.get(`http://localhost:8080/recruit/list/${memberId}`)
  // 요청이 성공했을 때 받은 데이터를 Vue 컴포넌트 데이터에 저장
  writeReruits.value = response.data    
  
} catch (error) {
  console.error('데이터를 받아오는 중 에러 발생:', error);
}
});

onMounted(async () => {

try {
  const response = await axios.get(`http://localhost:8080/studyLog/findWritingStudyclubLogById/${memberId}`)
  // 요청이 성공했을 때 받은 데이터를 Vue 컴포넌트 데이터에 저장
  userlogs.value = response.data    
  
} catch (error) {
  console.error('데이터를 받아오는 중 에러 발생:', error);
}
});

const file = null;
const userId = router.currentRoute.value.params.id;

const handleFileChange = (event) => {
  file = event.target.files[0];
};

const uploadImage = () => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);

  axios.post('http://localhost:8080/file/upload', formData)
    .then(response => {
      console.log('Image uploaded successfully:', response.data);
    })
    .catch(error => {
      console.error('Error uploading image:', error);
    });
};

const imageUrl = ref('');

const getImageUrl = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/file/${memberId}`);
    imageUrl.value = URL.createObjectURL(response.data);
    console.log(imageUrl)

    console.log(response)
  } catch (error) {
    console.error('Error getting image:', error);
  }
};
onMounted(() => {
  const memberId = router.currentRoute.value.params.id;
  getImageUrl(memberId);
});

const userlists = ref([]);

const showApplicationList = async (writeReruit) => {
  try {
    const response = await axios.get(`http://localhost:8080/recruit-apply/post/${writeReruit.id}`);
    selectedRecruitApplications.value = response.data;
    console.log(selectedRecruitApplications.value)
  } catch (error) {
    console.error('에러 발생:', error);
  }
};

const acceptApplication = async (application) => {
  try {
    const response = await axios.put(`http://localhost:8080/recruit-apply/accept/${application.id}`);
    console.log(response.data); // 수락 결과를 콘솔에 출력하거나 필요한 작업을 수행할 수 있습니다.

  } catch (error) {
    console.error('에러 발생:', error);
  }
};

const rejectApplication = async (application) => {
  try {
    const response = await axios.put(`http://localhost:8080/recruit-apply/reject/${application.id}`);
    console.log(response.data); // 거절 결과를 콘솔에 출력하거나 필요한 작업을 수행할 수 있습니다.

  } catch (error) {
    console.error('에러 발생:', error);
  }
};
</script>

<style scoped>
.container {
    display: flex;
    align-items: center;
    justify-content: center;
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
.bigPage {

    margin-right: 20px;
    margin-left: 20px;
    border: 1px solid black;
    background-color: black;
    color: white;
    font-family: '감탄로드돋움체 Bold';
    src: url('@/assets/fonts/감탄로드돋움체 Bold.ttf') format('truetype');
       
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

.modal-body {

}

</style>