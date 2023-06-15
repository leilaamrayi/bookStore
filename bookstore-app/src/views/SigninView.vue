/*
The code aims to create a login page where users can enter their credentials to sign in, 
and provides functionality to handle the login process, including sending the login request to the server,
validating the response, and navigating the user to different views based on the login status.*/

<template>
  <div class="login-page">
    <div class="login-container">
      <h2 class="login-title">Login</h2>

      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="authDetails.username" placeholder="Enter your username" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="authDetails.password" placeholder="Enter your password" />
      </div>

      <div class="signup-link">
        <p>No account? Sign up <router-link to="/auth/register">here</router-link></p>
      </div>
      <button class="login-button" type="submit" @click="signIn">Sign In</button>
      <button class="proceed-as" @click="proceedAsGuest">Proceed as guest</button>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const API_URL = 'http://localhost:3000';

export default {
  name: 'LoginPage',
  setup() {
    const authDetails = ref({
      username: '',
      password: '',
      role: '',
    });

    const router = useRouter();

    const signIn = async () => {
      try {
        const { username, password, role } = authDetails.value;

        if (!username || !password) {
          throw new Error('Username and password are required');
        }

        const response = await axios.post(`${API_URL}/auth/login`, { username, password });

        if (response.data && response.data.accessToken) {
          // Login successful
          const accessToken = response.data.accessToken;
          alert('Successfully signed in');

          // Clear form fields
          authDetails.value.username = '';
          authDetails.value.password = '';

          // Navigate to UserView
          router.push('/library/books');
        } else {
          throw new Error('Invalid login response');
        }
      } catch (error:any) {
        if (error.response && error.response.status === 403) {
          alert(error.response.data.error);
        } else {
          alert('Login failed');
        }

      }
    };

    const proceedAsGuest = () => {
      // Clear form fields
      authDetails.value.username = '';
      authDetails.value.password = '';

      // Navigate to GuestView
      router.push('/library');
    };

    return {
      authDetails,
      signIn,
      proceedAsGuest,
      router
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
  width: 100%;
  padding: 10px;
  background-color: #dbdee0;
  color: #0a0a0a;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
  /*The code sets up a login page component where users can enter their username and password to sign in.
  The authDetails variable holds the username, password, and role entered by the user as a reactive reference.
  The router instance is accessed using the useRouter function provided by Vue Router.
  The signIn function is called when the "Sign In" button is clicked. It sends a login request to the server with the provided username and password. If the login is successful, an access token is obtained and the user is redirected to the UserView.
  The proceedAsGuest function is called when the "Proceed as guest" button is clicked. It clears the form fields and navigates the user to the GuestView.
  The template uses the router-link component to create a link to the registration page where users can sign up for a new account.*/