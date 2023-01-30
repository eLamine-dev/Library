class Book {
   constructor(name, author, pages, read) {
      this.name = name;
      this.author = author;
      this.pages = pages;
      this.read = read;
   }

   finished() {
      this.read = true;
   }
}
