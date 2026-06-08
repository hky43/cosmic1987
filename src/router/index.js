import { createRouter, createWebHashHistory } from 'vue-router' 
import HomePage from '../views/Home/HomePage.vue' 
import LightMonologue from '../components/views/home/LightMonologue.vue' 
import UserProgressPage from '../views/UserProgressPage.vue'

const routes = [ 
  { 
    path: '/', 
    name: 'home', 
    component: HomePage, 
    meta: { requiresMainLayout: true }
  }, 
  { 
    path: '/user-progress', 
    name: 'UserProgressPage', 
    component: UserProgressPage, 
    meta: { requiresMainLayout: false } 
  }, 
  { 
    path: '/home', 
    name: 'homePage', 
    component: HomePage 
  }, 
  { 
    path: '/light-monologue', 
    name: 'lightMonologue', 
    component: LightMonologue 
  }, 
  
  { 
    path: '/travel-1', 
    name: 'travel1', 
    component: () => import('../views/Travel/index.vue') 
  }, 
  { 
    path: '/about-2-main', 
    name: 'about2Main', 
    component: () => import('../views/About/index.vue') 
  }, 
  { 
    path: '/cosmic-wave-3', 
    name: 'cosmicWave3', 
    component: () => import('../views/CosmicArchive/index.vue') 
  }, 
  { 
    path: '/future-4', 
    name: 'future4', 
    component: () => import('../views/Future/index.vue') 
  }, 
  
  { 
    path: '/about/01', 
    name: 'About01', 
    component: () => import('../views/About/chapters/About01.vue'), 
  }, 
  { 
    path: '/about/02', 
    name: 'About02', 
    component: () => import('../views/About/chapters/About02.vue'), 
  }, 
  { 
    path: '/about/03', 
    name: 'About03', 
    component: () => import('../views/About/chapters/About03.vue'), 
  }, 
  { 
    path: '/about/04', 
    name: 'About04', 
    component: () => import('../views/About/chapters/About04.vue'), 
  }, 
  { 
    path: '/about/05', 
    name: 'About05', 
    component: () => import('../views/About/chapters/About05.vue'), 
  }, 
  { 
    path: '/about/06', 
    name: 'About06', 
    component: () => import('../views/About/chapters/About06.vue'), 
  }, 
  { 
    path: '/about/07', 
    name: 'About07', 
    component: () => import('../views/About/chapters/About07.vue'), 
  }, 
  { 
    path: '/travel/01', 
    name: 'Travel01', 
    component: () => import('../views/Travel/chapters/Travel01.vue'), 
  }, 
  { 
    path: '/travel/02', 
    name: 'Travel02', 
    component: () => import('../views/Travel/chapters/Travel02.vue'), 
  }, 
  { 
    path: '/travel/03', 
    name: 'Travel03', 
    component: () => import('../views/Travel/chapters/Travel03.vue'), 
  }, 
  { 
    path: '/travel/04', 
    name: 'Travel04', 
    component: () => import('../views/Travel/chapters/Travel04.vue'), 
  }, 
  { 
    path: '/travel/05', 
    name: 'Travel05', 
    component: () => import('../views/Travel/chapters/Travel05.vue'), 
  }, 
  { 
    path: '/test', 
    name: 'test', 
    component: () => import('../views/Test/index.vue') 
  }, 
  { 
    path: '/test1', 
    name: 'test1', 
    component: () => import('../views/Test/Test01.vue'), 
  }, 
  {
    path: '/test2',
    name: 'test2',
    component: () => import('../views/Test/Test02.vue'),
  },

  // ✅ 通配符路由放在最后，处理404页面
  // 注意：不要重定向到根路径，否则会拦截静态文件
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
] 

const router = createRouter({
  // 【修改】hash 模式，GitHub Pages 无需额外配置
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from) => {
  if (!from || !from.path) return

  const aboutChapterPattern = /^\/about\/\d/
  const travelChapterPattern = /^\/travel\/\d/

  const isFromAboutChapter = aboutChapterPattern.test(from.path)
  const isFromTravelChapter = travelChapterPattern.test(from.path)

  if (isFromAboutChapter && to.path === '/about-2-main' && to.query.skipPagePreload !== 'true') {
    return { path: '/about-2-main', query: { skipPagePreload: 'true' } }
  }

  if (isFromTravelChapter && to.path === '/travel-1' && to.query.skipPagePreload !== 'true') {
    return { path: '/travel-1', query: { skipPagePreload: 'true' } }
  }
})

export default router