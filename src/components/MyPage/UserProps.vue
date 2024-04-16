<script setup>
  import { defineProps, onMounted, reactive } from 'vue';
  import { useRouter } from 'vue-router';

  const props = defineProps({
    studyclub: Object,
    application: Object,
    log: Object,
    recruit: Object
  });

  const state = reactive({
    recruit: {}
  })

  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  }

  const fetchRecruit = async(id) => {
    try {
        const response = await fetch(`/api/recruit/detail/${id}`);
        
        if(!response.ok) {
            throw new Error('response is not ok');
        }

        const data = await response.json();
        state.recruit = data;

        console.log(props.application);

    } catch(error) {
        console.error('fetch error: ' + error.message);
    }
    }
  
  onMounted(async() => {
    if(props.application) await fetchRecruit(props.application["recruitPostId"]);
  })
</script>

<template>
    <div class="component" v-if="props.studyclub" @click="navigateTo(`/studyclub/${props.studyclub.id}`)">{{ studyclub.name }}</div>
    <div class="component" v-if="props.application" @click="navigateTo(`/recruit/${state.recruit.id}`)">{{ state.recruit["title"] }}&nbsp;&nbsp;&nbsp;
      <span class="status" v-if="application.recruitStatus =='대기'">{{ application.recruitStatus }}</span>
      <span class="status-Y" v-if="application.recruitStatus =='수락'">{{ application.recruitStatus }}</span>
      <span class="status-N" v-if="application.recruitStatus =='거절'">{{ application.recruitStatus }}</span>
    </div>
    <div class="component" v-if="props.log">{{ log["content"] }}</div>
    <div class="component" v-if="props.recruit" @click="navigateTo(`/recruit/${props.recruit.id}`)">{{ recruit["title"] }}</div>
</template>
<style>
    .component {
      margin: 10px;
      display: flex;
      justify-content: space-between;
    }
    .application {
      display: flex;
      justify-content: space-between;
    }
    .status {
      color: grey;
      margin: 10px;
    }
    .status-Y {
      color: rgb(16, 185, 16);
    }
    .status-N {
      color: red;
    }
</style>