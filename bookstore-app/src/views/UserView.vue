/*
The code implements a book store page where users can search for books, view their availability, and place orders. 
It fetches book data from a server, allows searching based on the entered term, updates the order quantity,
and sends order requests to the server. The user can also sign out from the page.
 */
 <template>
  <TitlePage></TitlePage>
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
              <button class="order-button" @click="updateOrder(book, 'decrement')">-</button>
              <span class="order-quantity">{{ book.orderQuantity }}</span>
              <button class="order-button" @click="updateOrder(book, 'increment')">+</button>
            </div>
            <button class="order-book-button" @click="orderBook(book)">Order</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import TitlePage from '../components/TitlePage.vue';
import type { Book } from "@/model/Book"; // Import the interface
import type {OrderData} from "@/model/orderData"; // Import the interface


export default {
  data() {
    return {
      searchTerm: '',
      books: [],
      searchedBooks: [],
    };
  },
  components: {
    TitlePage,
  },
  computed: {
    filteredBooks(): Book[] {
      if (this.searchTerm.trim() === '') {
        return this.books;
      } else {
        const search = this.searchTerm.toLowerCase();
        return this.books.filter((book: Book) => {
          return (
            book.title.toLowerCase().includes(search) ||
            book.author.toLowerCase().includes(search)
          );
        });
      }
    },
  },
  methods: {
    getAvailabilityText(quantity: number): string {
      return quantity > 0 ? `${quantity} left` : 'Out of stock';
    },
    updateOrder(book: Book, action: string): void {
      if (action === 'increment') {
        book.orderQuantity++;
      } else if (action === 'decrement' && book.orderQuantity > 0) {
        book.orderQuantity--;
      }
    },
    refreshToken(): Promise<void> {
      // This method refreshes the token by making a refresh request to the authentication server.
      // Adjust the implementation based on the authentication service.
      const refreshToken = localStorage.getItem('refreshToken'); // Retrieve the refresh token from local storage

      if (!refreshToken) {
        console.log('Refresh token not found');
        return Promise.reject(new Error('Refresh token not found'));
      }

      // Make a request to the refresh token endpoint
      return axios
        .post('http://localhost:3000/auth/refresh', { refreshToken })
        .then((response: AxiosResponse) => {
          const { accessToken, refreshToken } = response.data;

          // Update the access token and refresh token in local storage
          localStorage.setItem('token', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          console.log('Token refreshed successfully');
        })
        .catch((error: Error) => {
          console.log('Error refreshing token:', error);
          // You can handle the error according to your needs (e.g., redirect to login page, show error message, etc.)
          return Promise.reject(error);
        });
    },
    orderBook(book: Book): void {
      if (book.orderQuantity === 0 )  {
        alert('you must order at least one book');
        return;
      } // No need to place an order if the quantity is 0
      if (book.quantity===0){
        alert('Out of stock');
      }    

      const username = localStorage.getItem('user'); // Retrieve the username from localStorage

      if (!username) {
        console.log('Username is missing');
        
        return;
      }

      const orderData: OrderData = {
        username: username,
        title: book.title,
        quantity: book.orderQuantity,
      };

      const API_URL = 'http://localhost:3000';

      // Get the access token from local storage
      const accessToken = localStorage.getItem('token');

      if (!accessToken) {
        console.log('Access token not found');
        alert('Access token not found');
        return;
      }

      axios
        .post(`${API_URL}/library/user/books`, orderData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response: AxiosResponse) => {
          console.log('Order placed successfully:', response.data);
          alert('Order placed successfully');
          // Update books and perform any other necessary actions
        })
        .catch((error: Error) => {
          console.log('Error placing order:', error);

          // Check if the error is due to an expired token
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.log('Token expired. Refreshing token...');

            // Refresh the token and retry the order request
            this.refreshToken()
              .then(() => {
                // Retry the order request with the new access token
                return this.orderBook(book);
              })
              .catch((refreshError: Error) => {
                console.log('Error refreshing token:', refreshError);
              });
          }
        });
    },
    fetchBooks(): void {
      const API_URL = 'http://localhost:3000';
      axios
        .get(`${API_URL}/library/books`)
        .then((response: AxiosResponse) => {
          this.books = response.data.books.map((book: Book) => ({
            ...book,
            orderQuantity: 0,
          }));
        })
        .catch((error: Error) => {
          console.log('Error fetching books:', error);
        });
    },
    searchBook(): void {
      // Perform book search logic based on searchTerm
      const API_URL = 'http://localhost:3000';
      axios
        .get(`${API_URL}/library/user/books/search?q=${this.searchTerm}`)
        .then((response: AxiosResponse) => {
          this.searchedBooks = response.data.books.map((book: Book) => ({
            ...book,
            orderQuantity: 0,
          }));
        })
        .catch((error: Error) => {
          console.log('Error searching book:', error);
        });
    },
    signOut(): void {
      this.$router.push('/login');
      console.log('Signing out...');
    },
  },
  mounted(): void {
    this.fetchBooks();

    // Refresh the token every 45 minutes (adjust the time as needed)
    setInterval(() => {
      console.log('Refreshing token...');
      this.refreshToken().catch((error: Error) => {
        console.log('Error refreshing token:', error);
      });
    }, 45 * 60 * 1000);
  },
};
</script>


<style>

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
  