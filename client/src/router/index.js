import { createRouter, createWebHistory} from "vue-router"
import Login from "@/views/Loginview.vue"

const routes = [{
    path:"/", name: 'login', component: Login 
},{
    path:"/register", name: 'Register', component:()=> import("@/views/Registerview.vue")
},{
    path:"/notfound", name: 'NotFound', component:()=> import("@/views/NotFoundview.vue")
},{
    path:"/dashboard", name: 'Dashboard', component:()=> import("@/views/DashBoardview.vue")
},
]

const router  = createRouter({
    history:createWebHistory(),
    routes
})

export default router;