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
var dataLayer = L.gridLayer.data('dataTile/U/',{
  tileSize : new L.Point(240, 240)
});

var dataLayer_PT = L.gridLayer.data('dataTile/PT/',{
  tileSize : new L.Point(240, 240)
});

var viewLayer = L.gridLayer.view({
  tileSize : new L.Point(240, 240),
  dtLayerObj : dataLayer,
  isGrid : false
});

var viewLayer_PT = L.gridLayer.view({
  tileSize : new L.Point(240, 240),
  dtLayerObj : dataLayer_PT,
  isGrid : true
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
map.addLayer( dataLayer_PT );//addLayerしないとtiles[]が生成されない
map.addLayer( viewLayer_PT );
cross.addTo(map);
drawText(viewLayer_PT);

/*イベント*/
/*クリック時　対象ピクセルの値を表示*/
map.on('click', function(e){
  var coords = lonlatToCoords(e.latlng.lat, e.latlng.lng, dataLayer_PT);
  //var coords  = new L.Point(tmp.x, tmp.y);
  //coords.z = tmp.z;
  var point  = lonlatToTlPoint(e.latlng.lat, e.latlng.lng, dataLayer_PT);
  var canvasElement = dataLayer_PT.getCanvasElement( coords );
  var canvasElement_view = viewLayer_PT.getCanvasElement( coords );
  var pixelData = getPixelData( canvasElement, point );
  compRGB(canvasElement, canvasElement_view, point, e.latlng);
  console.log( pixelData.toPrecision(5) );
});
/*キー押下時　再描画、rキー押下時　range再定義*/
map.on('keypress', function(e){
  if(e.originalEvent.key ==="r"){
      createColormap(viewLayer_PT);
  }
  dataLayer_PT.redraw();
  viewLayer_PT.redraw();
  drawText(viewLayer_PT);
});

/*memo*/
//dataLayer.on('tileload', function(e) { console.log(e); }); //タイル読み込み時に発火
