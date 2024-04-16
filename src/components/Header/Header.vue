<template>
    <header class="header">
        <div class="logo">
            <img src="../../assets/finalLogo.png" @click="main()" class="logoimage">
        </div>
        <div class="menu">
            <span @click="navigateTo('/')">소개</span>
            <span @click="navigateTo('/recruit-list')">모집</span>
            <span>스터디클럽</span>
            <span @click="navigateTo(`/mypage/${userInfo.id}`)">마이페이지</span>
        </div>
        <div class="loginbtndiv" v-if="isLoggedIn">
            <button type="button" class="logoutBtn" @click="logout()">logout</button>
            <button type="button" class="myPageBtn" onclick="">my page</button>
        </div>
        <div class="loginbtndiv" v-else>
            <button type="button" class="signUpBtn" @click="signup()">sign up</button>
            <button type="button" class="signInBtn"  @click="login()">sign in</button>
        </div> 
        
    </header>
</template>

<script setup>
    import router from '@/router/router';
    import { ref, computed, watch, reactive, onMounted } from "vue";
    import { useRouter } from 'vue-router';
    import axios from "axios";

    // const token = ref(localStorage.getItem('token'));

    // // 로그인 여부 계산
    // const isLoggedIn = ref(!!token.value);

    const navigateTo = (path) => {
        router.push(path);
    }

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

    // 페이지 로드 시 초기화
    onMounted(() => {
    // 로컬 스토리지에서 토큰 값을 가져와서 로그인 여부 갱신
        const token = localStorage.getItem('token');
        // isLoggedIn.value = !!token.value;
        if (token) {
        fetchUserInfo(token);

        } else {
        console.error('토큰이 없습니다.');
        }
    });

    function login() {
        router.push('/login');
    }

    function signup() {
        router.push('/regist');
    }

    function main() {
        router.push('/');
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        token.value = null; // 토큰 값 갱신
        isLoggedIn.value = false; // 로그인 여부 갱신
        router.push('/login');
    }


</script>

<style scoped>
@font-face {
    font-family: '감탄로드돋움체 Bold';
    src: url('@/assets/fonts/감탄로드돋움체 Bold.ttf') format('truetype');
}

* {
    margin: 0;
    padding: 0;
    font-family: 'GmarketSansMedium';
}

.header {
    width: 100%;
    height: 100px;
    position: relative;
    top: 0;
    background-color: white;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    justify-items: center;
}

.loginbtndiv {
    width:100%;
    text-align: end;
}

.signInBtn {
    background-color: #515050;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-style: bold;
    margin-top:53px;
    margin-right: 2%;
    
    
}

.signUpBtn {
    background-color: #515050;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-style: bold;
    margin-top:53px;    
    margin-right: 2%;
}

.logoutBtn {
    background-color: #515050;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-style: bold;
    margin-top:53px;
    margin-right: 2%;
    
    
}

.myPageBtn {
    background-color: #515050;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-style: bold;
    margin-top:53px;    
    margin-right: 2%;
}

.logoimage {
    width:100%;
    object-fit: contain;
}

.logo {
    width:120px;
    cursor: pointer;
    margin-top: 1%;
    margin-left: 2%;
    justify-self: start;
}

.menu {
    text-align: center;
    margin-top:65px;
    font-weight: bold;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-items: center;
}
.menu span{
    font-family: '감탄로드돋움체 Bold', sans-serif;
    margin-left: 3%;
    cursor: pointer;
}
</style>