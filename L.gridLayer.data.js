L.GridLayer.Data = L.GridLayer.extend({
  /*タイル生成*/
  createTile: function (coords) {
    var tileSize = this.getTileSize();

    /*canvasインスタンス初期化*/
    var tile = document.createElement('canvas');
    tile.setAttribute('width', tileSize.x); //canvasの大きさ定義
    tile.setAttribute('height', tileSize.y);
    var ctx = tile.getContext('2d');

    /*canvasインスタンスにベースタイル描画*/
    var img = new Image();
    img.src = `dataTile/${coords.z}/${coords.x}/${coords.y}.png`;
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
  },
  /*引数 : coords , 戻り値 : canvasオブジェクト*/
  getCanvasElement: function(coords){
    var key = this._tileCoordsToKey(coords);
    try{
      return this._tiles[key].el;
    }catch(e){
      console.log("key : "+key);
    }
  }
});

L.gridLayer.data = function(opts) {
  return new L.GridLayer.Data(opts);
};
