const APIController = (function () {
  const clientId = "639fb387e0014c1998f0aa81ff6121df";
  const clientSecret = "03cb54bd683247bfac4d217fa2eaaded";

  // private methods
  const _getToken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });

    const data = await result.json();
    return data.access_token;
  };

  const _getGenres = async (token) => {
    const result = await fetch(
      `https://api.spotify.com/v1/browse/categories?locale=sv_US`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );

    const data = await result.json();
    return data.categories.items;
  };

  const _getPlaylistByGenre = async (token, genreId) => {
    const limit = 10;

    const result = await fetch(
      `https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );

    const data = await result.json();
    return data.playlists.items;
  };

  const _getTracks = async (token, tracksEndPoint) => {
    const limit = 5;

    const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await result.json();
    return data.items;
  };

  const _getTrack = async (token, trackEndPoint) => {
    const result = await fetch(`${trackEndPoint}`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await result.json();
    return data;
  };

  return {
    getToken() {
      return _getToken();
    },
    getGenres(token) {
      return _getGenres(token);
    },
    getPlaylistByGenre(token, genreId) {
      return _getPlaylistByGenre(token, genreId);
    },
    getTracks(token, tracksEndPoint) {
      return _getTracks(token, tracksEndPoint);
    },
    getTrack(token, trackEndPoint) {
      return _getTrack(token, trackEndPoint);
    },
  };
})();

// UI Module
const UIController = (function () {
  //object to hold references to html selectors
  const DOMElements = {
    selectGenre: "#select_genre",
    selectPlaylist: "#select_playlist",
    buttonSubmit: "#btn_submit",
    divSongDetail: "#song-detail",
    hfToken: "#hidden_token",
    divSonglist: ".song-list",
  };

  //public methods
  return {
    //method to get input fields
    inputField() {
      return {
        genre: document.querySelector(DOMElements.selectGenre),
        playlist: document.querySelector(DOMElements.selectPlaylist),
        tracks: document.querySelector(DOMElements.divSonglist),
        submit: document.querySelector(DOMElements.buttonSubmit),
        songDetail: document.querySelector(DOMElements.divSongDetail),
      };
    },

    // need methods to create select list option
    createGenre(text, value) {
      const html = `<option  class="dropdown-item dropdown-menu" value="${value}">${text}</option>`;
      document
        .querySelector(DOMElements.selectGenre)
        .insertAdjacentHTML("beforeend", html);
    },

    createPlaylist(text, value) {
      const html = `<option  class="dropdown-item dropdown-menu" value="${value}">${text}</option>`;
      document
        .querySelector(DOMElements.selectPlaylist)
        .insertAdjacentHTML("beforeend", html);
    },

    // need method to create a track list group item
    createTrack(id, name, artist, img) {
      const html = `
          <div class="col-xs-12">
          <div class="item r" data-id="item-11" >
          <div class="item-media ">
            <a href="track.detail.html" class="item-media-content" style="background-image: url(${img});"></a>
            <div class="item-overlay center">
            <button  class="btn-playpause" id=${id}>Play</button>
            </div>
          </div>
          <div class="item-info">
            <div class="item-title text-ellipsis">
            <a >${name}</a>
            </div>
            <div class="item-author text-sm text-ellipsis ">
            <a >${artist}</a>
            </div>
          </div>
        </div>
      </div>           
          
          `;
      document
        .querySelector(DOMElements.divSonglist)
        .insertAdjacentHTML("beforeend", html);
    },

    // need method to create the song detail
    createTrackDetail(img, title, artist) {
      const detailDiv = document.querySelector(DOMElements.divSongDetail);
      // any time user clicks a new song, we need to clear out the song detail div
      detailDiv.innerHTML = "";

      const html = `<div class="padding b-b">
          <div class="row-col">
            <div class="col-sm w w-auto-xs m-b">
              <div class="item w r">
                <div class="item-media">
                  <div class="item-media-content" style="background-image: url(${img});"></div>
                </div>
              </div>
            </div>
            <div class="col-sm">
              <div class="p-l-md no-padding-xs">
                <div class="page-title">
                  <h1 class="inline">${title}</h1>
                </div>
                <p class="item-desc text-ellipsis text-muted" data-ui-toggle-class="text-ellipsis"> ${artist}</p>
                <div class="item-action m-b">
                  <a class="btn btn-icon white rounded btn-share pull-right" data-toggle="modal" data-target="#share-modal"><i class="fa fa-share-alt"></i></a>
                  <button class="btn-playpause text-primary m-r-sm"></button> 
                  <span class="text-muted">2356</span>
                  <a class="btn btn-icon rounded btn-favorite"><i class="fa fa-heart-o"></i></a> 
                  <span class="text-muted">232</span>
                  <div class="inline dropdown m-l-xs">
                    <a class="btn btn-icon rounded btn-more" data-toggle="dropdown"><i class="fa fa-ellipsis-h"></i></a>
                    <div class="dropdown-menu pull-right black lt"></div>
                  </div>
                </div>
                <div class="item-meta">
                  <a class="btn btn-xs rounded white">Pop</a> <a class="btn btn-xs rounded white">Happy</a>
                </div>
              </div>
            </div>
        </div>
        </div>        `;

      detailDiv.insertAdjacentHTML("beforeend", html);
    },
    resetTrackDetail() {
      this.inputField().songDetail.innerHTML = "";
    },

    resetTracks() {
      this.inputField().tracks.innerHTML = "";
      this.resetTrackDetail();
    },

    resetPlaylist() {
      this.inputField().playlist.innerHTML = "";
      this.resetTracks();
    },

    storeToken(value) {
      document.querySelector(DOMElements.hfToken).value = value;
    },

    getStoredToken() {
      return {
        token: document.querySelector(DOMElements.hfToken).value,
      };
    },
  };
})();

const APPController = (function (UICtrl, APICtrl) {
  // get input field object ref
  const DOMInputs = UICtrl.inputField();

  // get genres on page load
  const loadGenres = async () => {
    //get the token
    const token = await APICtrl.getToken();
    //store the token onto the page
    UICtrl.storeToken(token);
    //get the genres
    const genres = await APICtrl.getGenres(token);
    //populate our genres select element
    genres.forEach((element) => UICtrl.createGenre(element.name, element.id));
  };

  // create genre change event listener
  DOMInputs.genre.addEventListener("change", async () => {
    //reset the playlist
    UICtrl.resetPlaylist();
    //get the token that's stored on the page
    const token = UICtrl.getStoredToken().token;
    // get the genre select field
    const genreSelect = UICtrl.inputField().genre;
    // get the genre id associated with the selected genre
    const genreId = genreSelect.options[genreSelect.selectedIndex].value;
    // ge the playlist based on a genre
    const playlist = await APICtrl.getPlaylistByGenre(token, genreId);
    // create a playlist list item for every playlist returned
    playlist.forEach((p) => UICtrl.createPlaylist(p.name, p.tracks.href));
  });

  // create submit button click event listener
  DOMInputs.submit.addEventListener("click", async (e) => {
    // prevent page reset
    e.preventDefault();
    // clear tracks
    UICtrl.resetTracks();
    //get the token
    const token = UICtrl.getStoredToken().token;
    // get the playlist field
    const playlistSelect = UICtrl.inputField().playlist;
    // get track endpoint based on the selected playlist
    const tracksEndPoint =
      playlistSelect.options[playlistSelect.selectedIndex].value;
    // get the list of tracks
    const tracks = await APICtrl.getTracks(token, tracksEndPoint);
    // create a track list item
    tracks.forEach((el) =>
      UICtrl.createTrack(
        el.track.href,
        el.track.name,
        el.track.artists[0].name,
        el.track.album.images[2].url
      )
    );
  });

  // create song selection click event listener
  DOMInputs.tracks.addEventListener("click", async (e) => {
    // prevent page reset
    e.preventDefault();
    UICtrl.resetTrackDetail();
    // get the token
    const token = UICtrl.getStoredToken().token;
    // get the track endpoint
    const trackEndpoint = e.target.id;
    //get the track object
    const track = await APICtrl.getTrack(token, trackEndpoint);
    // load the track details
    UICtrl.createTrackDetail(
      track.album.images[2].url,
      track.name,
      track.artists[0].name
    );
  });

  return {
    init() {
      loadGenres();
    },
  };
})(UIController, APIController);
// will need to call a method to load the genres on page load
APPController.init();
