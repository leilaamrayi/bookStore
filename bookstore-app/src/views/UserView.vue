/*
The code implements a book store page where users can search for books, view their availability, and place orders. 
It fetches book data from a server, allows searching based on the entered term, updates the order quantity,
and sends order requests to the server. The user can also sign out from the page.
 */

<template>
  <div class="book-store">
    <div class="title-container">
      <div class="title-section">
        <h1 class="title">Book Store</h1>
      </div>
      <div class="user-info">
        <p>Browsing as user {{ userName }}</p>
        <button class="sign-out-button" @click="signOut">Sign Out</button>
      </div>
    </div>
    <div class="search-container">
      <input type="text" v-model="searchTerm" placeholder="Search Book" @keyup.enter="searchBook" />
    </div>
    <table class="book-table">
      <thead>
        <tr>
          <th>Book Title</th>
          <th>Book Author</th>
          <th>Availability</th>
          <th>Order</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(book, index) in filteredBooks" :key="index">
          <td>{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td>{{ getAvailabilityText(book.quantity) }}</td>
          <td>
            <div class="order-container">
              <div class="order-controls">
                <button class="order-button" @click="updateOrder(index, 'decrement')">-</button>
                <span class="order-quantity">{{ book.orderQuantity }}</span>
                <button class="order-button" @click="updateOrder(index, 'increment')">+</button>
              </div>
              <button class="order-book-button" @click="orderBook(index)">Order</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userName: '',
      searchTerm: '',
      books: [],
    };
  },
  computed: {
    filteredBooks() {
      if (this.searchTerm.trim() === '') {
        return this.books;
      }
      const search = this.searchTerm.toLowerCase();
      return this.books.filter((book) => {
        return (
          book.title.toLowerCase().includes(search) ||
          book.author.toLowerCase().includes(search)
        );
      });
    },
  },
  methods: {
    getAvailabilityText(quantity) {
      return quantity > 0 ? `${quantity} left` : 'Out of stock';
    },
    updateOrder(index, action) {
      const book = this.books[index];
      if (action === 'increment') {
        book.orderQuantity++;
      } else if (action === 'decrement' && book.orderQuantity > 0) {
        book.orderQuantity--;
      }
    },
    orderBook(index) {
      const book = this.books[index];
      if (book.orderQuantity === 0) {
        return; // No need to place an order if quantity is 0
      }
      
      const orderData = {
        title: book.title,
        quantity: book.orderQuantity,
      };

      const API_URL = 'http://localhost:3000';
      axios
        .post(`${API_URL}/library/user/books`, orderData)
        .then((response) => {
          console.log('Order placed successfully:', response.data);
          // Update books and perform any other necessary actions
        })
        .catch((error) => {
          console.log('Error placing order:', error.response.data);
        });
    },
    fetchBooks() {
      const API_URL = 'http://localhost:3000';
      axios
        .get(`${API_URL}/library/books`)
        .then((response) => {
          this.books = response.data.books.map((book) => ({
            ...book,
            orderQuantity: 0,
          }));
        })
        .catch((error) => {
          console.log('Error fetching books:', error);
        });
    },
    searchBook() {
      // Perform book search logic based on searchTerm
      const API_URL = 'http://localhost:3000';
      axios
        .get(`${API_URL}/library/books/search?q=${this.searchTerm}`)
        .then((response) => {
          this.books = response.data.books.map((book) => ({
            ...book,
            orderQuantity: 0,
          }));
        })
        .catch((error) => {
          console.log('Error searching book:', error);
        });
    },
    signOut() {
      // Sign out logic
      console.log('Signing out...');
    },
  },
  mounted() {
    this.fetchBooks();
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

.book-table {
  width: 100%;
  border-collapse: collapse;
}

.book-table th,
.book-table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.book-table th {
  background-color: #f2f2f2;
}

.order-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.order-controls {
  display: flex;
  align-items: center;
}

.order-button {
  background-color: #f2f2f2;
  color: #040404;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  margin-right: 5px;
}

.order-quantity {
  margin: 0 5px;
}

.order-book-button {
  background-color: #f2f2f2;
}
</style>
  