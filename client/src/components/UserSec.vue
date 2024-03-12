<template>
    <div class="w-[80%] h-[500px] bg-orange-100 mx-auto mt-[30px] relative">
        <div class="h-[40%] w-full flex items-center justify-center">
            <img :src= "`http://localhost:3000/${singleUser.profilePictureUrl}`" alt="image" class="w-[150px] rounded-lg">
        </div>
        <div class="flex flex-col gap-5 items-center h-[40%] w-full">
          <span class="text-xl">ID : {{ singleUser.id }}</span>
          <div class="flex h-[30px] w-[90%] gap-[10px] justify-around text-[16px] font-mono font-bold">
          <h1>FirstName : {{ singleUser.firstName }}</h1>
          <h1>SecondName : {{ singleUser.lastName }}</h1>
          </div>
          <h3 class="text-[16px] font-mono font-bold">Email ID : {{ singleUser.email }}</h3>
          <span class="text-[16px] font-mono font-bold">Role : {{ singleUser.role }}</span>
      </div>
        <div class="h-[20%] w-full flex  justify-center">
            <button class="w-[100px] h-[40px] bg-green-800 rounded-[6px]" @click="ModalOpen">Edit</button>
        </div>
        <div v-if="modalPopup" class="w-[500px] h-[400px] bg-slate-500 absolute top-[10%] left-[20%] rounded-[8px]">
            <form class="w-[90%] h-[88%] flex flex-col items-center justify-center gap-6" @submit.prevent="fullEdit">
                <div class="flex flex-col gap-2">
                    <label >FirstName</label>
                    <input type="text" class="w-[250px] h-[35px] rounded-sm" v-model="formData.firstName">
                </div>
                <div  class="flex flex-col gap-2">
                    <label >LastName</label>
                    <input type="text" class="w-[250px] h-[35px] rounded-sm" v-model="formData.lastName">
                </div>
                <div class="flex flex-col gap-2 ml-12">
                    <label >Image : </label>
                    <input type="file" @change="userImage($event)" >
                </div>
                <div>
                    <button type="submit" class="w-[150px] h-[40px] rounded-[7px] bg-green-700 font-bold" >Save Changes</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import {ref, onMounted} from "vue"
const singleUser = ref({})
const modalPopup = ref(false)
const imagePath = ref("")

const ModalOpen = () =>{
    modalPopup.value = !modalPopup.value
    resetFormData();
}
const fullEdit = async() =>{
  await userEdit();
  await userFetch()
  modalPopup.value = !modalPopup.value
}
const resetFormData = () => {
    formData.value.firstName = singleUser.value.firstName || '';
    formData.value.lastName = singleUser.value.lastName || '';
};


const formData = ref({
    firstName:"",
    lastName:""
})
const userFetch = async() => {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
        console.error("No user data found. Please login.");
        return;
    }
    const userData = JSON.parse(userDataString);
    const { accessToken } = userData;
    const axiosInstance = axios.create({
        baseURL: "http://localhost:3000/api",
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    try {
        const response = await axiosInstance.get("/users/me");
        console.log(response)
         singleUser.value = response.data.data.user
         resetFormData();
    } catch (error) {
        console.error(error)
}
}
const userEdit = async() => {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
        console.error("No user data found. Please login.");
        return;
    }
    const userData = JSON.parse(userDataString);
    const { accessToken } = userData;
    try {
        const requestData = {
            firstName: formData.value.firstName,
            lastName: formData.value.lastName,
        };
        if (imagePath.value) {
            requestData.profilePictureUrl = imagePath.value;
        }

        await axios.patch("http://localhost:3000/api/users/me", requestData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }catch (error) {
  console.error("Error updating user:", error.response ? error.response.data : error);
}
}
const userImage = async(event) => {
  const file = event.target.files[0];
  if (!file) {
      console.error("No file selected.");
      return;
  }
  const userDataString = localStorage.getItem('userData');
  if (!userDataString) {
      console.error("No user data found. Please login.");
      return;
  }
  const userData = JSON.parse(userDataString);
  const { accessToken } = userData;
  try {
    const formImage = new FormData();
    formImage.append("file", file);
    const response = await axios.post("http://localhost:3000/api/users/me/profile-picture", formImage, {
        headers: {
            'Authorization': `Bearer ${accessToken}`, 
            'Content-Type': 'multipart/form-data', 
        }
    })
    imagePath.value = response.data.data.file.path
    singleUser.value.profilePictureUrl = imagePath.value;
  } catch(error) {
      console.error("Error:", error.response ? error.response.data : error);
  }
};
onMounted(()=>{
  userFetch()
})
</script>

<style lang="scss" scoped>

</style>