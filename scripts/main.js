document.getElementById("noText").style.display = "none";
//var srOffSet = 10;

$(document).ready(function() {
  getArticles();
  getMoreArticles();
  $("#research").keypress(function(event) {
    if (event.keyCode === 13) {
      $(".fa-search").click();
    }
  });
});

window.onscroll = function(ev) {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    document.getElementById("keepGoing").style.opacity = "0.5";
    $("#keepGoing").fadeIn(200);
  }
};

function getMoreArticles() {
  var srOffSet = 10;
  $("#keepGoing").click(function() {
    srOffSet += 10;
    var researched = document.getElementById("research").value;
    var url = "https://en.wikipedia.org/w/api.php?callback=?";
    var param = {
      action: "query",
      list: "search",
      srsearch: researched,
      srprop: "snippet",
      sroffset: srOffSet,
      format: "json"
    };

    $.getJSON(url, param, function(data, status) {
      $.each(data.query.search, function(k, v) {
        var title = JSON.stringify(v.title);
        var pageId = JSON.stringify(v.pageid);
        var articleUrl =
          "https://en.wikipedia.org/w/api.php?callback=?&action=query&pageids=" +
          pageId +
          "&prop=info|extracts&exintro=&explaintext=&inprop=url&format=json&formatversion=2";
        $.getJSON(articleUrl, function(articleDatas) {
          $.each(articleDatas.query.pages, function(key, value) {
            //console.log(value.extract.substr(0, 75));
            var abstract = JSON.stringify(value.extract.substr(0, 75));
            var fullUrlLink = value.fullurl;
            var container =
              "<div class='box'>" +
              "<p id='articleTitle'>" +
              title.substring(0, 30).replace(/\"/g, "") +
              "</p>" +
              "<hr>" +
              "<p id='articleSnippet'>" +
              "<i>" +
              abstract.substring(0, 50).replace(/\\|"/g, "") +
              "..." +
              "</i>" +
              "</p>" +
              "<p id='articleLink'>" +
              "<a href=" +
              fullUrlLink +
              " target='_blank'>" +
              "I want to know more!" +
              "</a></p></div>";

            $(".articles").append(container);
          });
        });
      });
    });
  });
}

function getArticles() {
  $("#newArticle").click(function() {
    $(".articles").html("");
    var researched = document.getElementById("research").value;
    var url = "https://en.wikipedia.org/w/api.php?callback=?";
    var param = {
      action: "query",
      list: "search",
      srsearch: researched,
      format: "json"
    };
    if (researched == "") {
      document.getElementById("noText").style.display = "block";
      //setTimeout(function(){ $("#noText").fadeOut("slow")  }, 3000);
      $("#noText").fadeOut(3000, "swing");
    }
    $.getJSON(url, param, function(data, status) {
      var totalHits = data.query.searchinfo.totalhits;
      $("#totalHits").empty();
      $("#totalHits").append(
        "<span>" +
          totalHits +
          " results found " +
          "for the term " +
          researched +
          " !" +
          "</span>"
      );
      document.getElementById("totalHits").style.display = "block";
      $("#totalHits").fadeOut(5000, "linear");
      $.each(data.query.search, function(k, v) {
        var title = JSON.stringify(v.title);
        var pageId = JSON.stringify(v.pageid);
        var articleUrl =
          "https://en.wikipedia.org/w/api.php?callback=?&action=query&pageids=" +
          pageId +
          "&prop=info|extracts&exintro=&explaintext=&inprop=url&format=json&formatversion=2";

        $.getJSON(articleUrl, function(articleDatas) {
          $.each(articleDatas.query.pages, function(key, value) {
            var abstract = JSON.stringify(value.extract.substr(0, 75));
            var fullUrlLink = value.fullurl;
            var container =
              "<div class='box'>" +
              "<p id='articleTitle'>" +
              title.substring(0, 30).replace(/\"/g, "") +
              "</p>" +
              "<hr>" +
              "<p id='articleSnippet'>" +
              "<i>" +
              abstract.substring(0, 50).replace(/\\|"/g, "") +
              "..." +
              "</i>" +
              "</p>" +
              "<p id='articleLink'>" +
              "<a href=" +
              fullUrlLink +
              " target='_blank'>" +
              "I want to know more!" +
              "</a></p></div>";

            $(".articles").append(container);
          });
        });
      });
    });
  });
}

$("#keepGoing").click(function() {
  var currentHeight = document.body.clientHeight;
  $("html, body").animate({ scrollTop: currentHeight }, 1500);
});
