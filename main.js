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
var dataLayer_U = L.gridLayer.data('dataTile/U/',{
  tileSize : new L.Point(240, 240)
});

var dataLayer_V = L.gridLayer.data('dataTile/V/',{
  tileSize : new L.Point(240, 240)
});

var dataLayer_W = L.gridLayer.data('dataTile/W/',{
  tileSize : new L.Point(240, 240)
});

var dataLayer_PT = L.gridLayer.data('dataTile/PT/',{
  tileSize : new L.Point(240, 240)
});

var dataLayer_DENS = L.gridLayer.data('dataTile/DENS/',{
  tileSize : new L.Point(240, 240)
});

var viewLayer_U = L.gridLayer.view({
  tileSize : new L.Point(240, 240),
  dtLayerObj : dataLayer_U,
  clrmap : colormap.dcl_01,
  name: "U",
  isGrid : true
});

var viewLayer_V = L.gridLayer.view({
  tileSize : new L.Point(240, 240),
  dtLayerObj : dataLayer_V,
  clrmap : colormap.gray,
  name: "V",
  isGrid : true
});

var viewLayer_W = L.gridLayer.view({
  tileSize : new L.Point(240, 240),
  dtLayerObj : dataLayer_W,
  clrmap : colormap.gray,
  name: "W",
  isGrid : true
});

var viewLayer_PT = L.gridLayer.view({
  tileSize : new L.Point(240, 240),
  dtLayerObj : dataLayer_PT,
  clrmap : colormap.dcl_02,
  name: "PT",
  isGrid : true
});

var viewLayer_DENS = L.gridLayer.view({
  tileSize : new L.Point(240, 240),
  dtLayerObj : dataLayer_DENS,
  clrmap : colormap.dcl_03,
  name: "DENS",
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

var dataLayer = [dataLayer_U,dataLayer_V,dataLayer_W,dataLayer_PT,dataLayer_DENS];
var viewLayer = [viewLayer_U,viewLayer_V,viewLayer_W,viewLayer_PT,viewLayer_DENS];
if(dataLayer.length == viewLayer.length){
  var layerNum = dataLayer.length;
  var activeLayer = 0;
}else{
  console.log("miss match data/view");
  //return 1;
}
for(var i = layerNum - 1; i >= 0; i--){
  map.addLayer(dataLayer[i]);
}
for(var i = layerNum - 1; i >= 0; i--){
  map.addLayer(viewLayer[i]);
}
cross.addTo(map);
drawText(viewLayer[activeLayer]);

/*イベント*/
/*クリック時　対象ピクセルの値を表示*/
map.on('click', function(e){
  var coords = lonlatToCoords(e.latlng.lat, e.latlng.lng, dataLayer[activeLayer]);
  //var coords  = new L.Point(tmp.x, tmp.y);
  //coords.z = tmp.z;
  var point  = lonlatToTlPoint(e.latlng.lat, e.latlng.lng, dataLayer[activeLayer]);
  var canvasElement = dataLayer[activeLayer].getCanvasElement( coords );
  var canvasElement_view = viewLayer[activeLayer].getCanvasElement( coords );
  var pixelData = getPixelData( canvasElement, point );
  compRGB(canvasElement, canvasElement_view, point, e.latlng);
  console.log( pixelData.toPrecision(5) );
});
var tmpOpacity = viewLayer_PT.options.opacity;
var flag = 1;
/*キー押下時　再描画、rキー押下時　range再定義*/
map.on('keypress', function(e){
  if(e.originalEvent.key === "d"){
      activeLayer ++;
      if( activeLayer >= layerNum ){
        activeLayer = 0;
      }
      viewLayer[activeLayer].bringToFront();
  }
  if(e.originalEvent.key === "a"){
      activeLayer --;
      if( activeLayer < 0 ){
        activeLayer = layerNum - 1;
      }
      viewLayer[activeLayer].bringToFront();
  }
  if(e.originalEvent.key === "r"){
      createColormap(viewLayer[activeLayer]);
  }
  if(e.originalEvent.key === "t"){
      var opacity = window.prompt('不透明度');
      if(0 <= opacity && opacity <= 1){
        viewLayer[activeLayer].options.opacity = opacity;
        tmpOpacity = opacity;
      }
  }
  if(e.originalEvent.key === "e"){
      console.log(flag);
      if(flag == 1){
        flag = 0;
      }else{
        flag = 1;
      }
      viewLayer[activeLayer].options.opacity = tmpOpacity*flag;
  }

  for(var i = 0; i < layerNum; i++){
    dataLayer[i].redraw();
    viewLayer[i].redraw();
  }
  drawText(viewLayer[activeLayer]);
});

/*memo*/
//dataLayer.on('tileload', function(e) { console.log(e); }); //タイル読み込み時に発火
