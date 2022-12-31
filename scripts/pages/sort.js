OpenFilters();
selectFilter();

/**
 * Permet la gestion de la select list faite en JS afin de meieux correspondre a la maquettes
 * @constructor
 */
function OpenFilters() {
  const cursor = document.querySelector('#cursor');
  const selector = document.querySelector('#selectlist');
  //methode qui permet d'ouvrir la selectlist et de faire rotate le chevron active
  // egalement les Tabindex
  function open() {
    selector.classList.toggle('active');
    cursor.classList.toggle('rotate');
    if (selector.getAttribute('class') !== 'active') {
      document.querySelector('body').style.overflowY = 'scroll';
      selector.children[1].setAttribute('tabindex', '');
      selector.children[2].setAttribute('tabindex', '');
      selector.children[3].setAttribute('tabindex', '');
    }
    if (selector.getAttribute('class') === 'active') {
      document.querySelector('body').style.overflowY = 'hidden';
      selector.children[1].focus();
      selector.children[1].setAttribute('tabindex', '0');
      selector.children[2].setAttribute('tabindex', '0');
      selector.children[3].setAttribute('tabindex', '0');
    }
  }
  //ferme la select list
  function close() {
    if (selector.classList.contains('active') && cursor.classList.contains('rotate')) {
      selector.classList.remove('active');
      cursor.classList.remove('rotate');
    }
  }
  //ouvre la select liste avec le click
  selector.onclick = () => {
    open();
  };
  //permet de geré les interaction clavier
  selector.onkeydown = (e) => {
    switch (e.key) {
      case 'Enter': {
        e.preventDefault();
        open();
        break;
      }
      case 'Escape': {
        close();
        break;
      }
      case 'ArrowDown': {
        selector.children[1].focus();
        if (e.target.textContent === 'Popularité') selector.children[2].focus();
        if (e.target.textContent === 'Date') selector.children[3].focus();
        if (e.target.textContent === 'Titre')selector.children[1].focus();

        break;
      }

      case 'ArrowUp': {
        if (e.target.textContent === 'Popularité') selector.children[3].focus();
        if (e.target.textContent === 'Date') selector.children[1].focus();
        if (e.target.textContent === 'Titre')selector.children[2].focus();
        break;
      }

      default: {
        break;
      }
    }
  };
}

//permet d'executé le tie lors d'une interaction avec un element
function selectFilter() {
  const list = document.querySelectorAll('#selectlist p');

  list.forEach((el, index) => {
    function openSelectMenu() {
      const elements = document.querySelector('#selectlist').children;
      const selected = document.querySelector('#selected');
      selected.textContent = elements[index].textContent;
      return selected.textContent;
    }

    el.onkeydown = (e) => {
      if (e.key === 'Enter') asingSort(openSelectMenu());
    };

    el.onclick = async (e) => {
      asingSort(openSelectMenu());
    };
  });
}

/**
 * realise le tris en fonction de la date || des la popularité || du titre
 * @param element
 * @returns {Promise<*[]>}
 */
// eslint-disable-next-line
async function asingSort(element) {
  //tableau vide qui reçevera les data
  const data = [];
  //attribution au tableau data des information reçus depuis la fonction get media
  // eslint-disable-next-line
  for (const i of await getMedia()) data.push(i);
  const mediaSection = document.querySelector('#Media-Content');
  //permet la suppression de l'element selctionner
  async function remove() {
    while (mediaSection.firstChild) mediaSection.removeChild(mediaSection.firstChild);
  }

  /**
   * Switch qui permet de realsier le trie
   */
  switch (element) {
    case 'Popularité': {
      await remove();
      const media = data.sort((a, b) => b.likes - a.likes);
      displayData(await getPhotographers(), await media);
      fillLightBox(await media);
      break;
    }
    case 'Date': {
      await remove();
      const media = data.sort((a, b) => b.date - a.date);
      displayData(await getPhotographers(), await media);
      fillLightBox(await media);
      break;
    }

    case 'Titre': {
      await remove();
      const media = data.sort((a, b) => {
        if (b.title > a.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
      displayData(await getPhotographers(), await media);
      fillLightBox(await media);
      break;
    }
    default: {
      const media = data.sort((a, b) => b.likes - a.likes);
      fillLightBox(await media);
      return media;
    }
  }
}
