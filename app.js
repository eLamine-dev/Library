/* eslint-disable no-console */
const booksContainer = document.getElementById('books-container');
const newBookBtn = document.getElementById('new-book-btn');
const closeNewBookForm = document.getElementById('cancel-book-btn');
const formModal = document.getElementById('form-modal');
const newBookForm = document.getElementById('new-book-form');

const library = [];

class Book {
   constructor(title, author, pages, progress, read) {
      this.title = title;
      this.author = author;
      this.pages = pages;
      this.progress = progress;
      this.read = read;
   }

   toggleRead() {
      this.read = !this.read;
   }
}

function addBook() {
   const title = newBookForm.elements.title.value;
   const author = newBookForm.elements.author.value;
   const pages = newBookForm.elements.pages.value;
   const progress = newBookForm.elements.progress.value;
   const read = newBookForm.elements.read.checked;
   const newBook = new Book(title, author, pages, progress, read);
   updateLibrary(newBook);
}

function updateLibrary(newBook) {
   library.push(newBook);
   const bookCard = document.createElement('div');
   bookCard.classList.add('book-card');
   bookCard.innerHTML = `
      <header>
      <button class="toggle-read">Edit</button>
      <button class="remove-book">Remove</button>
         
      </header>
      <h2>${newBook.title}</h2>
      
      <p>By: ${newBook.author}</p>
      <p id="reading-status">Read: ${newBook.read ? 'Yes' : 'No'}</p>
      <footer class="card-buttons">
      <div class="progress-ctrl">
         <button class="progress-button progress-decrement">-</button>
         <div class="card-progress">
            <input  class="progress-input" type="number" value="${
               newBook.progress
            }" max="20"/>
            <p> | </p>
            <p id="total-pages">${newBook.pages}</p>
         </div> 
         <button class="progress-button progress-increment">+</button>
      </div>
      
      </footer>
      `;

   bookCard.addEventListener('click', (event) => {
      console.log(newBook);
      const targetIndex = library.indexOf(newBook);
      if (event.target.classList.contains('remove-book')) {
         library.splice(targetIndex, 1);
         bookCard.remove();

         console.log(library);
         console.log(booksContainer);
      } else if (event.target.classList.contains('toggle-read')) {
         library[targetIndex].toggleRead();
         bookCard.querySelector('#reading-status').textContent = `Read: ${
            library[targetIndex].read ? 'Yes' : 'No'
         }`;
      }
   });

   booksContainer.appendChild(bookCard);
}

newBookForm.addEventListener('submit', (event) => {
   event.preventDefault();
   addBook();
   formModal.close();
   newBookForm.reset();
   console.log(library);
   console.log(booksContainer);
});

newBookBtn.addEventListener('click', () => {
   formModal.showModal()();
});

closeNewBookForm.addEventListener('click', () => {
   formModal.close();
});
