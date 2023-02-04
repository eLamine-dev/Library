/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
const newBookModal = document.getElementById('form-modal');
const newBookForm = newBookModal.querySelector('#book-form');
const booksContainer = document.getElementById('books-container');
const newBookBtn = document.getElementById('new-book-btn');
const closeNewBookForm = document.getElementById('cancel-book-btn');
const updateBookModal = newBookModal.cloneNode(true);
const updateBookForm = updateBookModal.querySelector('#book-form');
const closeUpdateBook = updateBookModal.querySelector('#cancel-book-btn');

document.body.appendChild(updateBookModal);
updateBookForm.querySelector('h3').textContent = 'Update Book';

const library = [];

const dummyBook = {
   title: "You Don't Know JS Yet: Get Started",
   author: 'Kyle Simpson',
   pages: '140',
   progress: '23',
   read: false,
};
renderNewBook(dummyBook);

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

   renderNewBook(newBook);
}

function setupCard(bookObj) {
   return `
   <header>
      <button class="update-book">Update</button>
      <button class="remove-book">Remove</button>
   </header>
   <h2 class="title">${bookObj.title}</h2>
   <p class="author">By: ${bookObj.author}</p>
   <button class="reading-toggle">
   ${bookObj.read ? 'Read again' : 'Mark as read'}
   </button>
   <footer class="card-buttons">
      <div class="progress-ctrl">
      <button class="progress-button progress-decrement">-</button>
      <div class="card-progress">
         <p id="progress-pages">${bookObj.progress}</p>
         <p>|</p>
         <p id="total-pages">${bookObj.pages}</p>
      </div>
      <button class="progress-button progress-increment">+</button>
      </div>
   </footer>
   `;
}

function renderNewBook(book) {
   library.push(book);
   const bookCard = document.createElement('div');
   bookCard.classList.add('book-card');
   bookCard.innerHTML = setupCard(book);

   bookCard.addEventListener('click', (event) => {
      const targetIndex = library.indexOf(book);
      console.log(targetIndex);
      if (event.target.classList.contains('remove-book')) {
         library.splice(targetIndex, 1);
         bookCard.remove();

         console.log(library);
         console.log(booksContainer);
      } else if (event.target.classList.contains('reading-toggle')) {
         library[targetIndex].read = !library[targetIndex].read;
         library[targetIndex].read
            ? (library[targetIndex].progress = library[targetIndex].pages)
            : (library[targetIndex].progress = 0);

         bookCard.innerHTML = setupCard(library[targetIndex]);
      } else if (event.target.classList.contains('update-book')) {
         updateBookModal.showModal();
         updateBookForm.elements.title.value = book.title;
         updateBookForm.elements.author.value = book.author;
         updateBookForm.elements.pages.value = book.pages;
         updateBookForm.elements.progress.value = book.progress;
         updateBookForm.elements.read.checked = book.read;
         updateBookForm.addEventListener('submit', (ev) => {
            ev.preventDefault();
            updateBook(targetIndex);
            bookCard.innerHTML = setupCard(library[targetIndex]);
            updateBookModal.close();
            console.log(library);
            console.log(booksContainer);
         });
      }
   });

   booksContainer.appendChild(bookCard);
}

function updateBook(targetIndex) {
   library[targetIndex].title = updateBookForm.elements.title.value;
   library[targetIndex].author = updateBookForm.elements.author.value;
   library[targetIndex].pages = updateBookForm.elements.pages.value;
   library[targetIndex].progress = updateBookForm.elements.progress.value;
   library[targetIndex].read = updateBookForm.elements.read.checked;
}

newBookModal.addEventListener('submit', (event) => {
   event.preventDefault();
   addBook();
   newBookModal.close();
   newBookForm.reset();
   console.log(library);
   console.log(booksContainer);
});

newBookBtn.addEventListener('click', () => {
   newBookModal.showModal();
});

closeNewBookForm.addEventListener('click', () => {
   newBookModal.close();
});

closeUpdateBook.addEventListener('click', () => {
   updateBookModal.close();
});
