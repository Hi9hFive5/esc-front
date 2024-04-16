<script setup>
    // 추후 모달로 변경
    import router from "@/router/router";
    import { ref } from "vue";
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const id = route.params.id;

    const title = ref();
    const content = ref();

    const registRecruit = async() => {
        
        const postData = {
            title: title.value,
            content: content.value
        }

        try {
            const response = await fetch(`/api/recruit/regist/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                    body: JSON.stringify(postData)               
            });

            if(!response) {
                throw new Error('Network response was not ok');
            }

            alert("모집글이 등록되었습니다!");
            router.push("/recruit-list");

        } catch(error) {
            console.error('There was a problem with the fetch operation:', error.message);
        }
    };
</script>

<template>
    <div class="container">
        <div class="title">모집글 등록</div>
        <div>
            <div class="recruit-title">
                <input type="text" placeholder="제목" style="width: 500px" v-model="title"></input>
            </div>
            <div class="recruit-content">
                <textarea placeholder="본문" style="width: 500px" rows="20" v-model="content"></textarea>
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