(function() {
    'use strict';
    var h = $("<div>").appendTo($("body")).css({
        "text-align": "center",
        padding: "1em"
    });
    $("<h1>").appendTo(h).text("画像を拡大する");
    var input_rate = yaju1919.addInputNumber(h,{
        title: "拡大倍率",
        min: 2,
        save: "rate",
        max: 9
    });
    $("<button>").appendTo(h).text("画像選択").click(function(){
        input.click();
    });
    $("<button>").appendTo(h).text("ダウンロード").click(function(){
        var a = document.createElement("a");
        a.href = h_result.find("canvas").last().get(0).toDataURL("image/png");
        a.download = "enlarged.png";
        a.click();
    });
    var h_result = $("<div>").appendTo(h);
    var input = $("<input>").attr({
        type: "file"
    }).change(loadImg);
    function loadImg(e){
        var file = e.target.files[0];
        if(!file) return;
        var blobUrl = window.URL.createObjectURL(file);
        var img = new Image();
        img.onload = function(){ main(img); };
        img.src = blobUrl;
    }
    function main(img){
        var ww = img.width,
            hh = img.height,
            rate = input_rate();
        var cv = $("<canvas>").attr({
            width: ww,
            height: hh
        });
        var cv2 = $("<canvas>").attr({
            width: ww * rate,
            height: hh * rate
        });
        var ctx = cv.get(0).getContext('2d'),
            ctx2 = cv2.get(0).getContext('2d');
        ctx.drawImage(img,0,0);
        var p = ctx.getImageData(0, 0, ww, hh);
        var d = p.data;
        for (var i = 0; i < d.length; i=i+4) {
            var x = (i / 4) % ww,
                y = Math.floor((i / 4) / ww);
            var r = d[i],
                g = d[i+1],
                b = d[i+2],
                a = d[i+3];
            ctx2.beginPath () ;
            ctx2.rect( x * rate, y * rate, rate, rate );
            ctx2.fillStyle = `rgba(${r},${g},${b},${a})`;
            ctx2.fill() ;
        }
        h_result.empty();
        $("<h2>").text("▼元画像").appendTo(h_result);
        cv.appendTo(h_result);
        $("<h2>").text("▼拡大後").appendTo(h_result);
        cv2.appendTo(h_result);
    }
})();
