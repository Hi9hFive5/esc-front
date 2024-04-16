<template>
    <Header></Header>
    <div id="app">
        <div id="calendar"></div>
    </div>
    <Footer></Footer>
</template>

<script setup>
    import { Calendar } from '@fullcalendar/core';
    import interactionPlugin from '@fullcalendar/interaction';
    import timeGridPlugin from '@fullcalendar/timegrid';
    import moment from 'moment';
    import Header from "@/components/Header/Header.vue";
    import Footer from "@/components/Footer/Footer.vue";

    import axios from 'axios'
    import { onMounted, ref } from 'vue'

    import { useRoute, useRouter } from "vue-router";

    const route = useRoute();
    const router = useRouter();
    const memberId = route.params.memberId;
    const studyclubId = route.params.studyclubId;

    // 생성된 이벤트들 저장
    const events = ref([]);

    let calendar = null;

    // 내 캘린더를 초기화하고 렌더링하는 함수
    function initMyCalendar(events) {
        if (calendar) {
            calendar.destroy(); // 기존 캘린더 객체 파괴
        }

        const calendarEl = document.getElementById('calendar');
        calendar = new Calendar(calendarEl, {
            plugins: [ timeGridPlugin, interactionPlugin ],
            initialView: 'timeGridWeek',
            firstDay: 1,    // 월요일 시작
            contentHeight: 'auto',   // 캘린더 높이설정, 스크롤바x 
            allDaySlot: false,       // allday 안보이게
            slotMinTime: '06:00:00',        // 캘린더 시간 설정
            slotMaxTime: '24:00:00',
            titleFormat: function (info) {  // tile 설정
                let year = info.date.year;
                let month = info.date.month + 1;

                return year + "년 " + month + "월";
            },
            locale: 'ko', //한국어 설정
            customButtons: { // 버튼별 기능
                customPrevY: {
                    icon: 'fc-icon-chevrons-left',
                    click: function() {
                    calendar.prevYear();
                    }
                },
                customPrev: {
                    icon: 'fc-icon-chevron-left',
                    click: function() {
                    calendar.prev();
                    }
                },
                customToday: {
                    text: 'Today',
                    click: function() {
                    calendar.today();
                    }
                },
                customNext: {
                    icon: 'fc-icon-chevron-right',
                    click: function() {
                    calendar.next();
                    }
                },
                customNextY: {
                    icon: 'fc-icon-chevrons-right',
                    click: function() {
                    calendar.nextYear();
                    }
                },
                customAll: {
                    text: 'All',
                    click: function() {
                        allFetchEvents();
                    }
                },
                customMy: {
                    text: 'My',
                    click: function() {
                        fetchEvents();
                    }
                }
            },
            headerToolbar: {
                left: 'customPrevY,customPrev,customToday,customNext,customNextY',
                center: 'title',
                right: 'customAll,customMy'
            },
            events: events.value,
            editable: true,
            selectable: true,
            select: function(info) {
                handleEventSelect(info, calendar);
            },
            eventClick: function(info) {

                // 일정 삭제 가능
                handleMyEventClick(info, calendar);
            },
            eventDrop: function(info) {

                // 이벤트 원래 위치로 이동, eventDrop 비활성화
                info.revert();
            },
            eventResize: function(info) {
                handleEventResize(info, calendar);
            }
        });
    
        calendar.render(); // 새로운 캘린더 렌더링
    }   

    // 겹쳐지는 시간 캘린더를 초기화하고 렌더링하는 함수
    function initAllCalendar(events) {
        if (calendar) {
            calendar.destroy(); // 기존 캘린더 객체 파괴
        }

        const calendarEl = document.getElementById('calendar');
        calendar = new Calendar(calendarEl, {
            plugins: [ timeGridPlugin, interactionPlugin ],
            initialView: 'timeGridWeek',
            firstDay: 1,    // 월요일 시작
            contentHeight: 'auto',   // 캘린더 높이설정, 스크롤바x 
            allDaySlot: false,       // allday 안보이게
            slotMinTime: '06:00:00',        // 캘린더 시간 설정
            slotMaxTime: '24:00:00',
            titleFormat: function (info) {  // tile 설정
                let year = info.date.year;
                let month = info.date.month + 1;

                return year + "년 " + month + "월";
            },
            locale: 'ko', //한국어 설정
            customButtons: { // 버튼별 기능
                customPrevY: {
                    icon: 'fc-icon-chevrons-left',
                    click: function() {
                    calendar.prevYear();
                    }
                },
                customPrev: {
                    icon: 'fc-icon-chevron-left',
                    click: function() {
                    calendar.prev();
                    }
                },
                customToday: {
                    text: 'Today',
                    click: function() {
                    calendar.today();
                    }
                },
                customNext: {
                    icon: 'fc-icon-chevron-right',
                    click: function() {
                    calendar.next();
                    }
                },
                customNextY: {
                    icon: 'fc-icon-chevrons-right',
                    click: function() {
                    calendar.nextYear();
                    }
                },
                customAll: {
                    text: 'All',
                    click: function() {
                        allFetchEvents();
                    }
                },
                customMy: {
                    text: 'My',
                    click: function() {
                        fetchEvents();
                    }
                }
            },
            headerToolbar: {
                left: 'customPrevY,customPrev,customToday,customNext,customNextY',
                center: 'title',
                right: 'customAll,customMy'
            },
            events: events.value,
            eventClick: function(info) {
                console.log('클릭시');
                console.log(info.event.studyclubId);
                console.log(info.event.start);
                console.log(info.event.end);
                // 스터디 일정 추가
                handleAllEventClick(info, calendar);
            },
        });
    
        calendar.render(); // 새로운 캘린더 렌더링
    }   

    // 멤버 한명의 이벤트 데이터를 가져오는 함수
    async function fetchEvents() {
        try {
            const response = await axios.get(`http://localhost:8080/member-schedule/member/${studyclubId}/${memberId}`);
            const data = response.data;
            // 이벤트 배열 초기화
            const eventsArray = [];

            // 데이터에서 각 항목을 이벤트 객체로 변환하여 배열에 추가
            data.memberSchedules.forEach(schedule => {
                const startDateTimeArray = schedule.startDatetime;
                const startDateTime = new Date(startDateTimeArray[0], startDateTimeArray[1] - 1, startDateTimeArray[2], startDateTimeArray[3], startDateTimeArray[4]);

                const endDateTimeArray = schedule.endDatetime;
                const endDateTime = new Date(endDateTimeArray[0], endDateTimeArray[1] - 1, endDateTimeArray[2], endDateTimeArray[3], endDateTimeArray[4]);
                
                const eventObject = {
                    id: schedule.id,
                    start: startDateTime,
                    end: endDateTime,
                    memberId: schedule.memberId,
                    studyclubId: schedule.studyclubId,
                };
                eventsArray.push(eventObject);
            });

            // 이벤트 배열을 ref 변수에 할당
            events.value = eventsArray;

            initMyCalendar(events); // 캘린더 초기화
        } catch (error) {
            console.error('이벤트 데이터를 불러오는 중 오류 발생:', error);
        }
    }

    async function allFetchEvents() {
        try {
            const response = await axios.get(`http://localhost:8080/member-schedule/overlap/${studyclubId}`);
            const data = response.data;

            data.memberSchedules.sort((a, b) => {
                // 시작 시간을 비교하여 오름차순으로 정렬
                const startComparison = new Date(a.startDatetime[0], a.startDatetime[1] - 1, a.startDatetime[2], a.startDatetime[3], a.startDatetime[4]) - new Date(b.startDatetime[0], b.startDatetime[1] - 1, b.startDatetime[2], b.startDatetime[3], b.startDatetime[4]);
                return startComparison;
            });
            
            // 전체 이벤트 배열
            const eventsArray = [];

            // 데이터에서 각 항목을 이벤트 객체로 변환하여 배열에 추가
            data.memberSchedules.forEach(schedule => {
                const startDateTimeArray = schedule.startDatetime;
                const startDateTime = new Date(startDateTimeArray[0], startDateTimeArray[1] - 1, startDateTimeArray[2], startDateTimeArray[3], startDateTimeArray[4]);

                const endDateTimeArray = schedule.endDatetime;
                const endDateTime = new Date(endDateTimeArray[0], endDateTimeArray[1] - 1, endDateTimeArray[2], endDateTimeArray[3], endDateTimeArray[4]);
                
                if(eventsArray.length !== 0){
                    if(eventsArray[eventsArray.length-1].end.getTime() === startDateTime.getTime()){
                        eventsArray[eventsArray.length-1].end = endDateTime;
                    } 
                    else {
                        const eventObject = {
                                start: startDateTime,
                                end: endDateTime,
                                memberId: memberId,
                                studyclubId: studyclubId,
                                color: "pink",
                                title: '일정 추가'  // 리더만 가능
                        };
                        eventsArray.push(eventObject);
                    }
                } else {
                        const eventObject = {
                                start: startDateTime,
                                end: endDateTime,
                                memberId: memberId,
                                studyclubId: studyclubId,
                                color: "pink",
                                title: '일정 추가'  // 리더만 가능
                        };
                        eventsArray.push(eventObject);
                }
            });
            
            // 이벤트 배열을 ref 변수에 할당
            events.value = eventsArray;

            initAllCalendar(events); // 캘린더 초기화
        } catch (error) {
            console.error('이벤트 데이터를 불러오는 중 오류 발생:', error);
        }
    }

    onMounted(async() => {
        await fetchEvents();
    });

    // 일정 새로 추가
    async function saveEventData(eventData) {
        try {
            // 서버에 데이터 전송을 위한 HTTP POST 요청
            const response = await axios.post(`http://localhost:8080/member-schedule/save`, eventData);
            console.log('이벤트 데이터가 성공적으로 저장되었습니다:', response.data);
        } catch (error) {
            console.error('이벤트 데이터를 저장하는 동안 오류가 발생했습니다:', error);
        }
        }

        // 기존 일정 변경
    async function modifyEventData(eventData) {
        try {
            // 서버에 데이터 전송을 위한 HTTP PUT 요청
            const response = await axios.put(`http://localhost:8080/member-schedule/modify`, eventData);
            console.log('이벤트 데이터가 성공적으로 저장되었습니다:', response.data);
        } catch (error) {
            console.error('이벤트 데이터를 저장하는 동안 오류가 발생했습니다:', error);
        }
    }

    // 기존 일정 삭제
    async function removeEventData(id) {
        try {
            // 서버에 데이터 전송을 위한 HTTP DELETE 요청
            console.log(id);
            const response = await axios.delete(`http://localhost:8080/member-schedule/remove/${id}`);
            console.log('이벤트 데이터가 성공적으로 삭제 되었습니다:', response.data);
        } catch (error) {
            console.error('이벤트 데이터를 삭제하는 동안 오류가 발생했습니다:', error);
        }
    }

    // 스터디 일정 추가

    // 이벤트 셀렉 함수
    async function handleEventSelect(info, calendar) {
        let start = info.start; // 선택한 시작시간
        let end = info.end;     // 선택한 종료시간

        let eventData; // 전송할 이벤트
        
        let eventmerge = false; // 머지 가능 여부
        
        for (const eventitem of events.value) {

            // 머지 가능한 이벤트 찾기
            if(eventitem !== null && typeof eventitem !== 'undefined') {

            console.log(eventitem);
            // 셀렉한 부분의 시작 시간이 기존 이벤트의 사이에 존재할 때
            if (moment(start).format('YYYY-MM-DD HH:mm') >= moment(eventitem.start).format('YYYY-MM-DD HH:mm') && moment(start).format('YYYY-MM-DD HH:mm') <= moment(eventitem.end).format('YYYY-MM-DD HH:mm')) {
                eventmerge = true;
                eventitem.end = end;
            
            // 셀렉한 부분의 종료 시간이 기존 이벤트 사이에 존재할 때
            } else if (moment(end).format('YYYY-MM-DD HH:mm') >= moment(eventitem.start).format('YYYY-MM-DD HH:mm') && moment(end).format('YYYY-MM-DD HH:mm') <= moment(eventitem.end).format('YYYY-MM-DD HH:mm')) {
                eventmerge = true;
                eventitem.start = start;

            // 셀렉한 부분의 시간이 기존이벤트를 포함할 때
            } else if (moment(start).format('YYYY-MM-DD HH:mm') <= moment(eventitem.start).format('YYYY-MM-DD HH:mm') && moment(end).format('YYYY-MM-DD HH:mm') >= moment(eventitem.end).format('YYYY-MM-DD HH:mm')){
                eventmerge = true;
                eventitem.start = start;
                eventitem.end = end;
            }
            }

            // 머지 가능한 이벤트를 찾았을 때
            if(eventmerge) {
            if(eventitem.id){
                // events.value 수정하기
            eventData = eventitem;
            eventData.start = moment(eventitem.start).format('YYYY-MM-DD HH:mm:ss');
            eventData.end = moment(eventitem.end).format('YYYY-MM-DD HH:mm:ss');
            await modifyEventData(eventData);

            console.log('머지 트루');
            let calEvent = calendar.getEventById(eventitem.id);
            calEvent.setDates( eventitem.start ,eventitem.end);
            }
            break;
            }
        }

        if (!eventmerge) {
            console.log('머지 false');
            eventData = {
                start: start,
                end: end,
                memberId: memberId,
                studyclubId: studyclubId,
            };

            eventData.start = moment(start).format('YYYY-MM-DD HH:mm:ss');
            eventData.end = moment(end).format('YYYY-MM-DD HH:mm:ss');
            await saveEventData(eventData)

            eventData.editable = true;
            calendar.addEvent(eventData);
        }
        await fetchEvents();
    }
    
    //이벤트 리사이즈 함수
    async function handleEventResize(info, calendar) {
        let start = info.event.start;
        let end = info.event.end;
        let id = info.event.id;

        let eventData;
        
        // 두 이벤트를 하나로 병합
        let eventmerge = false;
        
        for (const eventitem of events.value) {
            console.log('머지 확인');
            if(eventitem !== null && typeof eventitem !== 'undefined') { 

                // 같은 이벤트일 때는 머지 안함
                if (Number(id) === eventitem.id) {
                    console.log('건너뜀');
                    continue;
                }

                // resize의 경우 아래에서 위로 합쳐지는 경우가 없음
                // 리사이즈한 이벤트와 겹치는 이벤트가 있을 때
                if (moment(end).format('YYYY-MM-DD HH:mm') >= moment(eventitem.start).format('YYYY-MM-DD HH:mm') && moment(end).format('YYYY-MM-DD HH:mm') <= moment(eventitem.end).format('YYYY-MM-DD HH:mm')) {
                    eventmerge = true;
                    eventitem.start = start;

                // 리사이즈한 이벤트가 이벤트 하나를 포함할 때
                } else if (moment(start).format('YYYY-MM-DD HH:mm') <= moment(eventitem.start).format('YYYY-MM-DD HH:mm') && moment(end).format('YYYY-MM-DD HH:mm') >= moment(eventitem.end).format('YYYY-MM-DD HH:mm')){
                    eventmerge = true;
                    eventitem.start = start;
                    eventitem.end = end;
                }
            }

            if(eventmerge) {
                let calEvent = calendar.getEventById(eventitem.id);
                if(calEvent !== null){
                    calEvent.setDates( eventitem.start, eventitem.end);

                    // events.value 수정하기
                    eventData = eventitem;
                    eventData.start = moment(eventitem.start).format('YYYY-MM-DD HH:mm:ss');
                    eventData.end = moment(eventitem.end).format('YYYY-MM-DD HH:mm:ss');
                    await modifyEventData(eventData);

                    const removedEvent = calendar.getEventById(id);
                    removedEvent.remove();

                    await removeEventData(id);
                } else {
                    info.revert();
                    await fetchEvents();
                }
                break; // break loop
            } 
        }
        if (!eventmerge) {
            let calEvent = calendar.getEventById(id);
            calEvent.setDates(start, end);

            eventData = events.value.find(event => event.id === Number(id));

            eventData.start = moment(start).format('YYYY-MM-DD HH:mm:ss');
            eventData.end = moment(end).format('YYYY-MM-DD HH:mm:ss');
            await modifyEventData(eventData);
        }
        await fetchEvents();
    }

    // 내 이벤트 클릭 함수
    async function handleMyEventClick(info, calendar) {
        let result = confirm('삭제 하시겠습니까?');
        let id = info.event.id;

        if(result === true) {
            const removedEvent = calendar.getEventById(id);
            removedEvent.remove();
            await removeEventData(id);
            await fetchEvents();
            alert("삭제 되었습니다.");
        }
    }

    // 전체 이벤트 클릭 함수
    async function handleAllEventClick(info, calendar){
        router.push({
            name: 'StudyScheduleSave',
            params: {
                studyclubId: info.event.studyclubId,
                start: info.event.start,
                end: info.event.end,
                memberId: memberId,
            }
        })

    }
</script>

<style>
    #app {
        font-family: Arial, sans-serif;
        text-align: center;
        margin-top: 20px;
    }
    #calendar {
        /* max-width: 900px; */
        /* height: 100%; */
        overflow: hidden;
        margin: 0 auto;
    }
</style>
