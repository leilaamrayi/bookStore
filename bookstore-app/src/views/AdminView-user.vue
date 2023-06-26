<template>
  <TitlePage></TitlePage>
  <div class="search-container">
    <div class="input-container">
      <input type="text" v-model="searchTerm" placeholder="Search by username" @keyup.enter="searchUser" />
    </div>
    <div class="buttons-container">
      <button @click="fetchBooks">Books</button>
      <button class="users-button" @click="fetchUsers">Users</button>
    </div>
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
              <button class="action-button" @click="deleteUser(user)">Delete</button>
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
  profile?: any;
}

export default {
  data() {
    return {
      searchTerm: '',
      users: [] as User[],
      selectedUser: null as User | null,
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
    async fetchUsers(): Promise<void> {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.users = response.data.users;
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    },
    async fetchUserProfile(foundUser: User): Promise<void> {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/library/profile?username=${foundUser.username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update the foundUser's profile data
        foundUser.profile = response.data;

        // Set the selectedUser to the foundUser
        this.selectedUser = foundUser;
      } catch (error) {
        console.log('Error fetching user profile:', error);
      }
    },
    async searchUser(): Promise<void> {
      const search = this.searchTerm.toLowerCase();
      const foundUser = this.users.find((user) => {
        return user.username.toLowerCase() === search;
      });

      if (foundUser) {
        await this.fetchUserProfile(foundUser);
      } else {
        this.selectedUser = null; // Reset selectedUser if user is not found
      }
    },
    async deleteUser(foundUser: User): Promise<void> {
  try {
    const username = foundUser.username.trim();
    if (username === '') {
      console.log('Invalid username');
      return;
    }

    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/admin/users/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      console.log('User deleted successfully');
      // Remove the user from the users list
      const userIndex = this.users.findIndex((user) => user.username === foundUser.username);
      if (userIndex !== -1) {
        this.users.splice(userIndex, 1);
      }
      this.selectedUser = null; // Reset selectedUser after deleting
    } else if (response.status === 404) {
      console.log('User not found');
    } else {
      console.log('Error deleting user');
    }
  } catch (error) {
    console.log('Error deleting user:', error);
  }
},
  
    async fetchBooks(): Promise<void> {
      // Implement the logic to fetch books here
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

  
<style>
.search-container {
  display: flex;
  align-items:flex-end;
  margin-bottom: 10px;
  
  }

.input-container {
  margin-right: auto; /* Adjust the spacing between input and buttons */
  margin-bottom: 20px;
}

.buttons-container {
  margin-left: auto; /* Push buttons to the right */
  margin-bottom: 0px;
}
.users-button {
  background-color: #393434;
  color: #fffdfd;
 }

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0px;
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
    