export const getRandomIndex = length => {
  return Math.floor(Math.random() * length);
};

export const convertPlayedEpisodesArrayToObject = playedEpisodesArr => {
  let playedEpisodes = {};
  playedEpisodesArr.forEach(episode => {
    playedEpisodes[episode.title] = episode;
  });
  return playedEpisodes;
};

export const getRandomNonRepeatingIndices = (desiredNumEpisodes, length) => {
  let indices = {};
  let currentIndex;
  while (Object.keys(indices).length < desiredNumEpisodes) {
    currentIndex = Math.floor(Math.random() * length);
    indices[currentIndex] = true;
  }

  return Object.keys(indices).map(index => Number(index));
};

export const setLocalStorage = (stateType, actionPayload, key) => {
  const localStorageState = JSON.parse(localStorage.getItem(stateType));
  localStorageState[key] = actionPayload;
  localStorage.setItem(stateType, JSON.stringify(localStorageState));
  return JSON.parse(localStorage.getItem("podcastState"));
};

export const getGenreIdFromGenreName = (name, genres) => {
  for (let i = 0; i < genres.length; i++) {
    if (genres[i].name === name) {
      return genres[i].id;
    }
  }
  return new Error("There is no genre with that name available.");
};
