gapi.load("client", loadclient);

function loadclient() {
    gapi.client.setApiKey("AIzaSyDhybqJrcwadXE8VkXdzD6UkN_XEQar01o");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then (function() {console.log("GAPI client loaded for API");},
    function(err) { console.error("Error loading GAPI client for API", err)}
    );
}

const ytForm = document.getElementById("yt-form");
const keywordInput = document.getElementById("keyword-input");

const orderInput = document.getElementById("order-input");
const videoList = document.getElementById("videoListContainer");
var pageToken = "";

ytForm.addEventListener("submit", (e) => {
  e.preventDefault();
  execute();
});

function paginate(e, obj) {
  e.preventDefault();
  pageToken = obj.getAttribute("data-id");
  execute();
}

// Make sure the client is loaded before calling this method.
function execute() {
  const searchString = keywordInput.value;
  const maxresult = 12;
  const orderby = "viewCount";

  var arr_search = {
    part: "snippet",
    type: "video",
    order: orderby,
    maxResults: maxresult,
    q: searchString,
  };

  if (pageToken != "") {
    arr_search.pageToken = pageToken;
  }

  return gapi.client.youtube.search.list(arr_search).then(
    function (response) {
      // Handle the results here (response.result has the parsed body).
      const listItems = response.result.items;
      if (listItems) {
        let output = "<ul>";

        listItems.forEach((item) => {
          const videoId = item.id.videoId;
          const videoTitle = item.snippet.title;
          output += `
                <div class="col-xs-4 col-sm-4 col-md-3">
                <div class="item r" data-id="item-2" data-src="https://www.youtube.com/watch?v=${videoId}">
                    <div class="item-media ">
                        <a href="https://www.youtube.com/watch?v=${videoId}" id='GoVideo' class="item-media-content" style="background-image: url('http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg');"></a>
                        <div class="item-overlay center">
                            <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank"><button class="btn-playpause">Play</button></a>
                        </div>
                      
                    </div>
                    <div class="item-info">
                        <div class="item-overlay bottom text-right">
                            <a href="#" class="btn-favorite"><i class="fa fa-heart-o"></i></a>
                            <a href="#" class="btn-more" data-toggle="dropdown"><i class="fa fa-ellipsis-h"></i></a>
                            <div class="dropdown-menu pull-right black lt"></div>
                        </div>
                        <div class="item-title text-ellipsis">
                            <a href="#">${videoTitle}</a>
                        </div>

                    </div>
                </div>
            </div>
                `;
        });
        output += "</ul>";

        if (response.result.prevPageToken) {
          output += `<a class="paginate2" href="#" data-id="${response.result.prevPageToken}" onclick="paginate(event, this)">Prev</a>`;
        }

        if (response.result.nextPageToken) {
          output += `<a href="#" class="paginate" data-id="${response.result.nextPageToken}" onclick="paginate(event, this)">Next</a>`;
        }

        // Output list
        videoList.innerHTML = output;
      }
    },
    function (err) {
      console.error("Execute error", err);
    }
  );
}