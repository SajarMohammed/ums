<template>
    <div class="bg-[#007bff] w-full h-screen flex items-center justify-center">
       <div class="w-[98%] h-[70%] tablet:w-[450px] tablet:h-[500px] bg-white rounded-[6px] relative">
       <div class="flex items-center justify-center w-full h-[18%]">
        <h1 class="text-2xl font-sans">Login</h1>
       </div>
          <hr>
          <div class="mt-6 w-full h-[65%] ">
            <form class="flex flex-col gap-6 mx-auto w-[85%]" @submit.prevent="formSubmit">
               <div class="flex flex-col ">
                  <label>Email</label>
                  <input required
                   type="email" v-model="email" placeholder="Enter email address" class="w-full h-[30px] tablet:h-[50px] pl-4 rounded-[5px] border-[1px] border-solid border-gray-300  focus:ring-[1px] focus:ring-blue-200 focus:outline-none focus:shadow-sm">
               </div>
               <div>
                  <label>Password</label>
                  <input type="password" v-model="password" placeholder="Enter password" class="w-full h-[30px] tablet:h-[50px] pl-4 rounded-[5px] border-[1px] border-solid border-gray-300 focus:ring-[1px] focus:ring-blue-200 focus:outline-none focus:shadow-sm">
                  <span class="text-red-500 pt-4 text-center">{{ error }}</span>
               </div>
               <div class="flex gap-3">
                  <input type="checkbox" placeholder="username">
                  <label>Remember Password</label>
               </div>
               <div class="flex items-center justify-between ">
                  <li class="list-none text-[14px] text-blue-800 hover:underline" @click="forgotModal">Forgot password?</li>
                  <button class="bg-blue-600 w-[70px] h-[40px] text-white rounded-[6px]">Login</button>
                 
               </div>
            </form>
          </div>
          <hr>
          <div class="flex items-center justify-center w-full h-[10%]">
            <span class="text-[14px] text-blue-800 hover:underline"><router-link to="/register">Need an account? Sign up!</router-link></span>
          </div> 
          <div v-if="modalOpen" class="w-[400px] h-[200px] rounded-lg bg-yellow-950 absolute top-[200px] left-[30px] flex flex-col items-center justify-center gap-5">
            <label class="text-white"> Enter Email Address</label>
            <input type="email" class="w-[90%] h-[40px] rounded-lg focus:outline-none">
            <button class="bg-green-400 w-[150px] h-[40px] rounded-lg" @click="forgotModal">Send OTP</button>
          </div>
       </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { ref } from 'vue';
import { useRouter } from "vue-router";

const email = ref('');
const password = ref('');
const router = useRouter()
const error = ref('')
const modalOpen = ref(false)
const forgotModal = ()=>{
   modalOpen.value = !modalOpen.value
}
const formSubmit = async() => {
   try{
  const response = await axios.post("http://localhost:3000/api/auth/login", {
    email: email.value,
    password: password.value,
  });
  console.log(response)
  const accessToken = response.data.data.user.accessToken;
  const refreshToken = response.data.data.user.refreshToken; 
  const role = response.data.data.user.role;
  if( response.status == 401){
      error.value == "invalid email or password"
  }
  if (role){
   router.push("/dashboard")
  const userData = {
      role,
      accessToken,
      refreshToken,
    };

    localStorage.setItem('userData', JSON.stringify(userData));
 }
}catch(err){
   if(err.response && err.response.status === 401){
      error.value = "invalid email or password"
   }
 }
};
</script>