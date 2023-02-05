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

const dummyBook = new Book(
   "You Don't Know JS Yet: Get Started",
   'Kyle Simpson',
   140,
   138,
   false
);
library.push(dummyBook);
renderBook(dummyBook);

function addBook() {
   const title = newBookForm.elements.title.value;
   const author = newBookForm.elements.author.value;
   const pages = Number(newBookForm.elements.pages.value);
   const progress = Number(newBookForm.elements.progress.value);
   const read = newBookForm.elements.read.checked;
   const newBook = new Book(title, author, pages, progress, read);
   library.push(newBook);
   renderBook(newBook);
}

function updateCard(bookCard, book) {
   bookCard.innerHTML = `
   <header>
      <button class="update-book">Update</button>
      <button class="remove-book">Remove</button>
   </header>
   <h2 class="title">${book.title}</h2>
   <p class="author">${book.author}</p>
   <button class="reading-toggle" >
   ${book.read ? 'Read again' : 'Mark as read'}
   </button>
   <footer class="card-buttons">
      <div class="progress-ctrl">
      <button class="progress-button progress-decrement">-</button>
      <div class="card-progress">
         <p id="progress-pages">${
            book.read ? `${book.pages}` : `${book.progress}`
         }</p>
         <p>|</p>
         <p id="total-pages">${book.pages}</p>
      </div>
      <button class="progress-button progress-increment">+</button>
      </div>
   </footer>
   `;

   const readingToggle = bookCard.querySelector('.reading-toggle');
   if (book.read) readingToggle.style.backgroundColor = 'var(--green)';

   return bookCard;
}

function setupCard(bookCard, book) {
   updateCard(bookCard, book);
   bookCard.addEventListener('click', (event) => {
      const targetIndex = library.indexOf(book);

      if (event.target.classList.contains('remove-book')) {
         library.splice(targetIndex, 1);
         bookCard.remove();
      } else if (event.target.classList.contains('reading-toggle')) {
         console.log(event.target);
         book.toggleRead();
         if (book.read) {
            book.progress = book.pages;
         } else {
            book.progress = 0;
         }
         bookCard = updateCard(bookCard, book);
      } else if (event.target.classList.contains('update-book')) {
         InputValidation(updateBookForm);
         updateBookModal.showModal();
         getBookInfo(book);
         updateBookForm.addEventListener('submit', (ev) => {
            ev.preventDefault();
            updateBook(book);
            bookCard = updateCard(bookCard, book);
            updateBookModal.close();
         });
      } else if (event.target.classList.contains('progress-decrement')) {
         if (book.progress > 0) book.progress -= 1;
         if (book.progress < book.pages) book.read = false;
         bookCard = updateCard(bookCard, book);
      } else if (event.target.classList.contains('progress-increment')) {
         if (book.progress < book.pages) book.progress += 1;
         if (book.progress === book.pages) book.read = true;
         bookCard = updateCard(bookCard, book);
      }
   });

   return bookCard;
}

function renderBook(book) {
   const bookCard = document.createElement('div');
   bookCard.classList.add('book-card');
   booksContainer.appendChild(setupCard(bookCard, book));
}

function getBookInfo(book) {
   updateBookForm.elements.title.value = book.title;
   updateBookForm.elements.author.value = book.author;
   updateBookForm.elements.pages.value = book.pages;
   updateBookForm.elements.progress.value = book.progress;
   updateBookForm.elements.read.checked = book.read;
}

function updateBook(book) {
   book.title = updateBookForm.elements.title.value;
   book.author = updateBookForm.elements.author.value;
   book.pages = Number(updateBookForm.elements.pages.value);
   book.progress = Number(updateBookForm.elements.progress.value);
   book.read = updateBookForm.elements.read.checked;
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
   newBookForm.reset();
   newBookModal.showModal();
   InputValidation(newBookForm);
});

closeNewBookForm.addEventListener('click', () => {
   newBookModal.close();
});

closeUpdateBook.addEventListener('click', () => {
   updateBookModal.close();
});

function InputValidation(element) {
   const progressInput = element.querySelector('#progress');
   const pagesInput = element.querySelector('#pages');
   const readToggle = element.querySelector('#read');
   const numbersInputs = element.querySelectorAll('input[type=number]');

   function checkNumInput() {
      if (Number(progressInput.value) > Number(pagesInput.value)) {
         progressInput.value = '';
         progressInput.setAttribute('placeholder', '? < pages');
         readToggle.checked = false;
      } else if (Number(progressInput.value) === Number(pagesInput.value)) {
         readToggle.checked = true;
      } else {
         readToggle.checked = false;
      }
   }

   readToggle.addEventListener('input', () => {
      if (readToggle.checked) progressInput.value = pagesInput.value;
      else if (
         progressInput.value === pagesInput.value &&
         !readToggle.checked &&
         progressInput.value !== ''
      )
         progressInput.value = '';
   });

   numbersInputs.forEach((input) => {
      input.addEventListener('input', () => {
         checkNumInput();
      });
   });

   numbersInputs.forEach((input) => {
      input.addEventListener('keypress', (event) => {
         if (event.which < 48 || event.which > 57) {
            event.preventDefault();
         }
      });
   });
}
