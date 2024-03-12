<template>
    <div class="bg-[#007bff] w-full min-h-[calc(100vh-60px)] flex items-center justify-center">
         <div class="bg-white h-[95%]  w-[98%] rounded-[6px] mm:h-[98%] tablet:h-[580px] tablet:w-[580px] monitor:w-[100px] monitor:h-[700px]">
                <div class="w-full h-[14%] flex items-center justify-center">
                    <h1 class="text-xl">Create Account</h1>
                </div>
                <hr>
                <div class="mt-6 w-full h-[70%]">
                    <form class="w-[88%] flex flex-col gap-1 mm:gap-4 mx-auto" @submit.prevent="submitForm">
                        <div class="flex flex-col gap-1 tablet:gap-2 tablet:flex-row">
                            <div>
                              <label>FirstName</label>
                              <input type="text" v-model="firstName" v-bind="firstNameAttrs" name="firstname" placeholder="Enter first name" class="w-full h-[30px]  pl-4 rounded-[5px] border-[1px] border-solid border-gray-300  focus:ring-[1px] focus:ring-blue-200 focus:outline-none focus:shadow-sm tablet:h-[50px] ">
                              <span class="text-red-500 text-sm md:text-md">{{ errors.firstName }}</span>
                            </div>
                            <div>
                              <label>LastName</label>
                              <input type="text" v-model="lastName" v-bind="lastNameAttrs" name="lastname" placeholder="Enter last name" class="w-full h-[30px] tablet:h-[50px] pl-4 rounded-[5px] border-[1px] border-solid border-gray-300  focus:ring-[1px] focus:ring-blue-200 focus:outline-none focus:shadow-sm">
                              <span class="text-red-500 text-sm md:text-md">{{ errors.lastName }}</span>
                            </div>
                        </div>
                        <div class="flex flex-col">
                           <label>Email</label>
                           <input type="email" v-model="email" v-bind="emailAttrs" name="email" placeholder="Enter email address"  class="w-full h-[30px] tablet:h-[50px] pl-4 rounded-[5px] border-[1px] border-solid border-gray-300  focus:ring-[1px] focus:ring-blue-200 focus:outline-none focus:shadow-sm">
                           <span class="text-red-500 text-sm md:text-md">{{ errors.email }}</span>
                        </div>
                        <div class="flex flex-col">
                         <label>Role</label>
                        <select v-model="role" name="role" class="w-full h-[30px] tablet:h-[50px] pl-4 rounded-[5px] border-[1px] border-solid border-gray-300 focus:ring-[1px] focus:ring-blue-200 focus:outline-none focus:shadow-sm">
                       <option disabled value="">Please select one</option>
                        <option value="agent">Agent</option>
                       <option value="supervisor">Supervisor</option>
                       <option value="qa">QA</option>
                       <option value="qc">QC</option>
                      </select>
                      <span class="text-red-500 text-sm md:text-md">{{ errors.role }}</span>
                             </div>
                        <div class="flex flex-col gap-2 tablet:flex-row">
                            <div class="flex flex-col">
                                <label>Password</label>
                                <input type="password" v-model="password" v-bind="passwordAttrs" name="password" placeholder="Enter password" class="w-full h-[30px] tablet:h-[50px] pl-4 rounded-[5px] border-[1px] border-solid border-gray-300  focus:ring-[1px] focus:ring-blue-200 focus:outline-none focus:shadow-sm">
                                <span class="text-red-500 text-sm md:text-md">{{ errors.password }}</span>
                            </div>
                            <div>
                                <label>Confirm Password</label>
                                <input type="password" v-bind=" confirmpassAttrs" v-model="confirmpassword" name="confirmpassword" placeholder="Confirm Password" class="w-full h-[30px] tablet:h-[50px] pl-4 rounded-[5px] border-[1px] border-solid border-gray-300  focus:ring-[1px] focus:ring-blue-200 focus:outline-none focus:shadow-sm">
                                <span class="text-red-500 text-sm md:text-md">{{ errors.confirmpassword }}</span>
                            </div>
                        </div>
                        <div>
                            <button class="w-full h-[40px] rounded-[5px] bg-blue-500 text-white">create account</button>
                        </div>
                    </form>
                </div>
                <hr>
         </div>
    </div>
</template>

<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup';
import axios from 'axios';
function resetFormFields() {
    resetForm({
        values: {
            firstName: '',
            lastName: '',
            email: '',
            role: '', 
            password: '',
            confirmpassword: '',
        },
    });
}
const schema = toTypedSchema(yup.object({
    firstName: yup.string()
      .matches(/^[a-zA-Z ]+$/, "Firstname can only contain letters and spaces")
      .required("Firstname is required")
      .min(3, 'At least 3 characters')
      .max(15, 'At most 15 characters'),
    lastName: yup.string()
      .matches(/^[a-zA-Z ]+$/, "Lastname can only contain letters and spaces")
      .required("Lastname is required")
      .min(3, 'At least 3 characters')
      .max(15, 'At most 15 characters'),
    email: yup.string()
      .email("Email must be a valid email")
      .required("Email is required")
      .transform(value => value.toLowerCase()), 
    role: yup.string()
        .required("Role is required")
        .oneOf(['agent', 'supervisor', 'qc', 'qa'], '"role" must be one of [agent, supervisor, qc, qa]'),
    password: yup.string()
      .min(8, 'Minimum 8 characters')
      .max(30, 'Maximum 30 characters')
      .matches(/^[a-zA-Z0-9]{8,30}$/, "Password must be 8-30 characters and alphanumeric")
      .required("Password is required"),
    confirmpassword: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
}));
const { errors, defineField, handleSubmit, resetForm } = useForm({
    validationSchema:schema
})
const submitForm =  handleSubmit(async(values) => {
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
    console.log(values)
    const { firstName, lastName, role, email, password } = values;
  try {
    const result = await axiosInstance.post("/admin/users",{
  "firstName": firstName,
  "lastName": lastName,
  "email": email,
  "role": role,
  "password": password
});
  
  if(result){
    resetFormFields()
  }
  
  
  } catch (error) {
    console.error("Form submission error:", error.response ? error.response.data : error.message);

  }
});
const [firstName, firstNameAttrs] = defineField('firstName', {
  validateOnModelUpdate: true
    
})
const [lastName, lastNameAttrs] = defineField('lastName', {
  validateOnModelUpdate: true
    
})
const [role, roleAttrs] = defineField('role', {
  validateOnModelUpdate: true
    
})
const [email, emailAttrs] = defineField('email', {
  validateOnModelUpdate: true
    
})
const [password, passwordAttrs] = defineField('password', {
  validateOnModelUpdate: true
    
})

const [confirmpassword, confirmpassAttrs] = defineField('confirmpassword', {
  validateOnModelUpdate: true
    
})
</script>
