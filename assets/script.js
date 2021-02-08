function getSavedLibrary() {
  const libraryJSON = localStorage.getItem('library');

  try {
    return libraryJSON ? JSON.parse(libraryJSON) : [];
  } catch (e) {
    return [];
  }
}

function Book(title, author, pages, status = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status;
}

class Library {
  library = [];

  constructor(library) {
    this.library = library;
    this.createForm();
  }

  addBook = (book) => {
    this.library.push(book);
  }

  changeBookStatus = (index) => {
    this.library[index].status = !this.library[index].status;
  }

  createButton = (tr, index, _classList, _textContent) => {
    const td = document.createElement('td');
    const checkBtn = document.createElement('button');
    checkBtn.classList.add(_classList);
    checkBtn.setAttribute('data-attribute', index);
    checkBtn.textContent = _textContent;
    td.appendChild(checkBtn);
    tr.appendChild(td);
    return checkBtn;
  };

  removeBook = (index) => {
    this.library.splice(index, 1);
  }

  toLocalStorage = () => {
    localStorage.setItem('library', JSON.stringify(this.library));
  }

  display = () => {
    const bookBody = document.querySelector('#books_body');
    bookBody.innerHTML = '';

    this.library.forEach((book, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.pages}</td>
        <td>${book.status ? 'Read already' : 'Not yet'}</td>
      `;
      bookBody.appendChild(tr);
      const checkBtn = this.createButton(tr, index, 'change_status_button', (book.status ? 'Unread it?' : 'Read it?'));
      const rmBtn = this.createButton(tr, index, 'remove_button', 'remove');
      checkBtn.addEventListener('click', (event) => {
        const index = event.target.getAttribute('data-attribute');
        this.changeBookStatus(index);
        this.toLocalStorage();
        this.display();
      });
      rmBtn.addEventListener('click', (event) => {
        const index = event.target.getAttribute('data-attribute');
        this.removeBook(index);
        this.toLocalStorage();
        this.display();
      });
    });
  }

  createForm = () => {
    this.form = document.getElementById('book_form');

    function setValues(book, el) {
      book.title = el.title.value;
      book.author = el.author.value;
      book.pages = el.pages.value;
      book.status = el.status.checked;
    }

    function clearValues(el) {
      el.title.value = '';
      el.author.value = '';
      el.pages.value = '';
      el.status.checked = false;
    }

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const book = new Book();
      setValues(book, event.target.elements);
      this.addBook(book);
      this.toLocalStorage();
      this.display();
      clearValues(event.target.elements);
    });
  }
}

const library = new Library(getSavedLibrary());

const bookButton = (form) => {
  const button = document.getElementById('new_book_button');
  button.addEventListener('click', () => {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  });
};

// RUNNING CODE \\
bookButton(library.form);
