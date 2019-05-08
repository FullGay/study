L.GridLayer.View = L.GridLayer.extend({
  /*コンストラクタ*/
  initialize: function (options) {
		L.Util.setOptions(this, options);
    var coords  = new L.Point(0, 0);
    coords.z = 0
    this.getInitRange(coords);
    this.setColormap();
	},
  /*最初に一度だけ実行　タイル内の最大・最小値を取得*/
  getInitRange: function(coords){
    this.max = -10000000;
    this.min =  10000000;
    var tileSize = this.getTileSize();

    /*ViewLayerのcanvasインスタンス初期化*/
    var viewTile = document.createElement('canvas');
    viewTile.setAttribute('width', tileSize.x);
    viewTile.setAttribute('height', tileSize.y);
    var viewCtx = viewTile.getContext('2d');

    /*DataLayerのcanvasインスタンス初期化*/
    var dataObj = this.options.dtLayerObj;  //データレイヤのインスタンス
    var key = dataObj._tileCoordsToKey(coords);
    try{//なんかよく分からないが先にviewが読み込まれる時があるので、その時は強制的にタイルを取得(無駄にcreateTile()を実行する)
      var dataTile = dataObj._tiles[key].el;
    }catch(e){
      var dataTile = dataObj.createTile(coords);
    }
    var dataCtx = dataTile.getContext('2d');

    /*全画素のRGBAデータを配列に格納*/
    var viewImgData = viewCtx.getImageData(0,0,tileSize.x,tileSize.y);//キャンバスオブジェクトの画素値取得
    var dataImgData = dataCtx.getImageData(0,0,tileSize.x,tileSize.y);//キャンバスオブジェクトの画素値取得*/

    var r , g ,b;
    var imgInx;//配列の添字計算
    var value;
    var x,y;
    /*全ピクセル値を調べて最大・最小値を求める*/
    for(y = 0; y < tileSize.y; y++){
      for(x = 0; x < tileSize.x; x++){
        //r = g = b = 0;
        imgInx = (x + y * tileSize.x) * 4;//配列の添字計算
        r = dataImgData.data[imgInx] << 24;
        g = dataImgData.data[imgInx + 1] << 16;
        b = dataImgData.data[imgInx + 2] <<  8;
        data_view.setUint32(0, r+g+b);
        value = data_view.getFloat32(0);
        if(value > this.max){
          this.max = value;
        }
        else if(value < this.min){
          this.min = value;
        }
      }
    }
    this.max = parseInt(this.max, 10);
    this.min = parseInt(this.min, 10);
    //console.log("tmp is called");
  },

  setColormap: function(){
      var opacity  = this.options.opacity;
      this._colormap = this.options.clrmap;
      if(opacity != 1){
        for(var i = 0; i < this._colormap.length; i++){
          //this._colormap[i].a *= opacity;
        }
      }
  },

  /*引数 : ピクセル値, 戻り値 : RGBAの格納されたオブジェクト*/
  getColor: function(value) {
    var diff = (this.max - this.min) / (this._colormap.length - 2);
    if( value === 0.0000000000 ){     //読み込み失敗タイルは白く塗りつぶす
      return {r:255, g:255, b:255, a:  0};
    }else if(value <= this.min){           //最小値以下
      return this._colormap[0];
    }else if(value > this.max){            //最大値より大
      return this._colormap[this._colormap.length - 1];
    }else{                            //最小値より大 & 最大値以下
      for(var i = 1; i < this._colormap.length - 1; i++){
        if(value > this.min + (i-1) * diff && value <= this.min + i * diff){
          return this._colormap[i];
        }
      }
    }
  },

  /*引数: coords  戻り値: タイル1つのcanvasインスタンス*/
  createTile: function (coords) {
    var tileSize = this.getTileSize();

    /*ViewLayerのcanvasインスタンス初期化*/
    var viewTile = document.createElement('canvas');
    viewTile.setAttribute('width', tileSize.x);
    viewTile.setAttribute('height', tileSize.y);
    var viewCtx = viewTile.getContext('2d');

    /*DataLayerのcanvasインスタンス初期化*/
    var dataObj = this.options.dtLayerObj;  //データレイヤのインスタンス
    var key = dataObj._tileCoordsToKey(coords);
    try{//なんかよく分からないが先にviewが読み込まれる時があるので、その時は強制的にタイルを取得(無駄にcreateTile()を実行する)
      var dataTile = dataObj._tiles[key].el;
    }catch(e){
      var dataTile = dataObj.createTile(coords);
    }
    var dataCtx = dataTile.getContext('2d');

    /*全画素のRGBAデータを配列に格納*/
    var viewImgData = viewCtx.getImageData(0,0,tileSize.x,tileSize.y);//キャンバスオブジェクトの画素値取得
    var dataImgData = dataCtx.getImageData(0,0,tileSize.x,tileSize.y);//キャンバスオブジェクトの画素値取得*/
    /*全画素の色分け*/
    for(var y = 0; y < tileSize.y; y++){
      for(var x = 0; x < tileSize.x; x++){
        var r = g = b = 0;
        var imgInx = (x + y * tileSize.x) * 4;//配列の添字計算
        /*data_view.setUint8(0, imgData2.data[imgInx    ]);//R
        data_view.setUint8(1, imgData2.data[imgInx + 1]);//G
        data_view.setUint8(2, imgData2.data[imgInx + 2]);//B*/
        var r = dataImgData.data[imgInx] << 24;
        var g = dataImgData.data[imgInx + 1] << 16;
        var b = dataImgData.data[imgInx + 2] <<  8;
        data_view.setUint32(0, r+g+b);
        var value = data_view.getFloat32(0);
          //console.log(value);
        var color = this.getColor(value);
        //console.log(color);
        viewImgData.data[imgInx    ] = color.r;
        viewImgData.data[imgInx + 1] = color.g;
        viewImgData.data[imgInx + 2] = color.b;
        viewImgData.data[imgInx + 3] = color.a;
      }
    }
    viewCtx.putImageData(viewImgData, 0, 0);
    if(this.options.isGrid){
      viewCtx.strokeRect(0, 0, tileSize.x, tileSize.y)  //タイルの縁を描く
    }
    return viewTile;
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

L.gridLayer.view = function(opts) {
  return new L.GridLayer.View(opts);
};
