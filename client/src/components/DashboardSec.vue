<template>
    <div class="flex justify-center items-center h-full relative">
      <table class="border border-collapse border-gray-400 w-11/12 lg:w-4/5 mt-4">
        <thead class="bg-gray-200">
          <tr>
            <th class="border border-gray-300 p-2 text-center">ID</th>
            <th class="border border-gray-300 p-2 text-center">FirstName</th>
            <th class="border border-gray-300 p-2 text-center">LastName</th>
            <th class="border border-gray-300 p-2 text-center">Email</th>
            <th class="border border-gray-300 p-2 text-center">Role</th>
            <th class="border border-gray-300 p-2 text-center">Edit</th>
            <th class="border border-gray-300 p-2 text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-100">
            <td class="border border-gray-300 p-2 text-center">{{ user.id }}</td>
            <td class="border border-gray-300 p-2 text-center">{{ user.firstName }}</td>
            <td class="border border-gray-300 p-2 text-center">{{ user.lastName }}</td>
            <td class="border border-gray-300 p-2 text-center">{{ user.email }}</td>
            <td class="border border-gray-300 p-2 text-center">{{ user.role }}</td>
            <td class="border border-gray-300 p-2 text-center">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" @click="editUser(user.id)"><i class="fa-solid fa-pen-to-square"></i></button>
            </td>
            <td class="border border-gray-300 p-2 text-center">
              <button @click="deleteUser(user.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="modalSec" class="absolute top-[20px] left-[200px] w-[98%] h-[70%]">
        <div class="bg-gray-700 h-[95%]  w-[98%] rounded-[6px] mm:h-[98%] tablet:h-[580px] tablet:w-[580px] monitor:w-[100px] monitor:h-[700px]">
                <div class="w-full h-[14%] flex items-center justify-center">
                    <h1 class="text-xl">Update Account</h1>
                </div>
                <hr>
                <div class="mt-6 w-full h-[70%]">
                    <form class="w-[88%] flex flex-col gap-1 mm:gap-4 mx-auto" >
                        <div class="flex flex-col gap-1 tablet:gap-2 tablet:flex-row">
                            <div>
                              <label>FirstName</label>
                              <input type="text" v-model="formData.firstName" name="firstname" placeholder="Enter first name" class="w-full h-[30px]  pl-4 rounded-[5px] border-[1px] border-solid border-gray-300  focus:ring-[1px] focus:ring-blue-200 focus:outline-none focus:shadow-sm tablet:h-[50px] ">
                            </div>
                            <div>
                                <label>LastName</label>
                              <input type="text" v-model="formData.lastName" name="lastname" placeholder="Enter last name" class="w-full h-[30px] tablet:h-[50px] pl-4 rounded-[5px] border-[1px] border-solid border-gray-300  focus:ring-[1px] focus:ring-blue-200 focus:outline-none focus:shadow-sm">
                           
                            </div>
                        </div>
                        <div class="flex flex-col">
                           <label>Email</label>
                           <input type="email" v-model="formData.email" name="email" placeholder="Enter email address"  class="w-full h-[30px] tablet:h-[50px] pl-4 rounded-[5px] border-[1px] border-solid border-gray-300  focus:ring-[1px] focus:ring-blue-200 focus:outline-none focus:shadow-sm">
                          
                        </div>
                        <div class="flex flex-col">
                         <label>Role</label>
                        <select name="role" v-model="formData.role" class="w-full h-[30px] tablet:h-[50px] pl-4 rounded-[5px] border-[1px] border-solid border-gray-300 focus:ring-[1px] focus:ring-blue-200 focus:outline-none focus:shadow-sm">
                        <option value="agent" >Agent</option>
                       <option value="supervisor" >Supervisor</option>
                       <option value="qa" >QA</option>
                       <option value="qc" >QC</option>
                      </select>
                    </div>
                            <div class="flex flex-col">
                                <label>Password</label>
                                <input type="password" v-model="formData.password"  name="password" placeholder="Enter password" class="w-full h-[30px] tablet:h-[50px] pl-4 rounded-[5px] border-[1px] border-solid border-gray-300  focus:ring-[1px] focus:ring-blue-200 focus:outline-none focus:shadow-sm">
                            </div>
                        <div class="flex gap-10">
                            <button class="w-full h-[40px] rounded-[5px] bg-blue-500 text-white" @click="AdminEditUser(SingleOne.id)">Edit account</button>
                            <button class="w-full h-[40px] rounded-[5px] bg-blue-500 text-white" @click="modalOpen">Back</button>
                        </div>
                    </form>
                </div>
                </div>
      </div>
    </div>
  </template>

<script setup>
import axios from "axios";
import { onMounted, ref, nextTick } from 'vue';
const users = ref([])
const modalSec = ref(false)
const SingleOne = ref({})
const formData = ref({
  firstName : "",
  lastName : "",
  email:"",
  role:"",
  password:""
})
const resetFormData = () => {
  formData.value = {
    firstName: "",
    lastName: "",
    email: "",
    role: ""
  };
};

const modalOpen =()=>{
  modalSec.value = !modalSec.value
  
}
const editUser = async(userId) => {
  await singleFetch(userId);
  resetFormData();
  onFetch();
  modalSec.value = true;
  formData.value.firstName = SingleOne.value.firstName || "";
  formData.value.lastName = SingleOne.value.lastName || "";
  formData.value.email = SingleOne.value.email || "";
  formData.value.role = SingleOne.value.role || "";

};
const deleteUser = async(userId) => {
  await handleDelete(userId);
  await onFetch()
};
const AdminEditUser = async(userId) => {
  await adminEdit(userId);
  // await onFetch();
  // await nextTick()
}
const onFetch = async() => {
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
        const response = await axiosInstance.get("/admin/users");
        users.value = response.data.data.users;
    } catch (error) {
        console.error(error)
}
}
const handleDelete = async (userId) => {
  const userDataString = localStorage.getItem('userData');
  if (!userDataString) {
    console.error("No user data found. Please log in again.");
    return;
  }
  const userData = JSON.parse(userDataString);
  const { accessToken } = userData;

  try {
    const response = await axios.delete(`http://localhost:3000/api/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("User deleted successfully:", response.data);
    users.value = users.value.filter(user => user.id !== userId);
  } catch (error) {
    console.error("Error deleting user:", error.response);
  }
};
const singleFetch = async(userId) => {
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
        const response = await axiosInstance.get(`/admin/users/${userId}`);
        SingleOne.value = response.data.data.user;
        console.log(SingleOne.value)
        console.log(response.data);
    } catch (error) {
        console.error(error)
}
}
const adminEdit = async(userId) => {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
        console.error("No user data found. Please login.");
        return;
    }
    const userData = JSON.parse(userDataString);
    const { accessToken } = userData;
    
    try {
         await axios.patch(`http://localhost:3000/api/admin/users/${userId}`, {
            "firstName": formData.value.firstName,
            "lastName": formData.value.lastName,
            "email": formData.value.email,
            "role": formData.value.role,
            "password": formData.value.password,
           
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        modalPopup.value = false;
    }catch (error) {
  console.error("Error updating user:", error.response ? error.response.data : error);
}
}
onMounted(() => {
     onFetch();
});
</script>