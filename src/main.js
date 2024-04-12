import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from '../src/router/router.js'
import socket from 'vue3-websocket'

const app = createApp(App);

app.use(router);
app.use(socket, "ws://localhost:8080/myHandler")
app.mount('#app');
app.provide('$axios', axios);

