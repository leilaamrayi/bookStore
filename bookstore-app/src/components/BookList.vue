<template>
  <div class="book-store">
    <div class="title-container">
      
    </div>
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
        <tr v-for="(book, index) in books" :key="index">
          <td>{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td>{{ book.quantity }}</td>
          <td>{{ book.version }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';

const API_URL = 'http://localhost:3000';

interface Book {
  title: string;
  author: string;
  quantity: number;
  version: number;
}

export default {
  data() {
    return {
      books: [] as Book[],
    };
  },
  setup() {
    const books = ref<Book[]>([]);

    const fetchBooks = () => {
      axios
        .get(`${API_URL}/library/books`)
        .then((response) => {
          books.value = response.data.books;
          console.log('Received books:', books.value);
        })
        .catch((error) => {
          console.log('Error fetching books:', error);
        });
    };

    onMounted(fetchBooks);

    return {
      books,
    };
  },
};
</script>



<style>
.book-table {
  width: 100%;
  border-collapse: collapse;
}

.book-table th,
.book-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.book-table th {
  background-color: #f2f2f2;
}
</style>
