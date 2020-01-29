$(function(){
    $('.dropdwn li').hover(function(){
        $("ul:not(:animated)", this).slideDown();
    }, function(){
        $("ul.dropdwn_menu",this).slideUp();
    });
});

$(function() {
		$("#div1").dialog({
      autoOpen:false, //呼ばれ妻で非表示
			modal:true, //モーダル表示
			title:"テストダイアログ1", //タイトル
			buttons: { //ボタン
			  "決定": function() {
				    $(this).dialog("close");
				},
        "キャンセル": function() {
				    $(this).dialog("close");
				}
			}
		});

    $("#link01").click(function() {
		    $("#div1").dialog("open");
	  });
});
$(function() {
	$("#link02").click(function() {
		$("#div2").dialog({
			modal:true, //モーダル表示
      width:300,
      height:300,
			title:"tone range", //タイトル
			buttons: { //ボタン
			"決定": function() {
				$(this).dialog("close");
        updateClrmapRange_New(layer_PT, Number($("#toneRangeMax").val()), Number($("#toneRangeMin").val()));
        layer_PT.redraw();
        layer_PT.redraw();
        //sum(1,1);
				},
			"キャンセル": function() {
				$(this).dialog("close");
				}
			}
		});
	});
});
$(function() {
		$("#dlg_ch_clrmap").dialog({
      autoOpen:false, //呼ばれ妻で非表示
			modal:true, //モーダル表示
			title:"colormap", //タイトル
			buttons: { //ボタン
			  "決定": function() {
            var obj = document.getElementById("select_clrmap");
            layer_PT._colormap = eval( "clrmap_"+obj.value );
            layer_PT.redraw();
            layer_PT.redraw();
				    $(this).dialog("close");
				},
        "キャンセル": function() {
				    $(this).dialog("close");
				}
			}
		});

    $("#lnk_ch_clrmap").click(function() {
		    $("#dlg_ch_clrmap").dialog("open");
	  });
});

/*
$(function() {
  // 1アイコンをボタン左に表示
  $("#play").button({ //classで指定するとなぜか位置が指定できない
    icons: {
      primary: 'ui-icon-play'
    },
    text: false
  });
  $("#play").click(function() {
    alert("sss");
  });
});
console.log($('button.play'));*/
