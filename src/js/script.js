{
  'use strict';
    
  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
      filters: '.filters',
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
      const ratingBgc = determineRatingBgc(book.rating);                            // Stała, która będzie zwracała rating 
      const ratingWidth = book.rating * 10;                                         // Stała, która ustali długość paska (* 10 ponieważ konwertujemy to do %)
      book.ratingBgc = ratingBgc;
      // console.log('ratingBgc', book.rating);
      book.ratingWidth = ratingWidth;
      // console.log('ratingWidth', ratingWidth);
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
  const filters = [];

  function initActions(){
    const booksCovers = document.querySelectorAll('.book__image');                // Znajduje wszystkie okładki książek
    // console.log('booksList', booksCovers);
    const filtersOption = document.querySelector('.filters');                     // Znajduje wszystkie filtry książek
    // console.log('filtersSection', filtersSection);
    filtersOption.addEventListener('click', function(event){                      // Event - kliknięcie będzie wywoływało akcję (zaznaczenie filtra)
      const booksFilter = event.target;                                           // Event delegation II - namierza checkbox z kontenera i zaznacza go po kliknięiu
      // console.log('booksFilter', booksFilter);
      if(booksFilter.tagName == 'INPUT' &&                                        // Obwarowania, które musi spełniać checkbox
          booksFilter.name == 'filter' && 
          booksFilter.type == 'checkbox'){  
        const filterValue = booksFilter.value;                                    // Wyświetla wartość checkboxa                                    
        console.log(filterValue);
        if(booksFilter.checked == true){                                          // Dodanie do tablicy (filters) po kliknięciu warości jeśli spełnia wymogi i nie jest zaznaczona
          filters.push(filterValue);
        } else {
          filters.splice(filters.indexOf(filterValue), 1);                        // Usunięcie z tablicy zawartości po ponownym kliknięciu
        }
        console.log('filters', filters);
      }
      filterBooks();                                                              // Wywołanie funkcji filtrującej książki
    });

    for(let cover of booksCovers){                                                // Pętla do wyszukania okładek
      cover.addEventListener('dblclick', function(event){                         // Event - podwójne kliknięcie będzie wywoływało akcję
        event.preventDefault();                                                   // Zatrzymuje domyślne zachowanie przeglądarki
        const coverLink = event.target;                                           // Event delegation - namierza konkretny element w kontenerze, który wykona akcję po podwójnym kliknięciu
        // console.log('coverLink:', coverLink);
        if(coverLink.offsetParent.classList.contains('book__image')){             // Dodanie zależności dla konkretnego elementu w celu:
          // console.log('event.target:', event.target);
          const bookId = coverLink.offsetParent.getAttribute('data-id');          // Znalezienie Id książki po podwójnym kliknięciu
          // console.log('bookId:', bookId);
          if(!favoriteBooks.includes(bookId)){                                    // Sprawdza czy w tablicy (favoriteBooks) mamy już daną książkę - sprawdza to po ID książki 
            favoriteBooks.push(bookId);                                           // ! = zaprzeczenie, czyli jeśli w tablicy nie ma książki to dodaje książki (nr ID) do tablicy
            coverLink.offsetParent.classList.add('favorite');                     // Dodanie klasy 'favorite' po podwójnym kliknięciu w okładkę
          } else {
            favoriteBooks.splice(favoriteBooks.indexOf(bookId), 1);               // Jeżeli książka ma klasę favorite nastąpi przywrócenie tablicy do stanu przed dodaniem klasy a następnie... 
            coverLink.offsetParent.classList.remove('favorite');                  // ... Usunięcie klasy 'favorite' po podwójnym kliknięciu w okładkę
          }
          console.log(favoriteBooks);
        }
      });
    }
  }
  
  function filterBooks(){                                                         // Funkcja do filtrowania książek
    for (const book of dataSource.books){                                         // Pętla, która przejdzie po wszystkich książkach z dataSource.books 
      let shouldBeHidden = false;                                                 // Zmienna, która zostanie wykorzystana do dodania opcji hidden - stąd jest false
      const selectCover = document.querySelector(                                 // Element .book__image potrzebny do 
        '.book__image[data-id="' + book.id + '"]'
      );
      for(const filter of filters){                                               // Pętla, która przejdzie po tablicy filters i ustali, czy dany filtr pasuje do informacji o danej książce 
        if(!book.details[filter]){                                                // Jeśli dana właściwość powinna być true, a nie jest, ...
          shouldBeHidden = true;                                                  // ... to należy zmienić shouldBeHidden na true i przerwać działanie pętli
          break;                                                                  // Przerwanie pętli
        }
      }
      if(shouldBeHidden){                                                         // Pętla warunkowa, która sprawdza wartość shouldBeHidden
        selectCover.classList.add('hidden');                                      // Jeśli jest równa true, to należy znaleźć element .book__image danej książki i nadać mu klasę hidden
      } else {
        selectCover.classList.remove('hidden');                                   // Jeśli jest równa false, to należy taką klasę zabrać.
      }
      console.log('selectCover:', selectCover);
    }
  }

  function determineRatingBgc(rating){                                            // Funkcja do określenia ratingu i ustawienia odpowiedniego koloru dla jego tła
    let background = '';                                                          
    if(rating < 6){                                                               // Zależośc, które przyjmujemy - dające odpowiedni kolor
      background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
    } else if(rating > 6 && rating <= 8){
      background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
    } else if(rating > 8 && rating <= 9){
      background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    } else if(rating > 9){
      background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }
    return background;                                                            // Zwracamy odpowiedni background
  }

  render();
  initActions();
}