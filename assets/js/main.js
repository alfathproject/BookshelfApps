// DOM loaded
document.addEventListener('DOMContentLoaded', function(){
    const submitInputBook = document.getElementById('input-book');
    submitInputBook.addEventListener('submit', function(event){
        event.preventDefault();
        inputBook();
        clearText();
    }); 

    const searchForm = document.getElementById('search-book');
    searchForm.addEventListener('submit', function(event){
        const titleBook = document.getElementById('searchBook').value;
        event.preventDefault();
        findTitleBook(titleBook);
    });
    
    if (isStorageExist()) {
        loadData();
    }
});

// make book shelf
const books = [];
const RENDER_EVENT = 'render-books';

// custom event RENDER_EVENT
document.addEventListener(RENDER_EVENT, function(){
    const inCompleteBooks = document.getElementById('inCompleteBookList');
    const completeBooks = document.getElementById('completeBookList');
    completeBooks.innerHTML = '';
    inCompleteBooks.innerHTML = '';

    let checkIncompleteBook = 0;
    let checkCompleteBook = 0;
    for (const book of books){
        const bookElement = makeShelf(book);
        if(book.isComplete){
            completeBooks.append(bookElement);
            checkCompleteBook++;
        } else {
            inCompleteBooks.append(bookElement);
            checkIncompleteBook++;
        }
    }
    if (checkCompleteBook === 0){
        const noCompleteBook = showNoBook();
        completeBooks.append(noCompleteBook);
    }
    if (checkIncompleteBook === 0){
        const noIncompleteBook = showNoBook();
        inCompleteBooks.append(noIncompleteBook);
    }
});

// show no book 
function showNoBook(){
    const noBook = document.createElement('div');
    noBook.classList.add('no-book');

    const text = document.createElement('h3');
    text.innerText = 'belum ada buku';

    noBook.append(text);
    return noBook;
}

const STORAGE_KEY = 'book-shelf';

// check storage
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser tidak mendukung local storage');
    return false;
  }
  return true;
}

// save databook shelf
function save() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
    }
}

//check storage 
function loadData() {
    const resultData = localStorage.getItem(STORAGE_KEY);
    let dataBooks = JSON.parse(resultData);
   
    if (dataBooks !== null) {
      for (const book of dataBooks) {
        books.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// clear form
function clearText(){
    document.getElementById('inputTitle').value = '';
    document.getElementById('inputAuthor').value = '';
    document.getElementById('inputYear').value = '';
    document.getElementById('searchBook').value = '';
    let results = document.getElementsByName('isComplete');
    for (const result of results ){
        result.checked = false;
    }
}

// generate ID
function generateId() {
    return +new Date();
}

// generate object
function generateBookObject(id, title, author, year, isComplete){
    return {
        id, title, author, year, isComplete
    }
}

// input book
function inputBook(){
    // input data book
    const titleBook = document.getElementById('inputTitle').value;
    const authorBook = document.getElementById('inputAuthor').value;
    const parsedBook = document.getElementById('inputYear').value;
    if(checkInputYear(parsedBook)){
        const yearBook = Number(parsedBook);
        const results = document.getElementsByName('isComplete');
        let isComplete;
        for (const result of results ){
            if(result.checked){
                const value_checked = result.value;
                
                if (value_checked == 'true'){
                    isComplete = true;
                } else {
                    isComplete = false; 
                }
            }
        }
    
        // generate to object Book
        const no_ID = generateId();
        const objectBook = generateBookObject(no_ID, titleBook, authorBook, yearBook, isComplete);
        books.push(objectBook);
    
        document.dispatchEvent(new Event(RENDER_EVENT));
        save();
    } else {
        clearText();
    }
}

// check number 
function checkInputYear(value){
    const parseNumber = Number(value);
    if(parseNumber < 0){
        alert('harap masukkan tahun yang sesuai(tahun tidak bernilai negatif)!');
        return false;
    } else {
        return true;
    }
}

// function find book
function findBook (bookID){
    for (const bookItem of books){
        if(bookItem.id == bookID){
            return bookItem;
        }
    }
    return null;
}

// find book 
function findTitleBook(title){
    const inCompleteBooks = document.getElementById('inCompleteBookList');
    const completeBooks = document.getElementById('completeBookList');
    completeBooks.innerHTML = '';
    inCompleteBooks.innerHTML = '';

    const lowerTitle = title.toLowerCase();
    for (const book of books){
        if ( book.title == lowerTitle){
            const bookElement = makeShelf(book);
            if(book.isComplete){
                completeBooks.append(bookElement);
            } else {
                inCompleteBooks.append(bookElement);
            }
        }
    }

    clearText();
}

// function to complete book
function BookCompleted(bookID){
    const bookTarget = findBook(bookID);

    if(bookTarget == null ) {
        return ;
    }

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    save();
}

// function to incomplete book
function undoBookCompleted(bookID){
    const bookTarget = findBook(bookID);

    if(bookTarget == null){
        return ;
    }

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    save();
}

// function remove Book
function removeBook(id){
    const removeConfirm = confirm("yakin ingin menghapus buku");
    if(removeConfirm){
        const book = findBook(id);
        for (let i = 0; i < books.length; i++) {
            if(books[i].id == id ){
                books.splice(i,1);
            }
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    save();
}

// make shelf book
function makeShelf(objectBook) {
    const titleBook = document.createElement('h3');
    titleBook.innerText = objectBook.title;

    const authorBook = document.createElement('p');
    authorBook.innerText = "penulis : " + objectBook.author;

    const yearBook = document.createElement('p');
    yearBook.innerText = "tahun : " + objectBook.year;

    const bookData = document.createElement('div');
    bookData.classList.add('book-data');
    bookData.append(titleBook, authorBook, yearBook);
    
    const bookItem = document.createElement('div');
    bookItem.setAttribute('id', `book-${objectBook.id}`);
    bookItem.classList.add('book-item');
    bookItem.append(bookData);

    if(objectBook.isComplete){
        const undoCompleteBtn = document.createElement('button');
        undoCompleteBtn.classList.add('btn-complete')
        undoCompleteBtn.innerText = "belum selesai dibaca";

        undoCompleteBtn.addEventListener('click', function(){
            undoBookCompleted(objectBook.id);
        });

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-book');
        removeBtn.innerText = "hapus buku";

        removeBtn.addEventListener('click', function(){
            removeBook(objectBook.id);
        });

        const action = document.createElement('div');
        action.classList.add('action');

        action.append(undoCompleteBtn, removeBtn);
        bookItem.append(action);
    } 
    else {
        const completeBtn = document.createElement('button');
        completeBtn.classList.add('btn-incomplete')
        completeBtn.innerText = "selesai dibaca";

        completeBtn.addEventListener('click', function(){
            BookCompleted(objectBook.id);
        });

        const removeBtn2 = document.createElement('button');
        removeBtn2.classList.add('remove-book');
        removeBtn2.innerText = "hapus buku";

        removeBtn2.addEventListener('click', function(){
            removeBook(objectBook.id);
        });

        const action = document.createElement('div');
        action.classList.add('action');

        action.append(completeBtn, removeBtn2);
        bookItem.append(action);
    }

    return bookItem;
}