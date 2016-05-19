window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

function process(Data) {
    source = context.createBufferSource(); // Create Sound Source
    context.decodeAudioData(Data, function(buffer) {
        source.buffer = buffer;
        source.connect(context.destination);
        source.start(context.currentTime);
    })
}

function loadSound(text) {
  var request = new XMLHttpRequest();
  request.open("POST", "/test", true);
  request.responseType = "arraybuffer";
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  var body = 'text=' + encodeURIComponent(text);

  request.send(body);
  request.onload = function() {
      var data = request.response;
      console.log(data);
      process(data);
  };
};

$('button').click(function() {
    console.log('hello, we are testing hapi and ivona');
    var text = $('textarea').val() || 'Привет! Меня зовут Максим.';
    loadSound(text)
});
