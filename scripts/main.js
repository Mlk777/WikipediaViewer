document.getElementById('noText').style.display = 'none';

$(document).ready(() => {
  getArticles();
  getMoreArticles();
  $('#research').keypress(event => {
    if (event.keyCode === 13) {
      $('.fa-search').click();
    }
  });
});

window.onscroll = ev => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
    document.getElementById('keepGoing').style.opacity = '0.5';
    $('#keepGoing').fadeIn(200);
  }
};

const getMoreArticles = () => {
  let sroffset = 10;
  $('#keepGoing').click(() => {
    sroffset += 10;
    const researched = document.getElementById('research').value;
    const url = 'https://en.wikipedia.org/w/api.php?callback=?';
    const param = {
      action: 'query',
      list: 'search',
      srsearch: researched,
      srprop: 'snippet',
      sroffset,
      format: 'json'
    };

    $.getJSON(url, param, (data, status) => {
      $.each(data.query.search, function(k, v) {
        const title = JSON.stringify(v.title);
        const pageId = JSON.stringify(v.pageid);
        const articleUrl = `https://en.wikipedia.org/w/api.php?callback=?&action=query&pageids=${pageId}&prop=info|extracts&exintro=&explaintext=&inprop=url&format=json&formatversion=2`;
        $.getJSON(articleUrl, articleDatas => {
          $.each(articleDatas.query.pages, (key, value) => {
            //console.log(value.extract.substr(0, 75));
            const abstract = JSON.stringify(value.extract.substr(0, 75));
            const fullUrlLink = value.fullurl;
            const container = `<div class="box">
              <p id="articleTitle">
                ${title.substring(0, 30).replace(/\"/g, '')}
              </p>
                <hr id="hr">
                <p id="articleSnippet">
                  <i>
                    ${abstract.substring(0, 50).replace(/\\|"/g, '')}...
                  </i>
                </p>
                <p id="articleLink">
                  <a href="${fullUrlLink}target="_blank">I want to know more!</a>
                </p>
            </div>`;

            $('.articles').append(container);
          });
        });
      });
    });
  });
};

const getArticles = () => {
  $('#newArticle').click(() => {
    $('.articles').html('');
    const researched = document.getElementById('research').value;
    const url = 'https://en.wikipedia.org/w/api.php?callback=?';
    const param = {
      action: 'query',
      list: 'search',
      srsearch: researched,
      format: 'json'
    };
    if (researched == '') {
      document.getElementById('noText').style.display = 'block';
      //setTimeout(function(){ $("#noText").fadeOut("slow")  }, 3000);
      $('#noText').fadeOut(3000, 'swing');
    }
    $.getJSON(url, param, (data, status) => {
      const totalHits = data.query.searchinfo.totalhits;
      $('#totalHits').empty();
      $('#totalHits').append(
        `<span>${totalHits} results found for the term ${researched} !</span>`
      );
      document.getElementById('totalHits').style.display = 'block';
      $('#totalHits').fadeOut(5000, 'linear');
      $.each(data.query.search, function(k, v) {
        var title = JSON.stringify(v.title);
        var pageId = JSON.stringify(v.pageid);
        var articleUrl = `https://en.wikipedia.org/w/api.php?callback=?&action=query&pageids=${pageId}&prop=info|extracts&exintro=&explaintext=&inprop=url&format=json&formatversion=2`;

        $.getJSON(articleUrl, articleDatas => {
          $.each(articleDatas.query.pages, (key, value) => {
            const abstract = JSON.stringify(value.extract.substr(0, 75));
            const fullUrlLink = value.fullurl;
            const container = `<div class="box">
              <p id="articleTitle">
                ${title.substring(0, 30).replace(/\"/g, '')}
              </p>
              <hr id="hr">
              <p id="articleSnippet">
                <i>
                  ${abstract.substring(0, 50).replace(/\\|"/g, '')}...
                </i>
              </p>
              <p id="articleLink">
                <a href="${fullUrlLink}" target="_blank">
                  I want to know more!
                </a>
              </p>
              </div>`;

            $('.articles').append(container);
          });
        });
      });
    });
  });
};

$('#keepGoing').click(() => {
  const currentHeight = document.body.clientHeight;
  $('html, body').animate(
    {
      scrollTop: currentHeight
    },
    1500
  );
});
