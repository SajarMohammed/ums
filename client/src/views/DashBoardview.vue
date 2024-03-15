<template>
    <div>
      <nav class="w-full h-[60px] bg-gray-600 flex items-center justify-between relative">
        <div class="w-[30%] flex items-center justify-around">
            <h1 class="text-white">UMS</h1>
            <div class="text-white">
              <button @click="toggleOpen"><i class="fa-solid fa-bars "></i></button>
            </div>
        </div>
        <div class="flex items-center mr-[100px] text-white">
           <button @click="toggleLogout"> 
            <i class="fa-solid fa-user"></i>
            <i class="fa-solid fa-caret-down"></i>
          </button>
        </div>
      <div v-if="logOut" class=" absolute bg-slate-800 z-50 w-[150px] h-[50px] top-[60px] right-[60px] flex items-center justify-center">
        <router-link to="/" class="text-white font-mono">Logout</router-link>
       </div>
      </nav>
      <div class="flex flex-row min-h-[calc(100vh-60px)]">
        <aside :class="`bg-gray-400 transition-all text-lg text-white delay-300 duration-700 ease-in-out ${open ? 'w-[220px]' : 'w-[0px]'}`">
    <div v-if="role == 'admin'" :class="`w-full h-full flex flex-col items-center mt-[60px] gap-8 ${open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'} transition-all delay-300 duration-600 ease-in-out`">
      <button @click="setActiveComponent('dashboard')" class="flex items-center gap-12"><i class="fa-solid fa-table-columns"></i><span>Dashboard</span></button>
      <button @click="setActiveComponent('addUser')" class="flex items-center gap-6"><i class="fa-solid fa-user"></i> <span> Add New User</span></button>
      <button @click="setActiveComponent('profile')" class="flex items-center gap-[80px]"><i class="fa-solid fa-address-card"></i> <span>Profile</span></button>
    </div>
    <div v-if="role == 'supervisor'" :class="`w-full h-full flex flex-col items-center mt-[60px] gap-8 ${open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'} transition-all delay-300 duration-600 ease-in-out`">
      <button @click="setActiveComponent('dashboard')" class="flex items-center gap-12"><i class="fa-solid fa-table-columns"></i> <span>Dashboard</span> </button>
      <button @click="setActiveComponent('profile')" class="flex items-center gap-[80px]"><i class="fa-solid fa-address-card"></i>  <span>Profile</span></button>
    </div>
    <div v-if="role == 'agent'" :class="`w-full h-full flex flex-col items-center mt-[60px] gap-8 ${open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'} transition-all delay-300 duration-600 ease-in-out`">
      <button @click="setActiveComponent('dashboard')" class="flex items-center gap-[80px]"><i class="fa-solid fa-address-card"></i> <span>Profile</span></button>
    </div>
  </aside>
      <div class="flex-1">
      <component :is="activeComponent"></component>
      </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DashboardSec from "@/components/DashboardSec.vue"
import UserSec from "@/components/UserSec.vue"
import SuperVisor from "@/components/Supervisor.vue"
import AdminUser from "@/components/AdminUser.vue"

const roleMapping={
   admin:{
    dashboard: DashboardSec,
    addUser : AdminUser,
    profile : UserSec
   },
   supervisor:{
    dashboard: SuperVisor,
    profile: UserSec
   },
   agent:{
    dashboard:UserSec
   },qa:{
    dashboard:UserSec
   },qc:{
    dashboard:UserSec
   },
}

const open = ref(true);
const logOut = ref(false);
const role = ref(null);
const activeComponent = ref(null)
function setActiveComponent(componentKey) {
  activeComponent.value = roleMapping[role.value][componentKey];
  console.log(activeComponent)
}

const toggleOpen = () =>{
    open.value = !open.value
}
const toggleLogout = () =>{
    logOut.value = !logOut.value
}
onMounted(()=>{
   const userDataString = localStorage.getItem('userData');
if (userDataString) {
  const userData = JSON.parse(userDataString);
  role.value = userData.role;
  activeComponent.value = roleMapping[role.value].dashboard;
  const { accessToken, refreshToken } = userData;
  console.log(role.value, accessToken, refreshToken);
} else {
  console.log('No user data found in localStorage');
} 
})


</script>
