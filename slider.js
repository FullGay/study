$(function() {
  $( "#slider_h" ).slider({
    value:0,
    min:0,
    max:4,
    step:1,
    range:"min",
    change: function (e, ui) {
      layer_PT.activeH = ui.value;
      layer_PT.redraw();
      drawText(layer_PT);

    }
  });
});

$(function() {
  $( "#slider_t" ).slider({
    value:0,
    min:0,
    max:11,
    step:1,
    range:"min",
    change: function (e, ui) {
      layer_PT.activeT = ui.value;
      layer_PT.redraw();
      drawText(layer_PT);

    }
  });
});
