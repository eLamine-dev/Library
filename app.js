/* eslint-disable no-console */
const booksContainer = document.getElementById('books-container');
const newBookBtn = document.getElementById('new-book-btn');
const closeNewBookForm = document.getElementById('cancel-book-btn');
const formModal = document.getElementById('form-modal');
const newBookForm = document.getElementById('new-book-form');

const library = [];

class Book {
   constructor(title, author, pages, read) {
      this.title = title;
      this.author = author;
      this.pages = pages;
      this.read = read;
   }

   toggleRead() {
      this.read = !this.read;
   }
}

function addBook() {
   const author = newBookForm.elements.author.value;
   const title = newBookForm.elements.title.value;
   const pages = newBookForm.elements.pages.value;
   const read = newBookForm.elements.read.checked;
   const newBook = new Book(author, title, pages, read);
   updateLibrary(newBook);
   console.log(newBook);
}

function updateLibrary(newBook) {
   library.push(newBook);
   const bookCard = document.createElement('div');
   bookCard.classList.add('book-card');
   bookCard.innerHTML = `
      <h2>${newBook.title}</h2>
      <p>Author: ${newBook.author}</p>
      <p>Pages: ${newBook.pages}</p>
      <p id="read">Read: ${newBook.read ? 'Yes' : 'No'}</p>
      <button class="remove-book">Remove Book</button>
      <button class="toggle-read">Toggle Read</button>
    `;
   booksContainer.appendChild(bookCard);

   bookCard.addEventListener('click', (event) => {
      const targetIndex = library.indexOf(newBook);
      if (event.target.classList.contains('remove-book')) {
         library.splice(targetIndex, 1);
         bookCard.remove();

         console.log(library);
         console.log(booksContainer);
      } else if (event.target.classList.contains('toggle-read')) {
         library[targetIndex].toggleRead();
         bookCard.querySelector('#read').textContent = `Read: ${
            library[targetIndex].read ? 'Yes' : 'No'
         }`;
      }
   });
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
   formModal.show();
});

closeNewBookForm.addEventListener('click', () => {
   formModal.close();
});
