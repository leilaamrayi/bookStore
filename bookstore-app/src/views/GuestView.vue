/*
The code represents a guest view of a book store where users can search for books. It allows users to enter a search term,
sends a request to the server to fetch books matching the search term, and displays the search results in a table. 
Users can also sign in to access additional features.
*/

<template>
  <div class="guest-view">
    <div class="title-container">
      <div class="title-section">
        <h1 class="title">Book Store</h1>
      </div>
      <div class="user-info">
        <p>Browsing as Guest</p>
        <button class="sign-out-button" @click="signIn">Sign in</button>
      </div>
    </div>
    <div class="search-container">
      <input type="text" v-model="searchTerm" placeholder="Search Book" @keyup.enter="searchBook" />
    </div>
    <div v-if="!searchResultsVisible || searchTerm === '' || searchTerm === null">
      <BookList :books="books" />
    </div>
    <div v-else>
      <table class="book-table">
        <thead>
          <tr>
            <th>Book Title</th>
            <th>Book Author</th>
            <th>Book quantity</th>
            <th>Version Number</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in searchResults" :key="index">
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book.quantity }}</td>
            <td>{{ book.version }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import BookList from '@/components/BookList.vue';

export default {
  components: {
    BookList,
  },
  data() {
    return {
      searchTerm: '',
      books: [],
      searchResults: [],
      searchResultsVisible: false,
    };
  },
  methods: {
    searchBook() {
      const API_URL = 'http://localhost:3000';
      axios
        .get(`${API_URL}/library/books/search?q=${this.searchTerm}`)
        .then((response) => {
          this.searchResults = response.data.books;          
          this.searchResultsVisible = true;
        })
        .catch((error) => {
          console.log('Error searching book:', error);
        });
    },
    signIn() {
      // Sign in logic
    },
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
  
}
  .book-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .book-table th,
  .book-table td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
    justify-content: space-between;
  }
  
  .book-table th {
    background-color: #f2f2f2;
  }
  
  </style>
  