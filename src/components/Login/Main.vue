<template>
    <div class="wrapper">
        <!-- <p class="login">로그인 전 화면~</p> -->
        <!-- <div class="first"><img src="@/assets/boring.gif"></div> -->
        
        <div style="height: 200vh" class="studyclub">
            <div class="second">
                <img src="@/assets/alphabet.png">
                <div>
                    <div>스터디클럽에 대한 설명</div>
                    <div>스터디클럽 생성하러 가기</div>       
                </div>
            </div>
        </div>
        <div class="first">
            <div>혼자 공부하면 집중이 안된다는 내용</div>
            <img src="@/assets/student.png">
        </div>
        <div></div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
}); 

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

const handleScroll = () => {
    const scrollY = window.scrollY;

    if(450 < scrollY && scrollY < 500) {
        window.scrollTo({
            top: 1500,
            behavior: "smooth"
        });
    }
};
</script>

<style scoped>
    .login {
        height: 800%;
    }
    .studyclub {
        align-items: center;
    }
    .first {
        width: 100%;
        height: 100vh;
        background-color:coral;
        display: flex;
        justify-content: space-between;
    }
    .first img {
        height: fit-content;
        margin-top: auto;
        right: 0;
    }
    .second {
        display: flex;
        justify-content: space-between;
    }
</style>