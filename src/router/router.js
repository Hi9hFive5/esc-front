import {createRouter, createWebHistory} from 'vue-router';

const router = createRouter({

    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('../views/MainLogout.vue')
        },
        {
            path: '/login',
            component: () => import('../views/LoginPage.vue')
        },
        {
            path: '/after/login',
            component: () => import('../views/MainLogin.vue')
        },
        {
            path: '/regist',
            component: () => import('../views/Regist.vue')
        },
        {
            path: '/recruit-list',
            component: () => import('@/components/Recruit/RecruitList.vue')
        },
        {
            path: '/recruit/:id',
            component: () => import('@/components/Recruit/RecruitDetail.vue')
        },
        {
            path: '/studyclub/:id',
            component: () => import('@/views/StudyclubView.vue')
        },
        {
            path: '/studyclub-regist/:id',
            component: () => import('@/components/Studyclub/StudyclubRegist.vue')
        },
        {
            path: '/studyclub-modify/:id',
            component: () => import('@/components/Studyclub/StudyclubModify.vue')
        },
        {
            path: '/recruit-regist/:id',
            component: () => import('@/components/Recruit/RecruitRegist.vue')
        },
        {
            path: '/recruit-modify/:id',
            component: () => import('@/components/Recruit/RecruitModify.vue')
        },
        {
            path: '/member-schedule/:studyclubId/:memberId',
            component: () => import('@/components/Schedule/MemberSchedule.vue')
        },
        {
            path: '/findId',
            component: () => import('../views/FindIdPage.vue')
        },
        {
            path: '/findIdResult/:email',
            component: () => import('../views/FindIdResultPage.vue')
        },
        {
            path: '/resetPassword',
            component: () => import('../views/ResetPwdPage.vue')
        },
        {
            path: '/resetPasswordFinal/:email',
            component: () => import('../views/ResetPwdFinalPage.vue')
        },
        {
            path: '/mypage/:id',
            component: () => import('@/components/MyPage/MyPage.vue')
        },
        {
            path: '/addstudylog/:id',
            component: () => import('@/components/StudyLog/AddStudyLog.vue')
        },
        {
            path: '/anotherpage/:id',
            component: () => import('@/components/MyPage/AnotherPage.vue')
        },
        {
            path: '/studylog/:id',
            component: () => import('@/components/StudyLog/StudyLogPage.vue')
        }
    ]
})

export default router;