<template>
    <div class="flex justify-center items-center h-full">
      <table class="border border-collapse border-gray-400 w-11/12 lg:w-4/5 mt-4">
        <thead class="bg-gray-200">
          <tr>
            <th class="border border-gray-300 p-2 text-center">ID</th>
            <th class="border border-gray-300 p-2 text-center">FirstName</th>
            <th class="border border-gray-300 p-2 text-center">LastName</th>
            <th class="border border-gray-300 p-2 text-center">Email</th>
            <th class="border border-gray-300 p-2 text-center">Role</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in userDatas" :key="user.id" class="hover:bg-gray-100">
            <td class="border border-gray-300 p-2 text-center">{{ user.id }}</td>
            <td class="border border-gray-300 p-2 text-center">{{ user.firstName }}</td>
            <td class="border border-gray-300 p-2 text-center">{{ user.lastName }}</td>
            <td class="border border-gray-300 p-2 text-center">{{ user.email }}</td>
            <td class="border border-gray-300 p-2 text-center">{{ user.role }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

<script setup>
import axios from "axios"
import { ref, onMounted } from "vue"
const userDatas = ref([])
const userValues = async() => {
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
        const response = await axiosInstance.get("/supervisor/users");
        userDatas.value = response.data.data.users;
        console.log(response.data);
    } catch (error) {
        console.error(error)
}
}
onMounted(()=>{
    userValues()
})
</script>
