/*各種変数定義*/
var buf = new ArrayBuffer(4);       //32bitのバッファ用意
var data_view = new DataView(buf);  //用意したバッファにDataViewクラスを介して入出力
var min, max;                 //カラーマップの最大、最小、各色の差
var new_crs_simple = L.Util.extend({}, L.CRS.Simple, {
  wrapLng: [0,  240],
  wrapLat: [0, -240]
});
var map = L.map('map',{
  center: [0, 0],
  crs:new_crs_simple,
  //crs:L.CRS.Simple,
  maxZoom: 4,//9以上で表示がおかしくなる?
  minZoom: 0,
  zoom: 0,
});

//layer_1405[i] =
var layer_PT = L.gridLayer.numDataGroup('4dimImg',{
  tileSize : new L.Point(256, 256),
  name: "PT",
  operation: "",
  contour: false,
  shade:   true,
  isGrid : true,
  max_z : 4
});

map.addLayer(layer_PT);
map.on('click', function(e){
  var coords = lonlatToCoords(e.latlng.lat, e.latlng.lng, layer_PT);
  var point  = lonlatToTlPoint(e.latlng.lat, e.latlng.lng, layer_PT);
  layer_PT.getNum(coords, point);
  //  console.log( pixelData.toPrecision(5) );
});
var playback = function(){
  active = layer_PT.switchLayer("t", 1);
  layer_PT.redraw();
  $("#slider_t").slider("value", active);
}
var rewind = function(){
  active = layer_PT.switchLayer("t", -1);
  layer_PT.redraw();
  $("#slider_t").slider("value", active);
}

var testTimer, play = 0;
function startTimer(){
  testTimer=setInterval(playback,1000);
}

function stopTimer(){
  clearInterval(testTimer);
}

map.on('move', function(e){
  drawText(layer_PT);
});
map.on('keypress', function(e){
  var active;
  /*アクティブレイヤ切り替え*/
  if(e.originalEvent.key === "w"){
    active = layer_PT.switchLayer("h", 1);
    //layer_PT.redraw();
    $("#slider").slider("value", active);
  }
  if(e.originalEvent.key === "s"){
    active = layer_PT.switchLayer("h", -1);
    //layer_PT.redraw();
    $("#slider").slider("value", active);
  }

  if(e.originalEvent.key === "d"){
    playback();
  }
  if(e.originalEvent.key === "a"){
    rewind();
  }

  if(e.originalEvent.key === "h"){
    startTimer();
    play = 1;
  }

  if(e.originalEvent.key === "j"){
    stopTimer();
    play = 0;
  }

  /*断面切り替え*/
  if(e.originalEvent.key === "1"){
    layer_PT.setURL(0);
  }
  if(e.originalEvent.key === "2"){
    layer_PT.setURL(1);
  }
  if(e.originalEvent.key === "3"){
    layer_PT.setURL(2);
  }

  /*カラーマップの範囲設定*/
  if(e.originalEvent.key === "r"){
      updateClrmapRange(layer_PT);
      //layer_PT.redraw();
  }

  if(e.originalEvent.key === "c"){
      var input = get2digitsNum( window.prompt('colormap') );
      try{

        layer_PT._colormap = eval( "clrmap_"+input );
      }catch{
        console.log("無効な値が入力されました");
      }
      //layer_PT.redraw();
  }
  layer_PT.redraw();
  drawText(layer_PT);
});
