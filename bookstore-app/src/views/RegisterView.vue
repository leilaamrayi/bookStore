
/*The code implements a registration page where users can enter their username and password to create a new account. 
It sends a registration request to the server and displays success or error alerts accordingly.*/


<template>
  <div class="login-page">
    <div class="login-container">
      <h2 class="login-title">Register</h2>
      
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="authDetails.username" placeholder="Enter your username" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="authDetails.password" placeholder="Enter your password" />
      </div>
      
      <div class="signup-link">
        <p>Already have an account? Sign in <router-link to="/auth/login">here</router-link></p>
      </div>
      
      <button class="login-button" type="submit" @click="registerAccount">Register new account</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';

const API_URL = 'http://localhost:3000';

export default {
  name: 'RegisterPage',
  setup() {
    const authDetails = ref({
      username: '',
      password: '',
      role:'',
    });

    const registerAccount = async () => {
      try {
        const { username, password, role } = authDetails.value;

        if (!username || !password) {
          throw new Error('Username and password are required');
        }

        await axios.post(`${API_URL}/auth/register`, { username, password });
   
        // Registration successful
        alert('Account successfully created');
        
        // Clear form fields
        authDetails.value.username = '';
        authDetails.value.password = '';
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert(error.response.data.error);
        } else {
          alert('Registration failed');
        }
      }
    };

    return {
      authDetails,
      registerAccount,
    };
  },
};
</script>


  <style>
  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f2f2f2;
  }
  
  .login-container {
    width: 400px;
    padding: 40px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .login-title {
    margin-bottom: 20px;
    text-align: center;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .signup-link {
    margin-bottom: 20px;
    text-align: center;
  }
  
  .signup-link a {
    color: #007bff;
    text-decoration: none;
  }
  
  .login-button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .proceed-as {
    text-align: center;
    color: #888;
  }
  </style>
  