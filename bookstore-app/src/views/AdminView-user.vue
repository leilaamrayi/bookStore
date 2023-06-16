<template>
    <div class="book-store">
      <div class="title-container">
        <div class="title-section">
          <h1 class="title">Book Store</h1>
        </div>
        <div class="user-info">
          <p>Browsing as user {{ username }}</p>
          <button class="sign-out-button" @click="signOut">Sign Out</button>
        </div>
      </div>
      <div class="search-container">
        <input type="text" v-model="searchTerm" placeholder="Search by username" />
      </div>
      <table class="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Purchases</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in filteredUsers" :key="index">
            <td>{{ user.username }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.purchases }}</td>
            <td>
              <div class="order-container">
                <div class="order-controls">
                  <button class="action-button">Promote</button>
                  <button class="action-button">Delete</button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script lang="ts">
  import axios from 'axios';
  import { ref, computed, onMounted } from 'vue';
  
  const API_URL = 'http://localhost:3000';
  
  interface User {
    username: string;
    role: string;
    purchases: number;
  }
  
  export default {
    data() {
      return {
        username: '',
        searchTerm: '',
        users: [] as User[],
      };
    },
    computed: {
      filteredUsers(): User[] {
        if (this.searchTerm.trim() === '') {
          return this.users;
        }
        const search = this.searchTerm.toLowerCase();
        return this.users.filter((user) => {
          return user.username.toLowerCase().includes(search);
        });
      },
    },
    methods: {
      getAvailabilityText(quantity: number): string {
        return quantity > 0 ? `${quantity} left` : 'Out of stock';
      },
      updateOrder(index: number, action: string): void {
        // Update order logic
      },
      orderBook(index: number): void {
        // Order book logic
      },
      fetchUsers(): void {
        axios
          .get(`${API_URL}/library/users`)
          .then((response) => {
            this.users = response.data.users;
          })
          .catch((error) => {
            console.log('Error fetching users:', error);
          });
      },
      searchUser(): void {
        axios
          .get(`${API_URL}/library/users/search?q=${this.searchTerm}`)
          .then((response) => {
            this.users = response.data.users;
          })
          .catch((error) => {
            console.log('Error searching user:', error);
          });
      },
      signOut(): void {
        console.log('Signing out...');
      },
      fetchUsername(): void {
        axios
          .get(`${API_URL}/auth/login`)
          .then((response) => {
            this.username = response.data.username;
          })
          .catch((error) => {
            console.log('Error fetching username:', error);
          });
      },
    },
    mounted() {
      this.fetchUsers();
      this.fetchUsername();
    },
  };
  </script>
  
  
  <style>
  .book-store {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
  }
  
  .title-section {
    text-align: center;
    flex-grow: 1;
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  
  .sign-out-button {
    margin-top: 10px;
  }
  
  .search-container {
    margin-bottom: 20px;
    align-self: start;
  }
  
  .user-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .user-table th,
  .user-table td {
    padding: 10px;
    border: 1px solid #ddd;
  }
  
  .user-table th {
    background-color: #f2f2f2;
  }
  
  .action-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .action-controls {
    display: flex;
    align-items: center;
  }
  
  .action-button {
    background-color: #f2f2f2;
    color: #040404;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    margin-right: 5px;
  }
  
 
  </style>
    