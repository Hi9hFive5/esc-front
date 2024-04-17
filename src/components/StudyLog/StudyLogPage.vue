<template>
    <div class="all">
        <Header></Header>
        <div class="wrapper">
            <div class="post-header">
                <div class="title-area">
                    <div class="title">{{ logData.content }}</div>
                    <div class="createdDate">{{ logData.studydate }} ~ {{ logData.enrolldate }}</div>
                </div>
                <div class="writer-area">
                </div>
            </div>
            <hr>
            <div>
                <div class="section">
                    <div class="section-title">🌟 스터디 내용 </div>
                    <div class="section-content">{{ logData.contentInfo }}</div> 
                </div>
                <hr>
            </div>
        </div>
        <Footer></Footer>
    </div>
   
</template>

<script setup>
    import axios from 'axios';
    import { useRoute,RouterLink } from 'vue-router';
    import { ref, onMounted } from 'vue';
    import Header from "@/components/Header/Header.vue";
    import Footer from "@/components/Footer/Footer.vue";
    
    const route = useRoute();
    const id = route.params.id;
    const logData = ref([]); 


    onMounted(async () => {
    try {
      const response = await axios.get(`http://localhost:30003/studyLog/find/${id}`)

      logData.value = response.data 
    } catch (error) {
      console.error('데이터를 받아오는 중 에러 발생:', error);
    }
  });

</script>

<style scoped>
    .post-header {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
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
    .title {
        text-align: center;
        font-size: 35px;
        margin: 10px;
        margin-bottom: 20px;
        
    }
    .createdDate {
        color: gray;
        margin: 10px;
    }
    .writer {
        margin: 10px;
        margin-top: 55px;
    }
    .section {
        margin: 30px 20px;
        text-align: left;
    }
    .section-title {
        font-size: 20px;
        margin: 10px;
    }
    .section-subtitle {
        margin-left: 45px;
        margin-bottom: 10px;
    }
    .section-content {
        margin-left: 40px;
    }
</style>