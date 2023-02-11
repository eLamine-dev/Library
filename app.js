/* eslint-disable no-console */
const newBookModal = document.getElementById('form-modal');
const newBookForm = newBookModal.querySelector('#book-form');
const booksContainer = document.getElementById('books-container');
const newBookBtn = document.getElementById('new-book-btn');
const closeNewBookForm = document.getElementById('cancel-book-btn');
const updateBookModal = newBookModal.cloneNode(true);
const updateBookForm = updateBookModal.querySelector('#book-form');
const closeUpdateBook = updateBookModal.querySelector('#cancel-book-btn');

// add the Update-book modal cloned from new-book modal to the dom
document.body.appendChild(updateBookModal);
updateBookForm.querySelector('h3').textContent = 'Edit Book';

const library = [];

// Book constructor
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
      if (this.read) this.progress = this.pages;
      else this.progress = 0;
   }
}

// dummy book
const dummyBook = new Book(
   "You Don't Know JS Yet: Get Started",
   'Kyle Simpson',
   140,
   138,
   false
);
addBookToLibrary(dummyBook);

// create new book from new book form values
function createNewBook() {
   const formData = getFormData(newBookForm);
   const newBook = new Book(...Object.values(formData));

   addBookToLibrary(newBook);
}

// Update book from submitUpdatedBook book form values
function updateBook(book) {
   const formData = getFormData(updateBookForm);
   Object.assign(book, formData);
}

// Get form values
function getFormData(form) {
   const formData = {
      title: form.elements.title.value,
      author: form.elements.author.value,
      pages: Number(form.elements.pages.value),
      progress: Number(form.elements.progress.value),
      read: form.elements.read.checked,
   };
   return formData;
}

// create card for new book
function addBookToLibrary(book) {
   // create the card
   let bookCard = document.createElement('div');
   bookCard.classList.add('book-card');
   updateCard(bookCard, book);

   // adding event listeners to the created card, this will keep the corresponding
   // "book" saved in scope of the card EventListener function
   bookCard.addEventListener('click', (event) => {
      const targetIndex = library.indexOf(book);

      function submitUpdatedBook(ev) {
         ev.preventDefault();
         updateBook(book);
         updateCard(bookCard, book);
         updateBookModal.close();
      }

      if (event.target.classList.contains('remove-book')) {
         library.splice(targetIndex, 1);
         bookCard.remove();
      } else if (event.target.classList.contains('reading-toggle')) {
         book.toggleRead();
         updateCard(bookCard, book);
      } else if (event.target.classList.contains('edit-book')) {
         getBookInfo(book);
         updateBookModal.showModal();

         updateBookForm.addEventListener('submit', submitUpdatedBook, {
            once: true,
         });

         closeUpdateBook.addEventListener(
            'click',
            () => {
               updateBookForm.removeEventListener('submit', submitUpdatedBook, {
                  once: true,
               });
               updateBookModal.close();
            },
            { once: true }
         );
      } else if (event.target.classList.contains('progress-decrement')) {
         if (book.progress > 0) book.progress -= 1;
         if (book.progress < book.pages) book.read = false;
         updateCard(bookCard, book);
      } else if (event.target.classList.contains('progress-increment')) {
         if (book.progress < book.pages) book.progress += 1;
         if (book.progress === book.pages) book.read = true;
         updateCard(bookCard, book);
      }
   });

   // push the book to the array and append it's card to the book-container
   library.push(book);
   booksContainer.appendChild(bookCard);
}

// Update book card content with new/updated book info
function updateCard(bookCard, book) {
   bookCard.innerHTML = `
   <header>
      <button class="edit-book">Edit</button>
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
   const cardProgress = bookCard.querySelector('.card-progress');
   if (book.read) cardProgress.style.backgroundColor = 'var(--green)';

   return bookCard;
}

// get book infos for the edit book form
function getBookInfo(book) {
   updateBookForm.elements.title.value = book.title;
   updateBookForm.elements.author.value = book.author;
   updateBookForm.elements.pages.value = book.pages;
   updateBookForm.elements.progress.value = book.progress;
   updateBookForm.elements.read.checked = book.read;
}

// new book form submission
newBookModal.addEventListener('submit', (event) => {
   event.preventDefault();
   createNewBook();
   newBookModal.close();
   newBookForm.reset();
});

// open/close new/submitUpdatedBook book form
newBookBtn.addEventListener('click', () => {
   newBookForm.reset();
   newBookModal.showModal();
});

closeNewBookForm.addEventListener('click', () => {
   newBookModal.close();
});

// some numbers inputs verification while typing
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

InputValidation(updateBookForm);
InputValidation(newBookForm);
