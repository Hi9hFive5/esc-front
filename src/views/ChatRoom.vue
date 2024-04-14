<template>
    <div id="app" class="chatbox">
        <div class="colorPanel"
            :style="{ display: colorPanelShown ? 'flex' : 'none', opacity: colorPanelShown ? 'flex' : 'none' }">
            <div v-for="color in colors" class="colorPanel__colorSlot">
                <div class="colorPanel__color" :style="{ background: color }" @click="setColor(color)"></div>
            </div>
        </div>
        <div class="chatbox__header">
            <div class="chatbox__headerText">
                {{ roomName }}
                <div class="chatbox__onlineDot"></div>
            </div>
            <div class="chatbox__button" @click="colorPanelShown = !colorPanelShown"></div>
        </div>
        <div class="chatbox__messages">
            <div v-for="message in messages" :key="message.id" class="chatbox__messageBox"
                :class="{ 'chatbox__messageBox--primary': message.primary }">
                <div> {{ message.sender}}</div>
                <div class="chatbox__message" :class="{ 'chatbox__message--primary': message.primary }"
                    :style="{ background: chatColor }">
                    {{ message.text }}
                </div>
                
                <div class="chatbox__tooltip chatbox__tooltip--left">{{ message.date }}</div>
            </div>
        </div>
        <div class="chatbox__inputPanel">
            <input v-model="newMessage" @keyup.enter="send" class="chatbox__input" placeholder="메세지를 입력해주세요 !" />
            <div class="chatbox__tooltip chatbox__tooltip--bottom"
                :style="{ opacity: newMessage.length > 2 && !tutorialSeen ? 0.7 : 0 }">Enter!
            </div>
        </div>
    </div>
</template>

<script setup>
import moment from 'moment';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const socket = ref(null);
const roomId = useRoute();
const roomName = ref('');

onMounted(async () => {
    
    const response = await axios.get(`http://localhost:8080/chat/room/id/${roomId.params.id}`);
    const name = ref(response.data.roomName);
    roomName.value = name.value;

    const socketUrl = `ws://localhost:8080/chat/${roomId.params.id}`;

    socket.value = new WebSocket(socketUrl);
    socket.value.onopen = function (event) {
        console.log('WS connection is stable! ~uWu~');
    };

    socket.value.onmessage = function (message) {
        const parsedMessage = JSON.parse(message.data);
        parsedMessage.forEach(msg => {
            const newChatMessage = {
                id: messages.value.length + 1,
                sender: msg.sender, // 발신자 정보 추가
                text: msg.text,
                primary: false, // 발신자가 'me'일 경우 true, 아니면 false
                date: moment().format('hh:mm')
            };
            messages.value.push(newChatMessage);
        });
        console.log('message:', messages.value);
        console.log('Got a message from the WS: ', parsedMessage);
    }
})

const chatColor = ref('#c5e1a5'); // 메시지 배경색 설정
const colorPanelShown = ref(false);
const newMessage = ref('');
const tutorialSeen = ref(false);
const colors = ref([
    '#0084ff', '#ffc300', '#4af844',
    '#7646ff', '#a695c7', '#ff5ca1',
    '#fa3c4c', '#f56b78', '#33343f'
]);
const messages = ref([]);


function send() {
    if (newMessage.value.length > 0) {
        const newChatMessage = {
            id: messages.value.length + 1,
            sender: 'me',   // 토큰에서 닉네임 가져와서 넣기 
            text: newMessage.value,
            primary: true, // 내가 보낸 메시지는 오른쪽에 표시됨
            date: moment().format('hh:mm')
        };
        messages.value.push(newChatMessage);
        socket.value.send(JSON.stringify([newChatMessage]));
        newMessage.value = '';
        tutorialSeen.value = true;
    }
}

function setColor(color) {
    chatColor.value = color;
    colorPanelShown.value = false;
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto');

body {
    margin: 0;
    font-family: 'Roboto';
}

.visible {
    opacity: 1;
}

.colorPanel {
    position: absolute;
    margin: 70px auto;
    left: 0;
    right: 0;
    height: 200px;
    width: 200px;
    z-index: 3;
    background: white;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    box-shadow: 0 0 30px #aaa;
    transition: all 0.12s;
}

.colorPanel__colorSlot {
    box-sizing: border-box;
    width: 33%;
    height: 33%;
    padding: 10px;
}

.colorPanel__color {
    height: 100%;
    width: 100%;
    border-radius: 100px;
    cursor: pointer;
    background: #eee;
    transition-duration: 0.12s;
}

.colorPanel__color:hover {
    opacity: 0.7;
}

.chatbox {
    display: block;
    position: relative;
    max-width: 400px;
    margin: 70px auto;
    padding: 10px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 0 30px #eee;
    font-size: 17px;
}

@keyframes blinking {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.3;
    }

    100% {
        opacity: 1;
    }
}

.chatbox__header {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    font-weight: 900;
    padding: 10px 0;
    width: 100%;
    text-align: center;
    cursor: default;
    justify-content: space-between;
    border-bottom: 2px solid #f5f5f5;
}

.chatbox__headerText {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 20px;
}

.chatbox__onlineDot {
    display: block;
    background: #00C853;
    height: 10px;
    width: 10px;
    border-radius: 10px;
    margin-left: 5px;
    animation-name: blinking;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
}

.chatbox__tooltip {
    opacity: 0;
    z-index: 2;
    width: auto;
    font-size: 12px;
    text-align: center;
    padding: 3px 10px;
    cursor: default;
    position: absolute;
    color: rgb(173, 166, 166);
    box-sizing: border-box;
    border-radius: 15px;
    background: #111;
    transition: all 0.14s;
}

.chatbox__tooltip--bottom {
    top: 115%;
    margin-left: 110px;
    opacity: 0.2;
}

.chatbox__tooltip--left {
    right: calc(100% + 5px);
    right: -moz-calc(100% + 5px);
    margin-left: 5px;
    top: 5px;
}

.chatbox__messages {
    width: 100%;
    min-height: 400px;
    padding: 10px;
    box-sizing: border-box;
}

.chatbox__messageBox {
    width: 100%;
    margin-top: 5px;
    position: relative;
    display: flex;
}


.chatbox__messageBox--primary {
    flex-direction: row-reverse;
}

.chatbox__message {
    position: relative;
    display: inline-block;
    padding: 5px 20px;
    border-radius: 15px;
    cursor: default;
    background: #f1f1f1;
    color: white;
    transition: all 0.12s;
}

.chatbox__message:hover {
    opacity: 0.7;
}

.chatbox__message--primary {
    color: white;

}

.chatbox__inputPanel {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chatbox__input {
    font-family: 'Roboto';
    font-size: 1em;
    width: 100%;
    border: none;
    background: #f3f3f3;
    margin: 0 10px;
    padding: 5px 15px;
    color: #444;
    border-radius: 15px;
    box-sizing: border-box;
}

.chatbox__button {
    display: inline-block;
    height: 20px;
    width: 22px;
    color: white;
    border-radius: 15px;
    background: #0084ff;
    cursor: pointer;
    font-weight: 900;
    transition-duration: 0.1s;
}

.chatbox__button:hover {
    opacity: 0.7;
}

@media screen and (max-width: 450px) {
    .chatbox {
        box-sizing: border-box;
        margin: 0;
        max-width: 100%;
        width: 100%;
        border-radius: 0;
        height: 100%;
    }
}
</style>
