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
   const author = document.getElementById('author').value;
   const title = document.getElementById('title').value;
   const pages = document.getElementById('pages').value;
   const read = document.getElementById('read').checked;
   library.push(new Book(author, title, pages, read));
}

const newBookBtn = document.getElementById('new-book-btn');
const closeNewBookForm = document.getElementById('cancel-book-btn');
const formModal = document.getElementById('form-modal');
const newBookForm = document.getElementById('new-book-form');
const booksContainer = document.getElementById('books-container');

function updateLibrary() {
   for (let i = library.length - 1; i < library.length; i++) {
      const bookCard = document.createElement('div');
      bookCard.classList.add('book-card');
      bookCard.innerHTML = `
      <h2>${library[i].title}</h2>
      <p>Author: ${library[i].author}</p>
      <p>Pages: ${library[i].pages}</p>
      <p>Read: ${library[i].read ? 'Yes' : 'No'}</p>
      <button class="remove-book" data-index="${i}">Remove Book</button>
      <button class="toggle-read" data-index="${i}">Toggle Read</button>
    `;

      booksContainer.appendChild(bookCard);
   }
}

newBookForm.addEventListener('submit', (event) => {
   event.preventDefault();
   addBook();
   formModal.close();
   newBookForm.reset();
   console.log(library);
   updateLibrary();
});

newBookBtn.addEventListener('click', () => {
   formModal.show();
});

closeNewBookForm.addEventListener('click', () => {
   formModal.close();
});
