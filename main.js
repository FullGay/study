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
  maxZoom: 4,
  minZoom: 0,
  zoom: 0,
});
/*データタイル、ビュータイルのインスタンス生成*/
var dataLayer = L.gridLayer.data({
  tileSize : new L.Point(240, 240)
});
var viewLayer = L.gridLayer.view({
  tileSize : new L.Point(240, 240),
  dtLayerObj : dataLayer,
  isGrid : false
});
/*クロスヘアインスタンス生成*/
var cross = L.crosshairs({
  style: {
    opacity: 1,
    fillOpacity: 0,
    weight: 1.5,
    color: '#fff',
    radius: 15
  }
});
map.addLayer( dataLayer );//addLayerしないとtiles[]が生成されない
map.addLayer( viewLayer );
cross.addTo(map);
drawText(viewLayer);

/*イベント*/
/*クリック時　対象ピクセルの値を表示*/
map.on('click', function(e){
  var coords = lonlatToCoords(e.latlng.lat, e.latlng.lng, dataLayer);
  var point  = lonlatToTlPoint(e.latlng.lat, e.latlng.lng, dataLayer);
  var canvasElement = dataLayer.getCanvasElement( coords );
  var canvasElement_view = viewLayer.getCanvasElement( coords );
  var pixelData = getPixelData( canvasElement, point );
  compRGB(canvasElement, canvasElement_view, point, e.latlng);
  console.log( pixelData.toPrecision(5) );
});
/*キー押下時　再描画、rキー押下時　range再定義*/
map.on('keypress', function(e){
  if(e.originalEvent.key ==="r"){
      createColormap(viewLayer);
  }
  dataLayer.redraw();
  viewLayer.redraw();
  drawText(viewLayer);
});

/*memo*/
//dataLayer.on('tileload', function(e) { console.log(e); }); //タイル読み込み時に発火
