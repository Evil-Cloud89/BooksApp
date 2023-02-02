{
  'use strict';
    
  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
    },
    oneBook: {
      title: '.book__name',
      price: '.product__base-price',
      cover: '.book__image',
      rating: '.book__rating__fill',
    }
  };
  // console.log('select:', select);

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  function render(){                                                                // Funkcja do dodawania książek do strony
    for(const book of dataSource.books){                                            // Pętla do wyszukiwania książek 
      const generatedHTML = templates.book(book);                                   // Wygenerowanie kodu HTML na podstawie szablonu
      // console.log('generatedHTML:', generatedHTML);
      const generateDOMElement = utils.createDOMFromHTML(generatedHTML);            // Generowanie elementu DOM
      // console.log('generateDOMElement:', generateDOMElement);
      const booksContainer = document.querySelector(select.containerOf.booksList);  // Znajduje kontener dla listy książek
      // console.log('booksContainer:', booksContainer);
      booksContainer.appendChild(generateDOMElement);                               // Dodanie elementu DOM do listy książek (jako nowe dziecko DOM)
    }
  }

  const favoriteBooks = [];
  // console.log(favoriteBooks);

  function initActions(){
    const booksCovers = document.querySelectorAll('.book__image');                // Znajduje wszystkie okładki książek
    // console.log('booksList', booksCovers);
    for(let cover of booksCovers){                                                // Pętla do wyszukania okładek
      cover.addEventListener('dblclick', function(event){                         // Event - podwójne kliknięcie będzie wywoływało akcję
        event.preventDefault();                                                   // Zatrzymuje domyślne zachowanie przeglądarki
        const bookId = cover.getAttribute('data-id');                             // Znalezienie Id książki po podwójnym kliknięciu
        // console.log('bookId:', bookId);
        if(!favoriteBooks.includes(bookId)){                                      // Sprawdza czy w tablicy (favoriteBooks) mamy już daną książkę - sprawdza to po ID książki 
          favoriteBooks.push(bookId);                                             // ! = zaprzeczenie, czyli jeśli w tablicy nie ma książki to dodaje książki (nr ID) do tablicy
          cover.classList.add('favorite');                                        // Dodanie klasy 'favorite' po podwójnym kliknięciu w okładkę
        } else {
          favoriteBooks.splice(favoriteBooks.indexOf(bookId), 1);                 // Jeżeli książka ma klasę favorite nastąpi przywrócenie tablicy do stanu przed dodaniem klasy a następnie... 
          cover.classList.remove('favorite');                                     // ... Usunięcie klasy 'favorite' po podwójnym kliknięciu w okładkę
        }
      });
    }
  }

  render();
  initActions();
}