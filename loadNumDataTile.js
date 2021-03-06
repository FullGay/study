L.GridLayer.Data = L.GridLayer.extend({
  initialize: function(url, options){
    this._url = url;
    L.Util.setOptions(this, options);
  },
  /*タイル生成*/
  load: function (coords) {
    /*canvasインスタンス初期化*/
    var tile = document.createElement('canvas');
    tile.setAttribute('width', tileSize.x); //canvasの大きさ定義
    tile.setAttribute('height', tileSize.y);
    var ctx = tile.getContext('2d');

    /*canvasインスタンスにベースタイル描画*/
    var img = new Image();

    //img.src = `dataTile/${coords.z}/${coords.x}/${coords.y}.png`;
    img.src = `${this._url}$0/0/0.png`;

    ctx.drawImage(img, 0, 0);//canvasオブジェクトの左上から画像を貼り付け

    /*ベースタイルの色取得*/
      /*var imgData = ctx.getImageData(0,0,tileSize.x,tileSize.y);
        for(var x = 0; x < tileSize.x; x++){
          for(var y = 0; y < tileSize.y; y++){
            var imgInx = (x + y * tileSize.x) * 4;
            var r = imgData.data[imgInx];
            var g = imgData.data[imgInx + 1];
            var b = imgData.data[imgInx + 2];
            //console.log(`(${x}, ${y}) : (${r},${g},${b})`);
          }
        }*/
    return tile;
  }
});

L.gridLayer.data = function(url, opts) {
  return new L.GridLayer.Data(url, opts);
};
