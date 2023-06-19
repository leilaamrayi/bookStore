
<template>
  <TitlePage></TitlePage>
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
  </template>
  
  <script lang="ts">
  import axios from 'axios';  
  import TitlePage from '../components/TitlePage.vue';
  
  const API_URL = 'http://localhost:3000';
  
  interface User {
    username: string;
    role: string;
    purchases: number;
  }
  
  export default {
    data() {
      return {        
        searchTerm: '',
        users: [] as User[],
      };
    },
    components: {
    TitlePage,
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
      this.$router.push('/login');
      console.log('Signing out...');
      },
     
    mounted() {
      this.fetchUsers();
      
    },
  }
  };
  </script>
  
  
  <style>
  .book-store {
    display: flex;
    flex-direction: column;
    align-items: center;
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
    