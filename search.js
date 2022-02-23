$(document).ready(function () {
  $('#loc-submit').click(function (e) {
    e.preventDefault();
    query = $('#loc-query-id').val();
    console.log('Q', query);
    url = getQueryUrl(query);
    Search(url);
    $('.close').click();
  });

  function getQueryUrl(query) {
    return (url = 'https://loc.gov/pictures/search/?q=' + query + '&fo=json');
  }

  function Search(url) {
    $('#links').empty();
    console.log('searching:', url);
    settings = {
      url: url,
      type: 'GET',
      crossDomain: true,
      dataType: 'jsonp',
      success: function (data) {
        // console.log('success');
        // console.log(JSON.stringify(data));
        $('.start-hidden').show();
        $('#result').html(JSON.stringify(data, null, 2));
        metadata = GetFullImageUrls(data);
        i = 0;
        metadata.urls.forEach((imgUrl) => {
          title = metadata.titles[i];
          displayImage(imgUrl, title);
          i++;
        });
        addPagination(data.pages);
      },
      error: function () {
        alert('Failed!');
      },
    };

    $.ajax(settings);
  }

  function GetFullImageUrls(data) {
    items = data.results;
    fullUrls = items.map((i) => {
      return i.image.full;
    });
    titles = items.map((i) => {
      return i.title;
    });
    return { urls: fullUrls, titles: titles };
  }

  function addPagination(pages) {
    $('#nav').empty();
    if (pages.previous) {
      addPageButton(pages.previous, 'previous');
    }
    if (pages.next) {
      addPageButton(pages.next, 'next');
    }
  }

  function addPageButton(url, label) {
    button = $(
      '<input type="button" class="btn btn-warning me-2" id="' +
        label +
        '" data-url="' +
        url +
        '&fo=json" value="' +
        label +
        '">'
    ).bind('click', function () {
      url = $(this).data('url');
      Search(url);
    });
    $('#nav').append(button);
  }

  function displayImage(imgUrl, title = '') {
    img =
      '<li><img src="' +
      imgUrl +
      '" class="fetch-img img-orig clickable" data-title="' +
      title +
      '"></li>';
    if (
      !imgUrl.includes('notdigitized') &&
      !imgUrl.includes('500x500_look.png') &&
      !imgUrl.includes('500x500_TGM.png')
    ) {
      $('#links').append(img);
      $('.clickable')
        .unbind('click')
        .click(function () {
          imgLink = $(this)[0].src;
          title = $(this).data('title');
          console.log(title);
          $('.modal-title').html(title);
          $('#image-modal-image').attr('src', imgLink);
          $('#image-modal').modal('show');
        });
    }
  }
});
