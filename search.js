$(document).ready(function () {
  $('#loc-submit').click(function (e) {
    e.preventDefault();
    query = $('#loc-query-id').val();
    console.log('Q', query);
    url = getQueryUrl(query);
    Search(url);
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
        imgUrls = GetFullImageUrls(data);
        imgUrls.forEach((imgUrl) => {
          displayOrigAndCorrectedGetters(imgUrl);
        });
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
    return fullUrls;
  }

  function displayOrigAndCorrectedGetters(imgUrl) {
    orig = '<li><img src="' + imgUrl + '" class="fetch-img img-orig"></li>';
    fixed =
      '<li><img src="' + fixUrl(imgUrl) + '" class="fetch-img img-fixed"></li>';
    pair = '<ul>' + orig + fixed + '</ul>';
    $('#links').append(pair);
  }

  function fixUrl(imgUrl) {
    return imgUrl.replace(
      'https://www.loc.gov/pictures/cdn/service/pnp',
      'http://loc.gov/pictures/lcweb2/service/pnp'
    );
  }
});
