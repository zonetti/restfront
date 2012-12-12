$(document).ready(function(){

  var editor, _history = [];

  editor = CodeMirror.fromTextArea(
    document.getElementById('request-body'),
    {
      mode: {
        name: 'javascript',
        json: true
      },
      theme: 'lesser-dark',
      lineNumbers: true,
      lineWrapping: true
    }
  );

  window.prettyPrint && prettyPrint();

  // Requesting

  $('button.req').click(function() {
    if ($(this).hasClass('disabled')) return false;
    var btn = $(this);

    $('button').addClass('disabled');
    $('.progress').addClass('active');
    $('.progress').addClass('progress-striped');
    $('.bar').width('35%');
    addHistory($('#url').val());

    $.ajax({
      url: '/request',
      type: 'post',
      data: {
        uri: $('#url').val(),
        method: btn.html(),
        json: JSON.parse(editor.getValue())
      },
      success: function(res) {
        res = JSON.stringify(res, null, 2);
        $('pre.prettyprint.linenums').html(res);
        prettyPrint();
        $('.bar').width('100%');
      },
      error: function(err) {
        alert('Error requesting server');
      },
      complete: function() {
        setTimeout(function() {
          $('.progress').removeClass('active');
          $('.progress').removeClass('progress-striped');
        }, 800);
        setTimeout(function() {
          $('button').removeClass('disabled');
          $('.bar').width('0%');
        }, 1000);
      }
    });

  });

  // GET request on hit 'enter'

  $('#url').keydown(function(e) {
    if (e.keyCode == 13) {
      $('#GET').trigger('click');
    }
  })

  // Clear history

  $('#clear').click(function() {
    if ($(this).hasClass('disabled')) return false;
    _history = [];
    $(this).fadeOut('slow');
    $('#history').fadeOut('slow');
    $('#history').html('');
  });

  $('#history li a').live('click', function() {
    $('#url').val($(this).html());
  });
  
  $('#history li a').live('contextmenu', function() {
    return false;
  });

  $('#history li a').live('mousedown', function(e) {
    if (e.which === 3) {
      removeHistory($(this));
    }
  });

  $('#url').val('http://www.reddit.com/.json');

  function addHistory(url) {
    if (url == '') return false;
    for (var i in _history) {
      if (_history[i] == url) return false;
    }
    _history.splice(0, 0, url);
    updateHistory();
  }

  function removeHistory(a) {
    var li = a.parents('li');
    for (var i in _history) {
      if (_history[i] == a.html()) {
        _history.splice(i, 1);
        li.fadeOut('slow');
        if (_history.length == 0) {
          $('#clear').fadeOut('slow');
        }
      }
    }
  }

  function updateHistory() {
    $('#clear').fadeIn('normal');
    $('#history').html('');
    for (var i in _history) {
      $('#history').append('<li><a href="#">' + _history[i] + '</a></li>');
    }
    $('#history').fadeIn('normal');
  }

});