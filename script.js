let allCharacters = [];
let favoriteCharacters = JSON.parse(localStorage.getItem('favorites')) || [];

function renderCharacterList(characters) {
  const list = document.getElementById('character-list');
  list.innerHTML = ''; // Limpa a lista antes de renderizar novamente

  characters.forEach(character => {
    const listItem = document.createElement('li');
    listItem.dataset.characterId = character.id; // Usado para atualizar o botão de favoritos

    const img = document.createElement('img');
    img.src = character.image;
    img.alt = character.name;

    const text = document.createElement('span');
    text.textContent = `${character.name} - ${character.race}`;

    listItem.appendChild(img);
    listItem.appendChild(text);
    list.appendChild(listItem);

    const favoriteButton = document.createElement('button');
    favoriteButton.className = 'favorite';
    favoriteButton.textContent = 'Favorite';

    if (favoriteCharacters.some(fav => fav.id === character.id)) {
      favoriteButton.textContent = 'Desfavoritar';
    }

    listItem.appendChild(favoriteButton);

    favoriteButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Impede que o clique no botão favorite expanda o item
      if (favoriteButton.textContent === 'Favorite') {
        favoriteCharacter(character);
      } else {
        unfavoriteCharacter(character);
      }
      updateFavoriteButtons(); // Atualiza todos os botões após o clique
    });

    // Ao clicar no item, mostra os detalhes fora da caixa
    listItem.addEventListener('click', () => {
      showCharacterDetails(character);
    });
  });
}

function showCharacterDetails(character) {
  const detailsContainer = document.getElementById('character-details');

  detailsContainer.innerHTML = `
    <div class="details-popup-content">
      <img src="${character.image}" alt="${character.name}">
      <h2>${character.name}</h2>
      <p><strong>Gênero:</strong> ${character.gender}</p>
      <p><strong>Raça:</strong> ${character.race}</p>
      <p><strong>Afiliação:</strong> ${character.affiliation}</p>
      <p><strong>Ki Atual:</strong> ${character.ki}</p>
      <p><strong>Ki Máximo:</strong> ${character.maxKi}</p>
    </div>
  `;

  // Exibe o contêiner
  detailsContainer.style.display = 'block';

  // Fechar o pop-up de detalhes ao clicar em qualquer lugar dentro do contêiner
  detailsContainer.addEventListener('click', () => {
    detailsContainer.style.display = 'none';
  });
}

// Função para filtrar personagens
function filterCharacters(name, race, gender) {
  if (name === '' && race === '' && gender === '') {
    // Se todos os campos estiverem vazios, renderiza os 10 primeiros personagens
    renderCharacterList(allCharacters.slice(0, 10));
    return;
  }

  const filteredCharacters = allCharacters.filter(character => {
    const nameMatches = name === '' || character.name.toLowerCase().includes(name.toLowerCase());
    const raceMatches = race === '' || character.race.toLowerCase().includes(race.toLowerCase());
    const genderMatches = gender === '' || character.gender.toLowerCase() === gender.toLowerCase();
    return nameMatches && raceMatches && genderMatches;
  });
  
  renderCharacterList(filteredCharacters);
}

// Adiciona eventos ao formulário de busca
document.getElementById('search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const nameSearch = document.getElementById('name-search').value;
  const raceSearch = document.getElementById('race-search').value;
  const genderSearch = document.getElementById('gender-search').value;
  filterCharacters(nameSearch, raceSearch, genderSearch);
});

// Adiciona evento de tecla no select para pesquisar ao pressionar Enter
const raceSelect = document.getElementById('race-search');
raceSelect.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const nameSearch = document.getElementById('name-search').value;
    const genderSearch = document.getElementById('gender-search').value;
    filterCharacters(nameSearch, raceSelect.value, genderSearch);
  }
});

// Adiciona evento de tecla no select para pesquisar ao pressionar Enter
const genderSelect = document.getElementById('gender-search');
genderSelect.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const nameSearch = document.getElementById('name-search').value;
    const raceSearch = raceSelect.value; // Use o valor do select de raça
    filterCharacters(nameSearch, raceSearch, genderSelect.value);
  }
});

function favoriteCharacter(character) {
  if (!favoriteCharacters.some(fav => fav.id === character.id)) {
    favoriteCharacters.push(character);
    localStorage.setItem('favorites', JSON.stringify(favoriteCharacters));
    renderFavoritesList();
  }
}

function unfavoriteCharacter(character) {
  favoriteCharacters = favoriteCharacters.filter(c => c.id !== character.id);
  localStorage.setItem('favorites', JSON.stringify(favoriteCharacters));
  renderFavoritesList();
}

function renderFavoritesList() {
  const favoritesList = document.getElementById('favorites-list');
  favoritesList.innerHTML = ''; // Limpa a lista antes de renderizar novamente

  favoriteCharacters.forEach(character => {
    const listItem = document.createElement('li');
    listItem.dataset.characterId = character.id;

    const img = document.createElement('img');
    img.src = character.image;
    img.alt = character.name;

    const text = document.createElement('span');
    text.textContent = `${character.name} - ${character.race}`;

    listItem.appendChild(img);
    listItem.appendChild(text);
    favoritesList.appendChild(listItem);

    const unfavoriteButton = document.createElement('button');
    unfavoriteButton.className = 'unfavorite';
    unfavoriteButton.textContent = 'Desfavoritar';

    listItem.appendChild(unfavoriteButton);

    unfavoriteButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Impede que o clique no botão desfavoritar expanda o item
      unfavoriteCharacter(character);
      updateFavoriteButtons(); // Atualiza os botões de favoritos na lista principal
    });

    listItem.addEventListener('click', () => {
      showCharacterDetails(character);
    });
  });

  // Fecha o pop-up se não houver favoritos
  const popup = document.getElementById('favorites-popup');
  if (favoriteCharacters.length === 0) {
    popup.style.display = 'none';
  }
}

// Função para atualizar o texto do botão de favoritos de cada personagem
function updateFavoriteButtons() {
  const characterItems = document.querySelectorAll('#character-list li');
  characterItems.forEach(item => {
    const characterId = item.dataset.characterId; // Usando um data-attribute para identificar o personagem
    const favoriteButton = item.querySelector('button.favorite');

    if (favoriteCharacters.some(fav => fav.id == characterId)) {
      favoriteButton.textContent = 'Desfavoritar';
    } else {
      favoriteButton.textContent = 'Favorite';
    }
  });
}

// Função para abrir e fechar o pop-up de favoritos
document.getElementById('favorites-button').addEventListener('click', () => {
  const popup = document.getElementById('favorites-popup');

  // Verifica se há personagens favoritos antes de abrir
  if (favoriteCharacters.length > 0) {
    popup.style.display = 'block'; // Mostra o pop-up
  } else {
    alert('Você não tem personagens favoritos no momento.');
  }
});

// Fecha o pop-up de favoritos em um botão de fechar
window.addEventListener('click', (event) => {
  const popup = document.getElementById('favorites-popup');
  if (event.target === popup || event.target.matches('.close-popup')) {
    popup.style.display = 'none'; // Fecha o pop-up
  }
});

// Carrega os dados da API e renderiza a lista de personagens
fetch('https://dragonball-api.com/api/characters?limit=100')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log(data); // Verifique a estrutura dos dados no console
    allCharacters = data.items; // Acessa a propriedade 'items' que contém o array de personagens

    // Renderiza apenas 10 personagens inicialmente
    renderCharacterList(allCharacters.slice(0, 10));
  })
  .catch(error => console.error('Erro ao carregar dados:', error));

// Quando a página carregar, renderiza a lista de favoritos e carrega os favoritos salvos
document.addEventListener('DOMContentLoaded', () => {
  renderFavoritesList();
  const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
  if (storedFavorites) {
    favoriteCharacters = storedFavorites;
    renderFavoritesList();
  }
});
