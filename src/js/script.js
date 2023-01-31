{
  'use strict';
    
  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
    },
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
  render();
}