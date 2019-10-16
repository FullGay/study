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
<<<<<<< HEAD
  zoom: 2,
});


var layer_PT = L.gridLayer.numData('dataTile/PT/',{
  tileSize : new L.Point(240, 240),
  name: "PT",
  operation: "",
  contour: false,
  shade:   true,
  isGrid : false
});


var layer_W = L.gridLayer.numData('dataTile/W/',{
  tileSize : new L.Point(240, 240),
  name: "W",
  operation: "",
  contour: false,
  shade:   true,
  isGrid : true
});

/*
var layer_UV = L.gridLayer.vectorNumData('dataTile/U/','dataTile/V/',{
  tileSize : new L.Point(240, 240),
  name: "U-V",
  size : 6, //矢印の長さ倍率
  dens : 6, //1タイル中に描く矢印の本数(1〜15のうち 7,9,11,13,14でバグることを確認)
  isGrid : false
});
*/
=======
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

>>>>>>> origin/master
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
<<<<<<< HEAD
var layer, layerNum, activeLayer
layer = [layer_PT, layer_W];
var flag = 0;  //仮フラグ 0: トーン図同士の重ね合わせ　　1:　トーン図とベクトルの重ね合わせ
if(flag == 0){
  layerNum = layer.length;
  activeLayer = 0;
  for(var i = layerNum - 1; i >= 0; i--){
    map.addLayer(layer[i]);
  }
}
if(flag == 1){
    map.addLayer(layer_PT);
    map.addLayer(layer_UV);
    layerNum = 1;
    activeLayer = 0;
}
cross.addTo(map);
//gridLayer.numData内で画像読み込み後に実行
//値をreturnできないので画像を読み込んだ時点で実行しないといけない
//drawText(layer[activeLayer]);

/*イベント*/
/*クリック時　対象ピクセルの値を表示*/

map.on('click', function(e){
  var coords = lonlatToCoords(e.latlng.lat, e.latlng.lng, layer[activeLayer]);
  var point  = lonlatToTlPoint(e.latlng.lat, e.latlng.lng, layer[activeLayer]);
  layer[activeLayer].getNum(coords, point);
  //  console.log( pixelData.toPrecision(5) );
});

var tmpOpacity = layer_PT.options.opacity;
var flag = 1;
/*
=======

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
>>>>>>> origin/master
/*キー押下時　諸々処理*/
map.on('keypress', function(e){
  /*アクティブレイヤ切り替え*/
  if(e.originalEvent.key === "d"){
      activeLayer ++;
      if( activeLayer >= layerNum ){
        activeLayer = 0;
      }
<<<<<<< HEAD
      layer[activeLayer].bringToFront();
=======
      viewLayer[activeLayer].bringToFront();
>>>>>>> origin/master
  }
  /*アクティブレイヤ切り替え*/
  if(e.originalEvent.key === "a"){
      activeLayer --;
      if( activeLayer < 0 ){
        activeLayer = layerNum - 1;
      }
<<<<<<< HEAD
      layer[activeLayer].bringToFront();
  }
  /*カラーマップのレンジ変更*/
  if(e.originalEvent.key === "r"){
      updateClrmapRange(layer[activeLayer]);
=======
      viewLayer[activeLayer].bringToFront();
  }
  /*カラーマップのレンジ変更*/
  if(e.originalEvent.key === "r"){
      updateClrmapRange(viewLayer[activeLayer]);
>>>>>>> origin/master
  }
  /*不透明度 入力&変更*/
  if(e.originalEvent.key === "t"){
      var opacity = window.prompt('不透明度');
<<<<<<< HEAD

      if(0 <= opacity && opacity <= 1){
        layer[activeLayer].options.opacity = opacity; //要注意 アクセス権限ガバガバ
        //tmpOpacity = opacity; //不透明度強制0 On-Offを有効にするならコメント解除
      }
  }
  if(e.originalEvent.key === "q"){
      alert(layer[activeLayer].max);
      alert(layer[activeLayer].min);
  }
=======
      if(0 <= opacity && opacity <= 1){
        viewLayer[activeLayer].options.opacity = opacity; //要注意 アクセス権限ガバガバ
        //tmpOpacity = opacity; //不透明度強制0 On-Offを有効にするならコメント解除
      }
  }
>>>>>>> origin/master
  /*不透明度強制0 On Off*/
  /*
  if(e.originalEvent.key === "e"){
      console.log(flag);
      if(flag == 1){
        flag = 0;
      }else{
        flag = 1;
      }
      viewLayer[activeLayer].options.opacity = tmpOpacity*flag;
  }*/

<<<<<<< HEAD
  /*カラーマップ変更*/
  if(e.originalEvent.key === "z"){
      var input = get2digitsNum( window.prompt('colormap') );
      try{
        console.log(eval( "clrmap_"+input ));
        layer[activeLayer]._colormap = eval( "clrmap_"+input );
      }catch{
        console.log("無効な値が入力されました");
      }
  }

  for(var i = 0; i < layerNum; i++){
    layer[i].redraw();
  }
  drawText(layer[activeLayer]);
});
window.onload = function(){
  function upDate(){
    for(var i = 0; i < layerNum; i++){
      layer[i].redraw();
    }
    drawText(layer[activeLayer]);
  }

  document.getElementById("toneRange").addEventListener("click", function(){
    updateClrmapRange(layer[activeLayer]);
    upDate();
  });

  document.getElementById("colormap").addEventListener("click", function(){
    var input = get2digitsNum( window.prompt('colormap') );
    try{
      console.log(eval( "clrmap_"+input ));
      layer[activeLayer]._colormap = eval( "clrmap_"+input );
    }catch{
      console.log("無効な値が入力されました");
    }
    upDate();
  });

  document.getElementById("opacity").addEventListener("click", function(){
    var opacity = window.prompt('不透明度');
    if(0 <= opacity && opacity <= 1){
      layer[activeLayer].options.opacity = opacity; //要注意 アクセス権限ガバガバ
      //tmpOpacity = opacity; //不透明度強制0 On-Offを有効にするならコメント解除
      upDate();
    }
  });

  document.getElementById("change").addEventListener("click", function(){
    activeLayer ++;
    if( activeLayer >= layerNum ){
      activeLayer = 0;
    }
    layer[activeLayer].bringToFront();
    upDate();
  });
}
=======
  if(e.originalEvent.key === "z"){
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
>>>>>>> origin/master
