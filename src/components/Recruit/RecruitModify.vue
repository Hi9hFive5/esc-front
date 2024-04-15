<script setup>
    import { reactive, onMounted } from "vue";
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const id = route.params.id;

    const recruitPost = reactive({
        title: "",
        content: ""
    })

    const fetchRecruitPost = async(id) => {

        try {
            const response = await fetch(`/api/recruit/detail/${id}`);

            if(!response.ok) {
                throw new Error('response is not ok');
            }

            const data = await response.json();

            recruitPost.title = data.title;
            recruitPost.content = data.content;

        } catch(error) {
            console.error('fetch error: ' + error.message);
        }
    };

    const modifyRecruitPost = async() => {

        const modifyRecruitPost = {
            title: recruitPost.title,
            content: recruitPost.content
        }

        try {
            const response = await fetch(`/api/recruit/modify/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(modifyData)
            });

            if(!response) {
                throw new Error('Network response was not ok');
            }
            
        } catch(error) {
            console.error('There was a problem with the fetch operation:', error.message);
        }
    }

    onMounted(async() => {
        await fetchRecruitPost(id);
    })
</script>

<template>
    <div class="container">
        <div class="title">모집글 수정</div>
        <div>
            <div class="recruit-title">
                <input type="text" placeholder="제목" style="width: 500px" v-model="recruitPost.title"></input>
            </div>
            <div class="recruit-content">
                <textarea placeholder="본문" style="width: 500px" rows="20" v-model="recruitPost.content"></textarea>
            </div>
        </div>
        <div class="submit" @click="registRecruit"><button>등록하기</button></div>
    </div>
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
    margin: 40px 0px;
  }
  .recruit-title {
    margin: 10px 20px;
  }
  .recruit-content {
    padding: 0px 20px;
  }
  .submit {
    display: flex;
    justify-content: center;
    padding: 20px;
  }
</style>