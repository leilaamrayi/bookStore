<template>    
      <div class="title-container">
        <div class="title-section">
          <h1 class="title">Book Store</h1>
        </div>
        <div class="user-info">
          <p>Browsing as user {{ username }}</p>
          <button class="sign-out-button" @click="signOut">Sign Out</button>
        </div>
      </div>    
  </template>
  
  <script lang="ts">
 
  export default {
    data(): { username: string } {
      return {
        username: localStorage.getItem('user') || 'No user found',
      };
    },
    methods: {
      signOut(): void {
        this.$router.push('/login');
      console.log('Signing out...');
      },
    },
  };
  </script>
  
  <style scoped>
  .title-container{
    background-color: rgb(204, 204, 204);
  }
  .title-section {
    text-align: center;
    flex-direction: column;
    align-items: flex-end;
   
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-right: 15px;
  
  }
  
  .sign-out-button {
    margin-top: 10px;
    width: auto;
    font-size: small;
  }

  </style>
  

