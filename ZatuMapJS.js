
//
var g_HasHouiSensaFlg;

function CalculationDistAndHougaku() {
	if(DeviceOrientationEvent in window) {
	  // 方位センサーが使える
		alert("このデバイスでは方位センサは使用可能です")
	  g_HasHouiSensaFlg = true;
	}else{
		alert("このデバイスでは方位センサは使用できません")
		g_HasHouiSensaFlg = false;
	}

	var position =  navigator.geolocation.getCurrentPosition(SetCurrentPosition2);
	


}

function SetCurrentPosition2(position){
	
	var ido  =  position.coords.latitude;
    var keido = position.coords.longitude;
    var  houkou = g_alpha;

	var idoElem = document.getElementById("CurrentLatitudeTextBox");
	var keidoElem = document.getElementById("CurrentLongitudeTextBox")

	idoElem.value = ido
	keidoElem.value = keido

	if(houkou == null){
		houkou = 0.0
	}
    alert(houkou);
    
	var DstIdoElem = document.getElementById("DestinationLatitudeTextBox");
	var DstKeidoElem = document.getElementById("DestinationLongitudeTextBox")
	if(DstIdoElem.value != ""){		
		SetCurrentDistanceAndHougaku()
	}

}



function SetCurrentDistanceAndHougaku(){

	var CrIdoElem = document.getElementById("CurrentLatitudeTextBox");
	var CrKeidoElem = document.getElementById("CurrentLongitudeTextBox")
	
	var DstIdoElem = document.getElementById("DestinationLatitudeTextBox");
	var DstKeidoElem = document.getElementById("DestinationLongitudeTextBox")
	
	var lat1 = CrIdoElem.value
	var lng1 = CrKeidoElem.value
	
	var lat2 = DstIdoElem.value
	var lng2 = DstKeidoElem.value
	
	if( lat1 == "" || lng1 == "" || lat2 == "" || lng2 == "" ||
	    isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2) ){
	    
		alert("目的地までの距離の計算に失敗しました")
		return false;
	}else{
		var dist = distance(lat1, lng1, lat2, lng2)
		
		var DistElem = document.getElementById("DestinationDistance")
		DistElem.innerHTML = dist + " m(メートル)"
		
		var hougaku = CalcHougaku(lat1, lng1, lat2, lng2);
		alert("test3")
		alert(hougaku)
		DrawHougaku(hougaku);
	}
	

	
}


//緯度:lng
//経度:lat

function DrawHougaku(houikaku){
	var HoukouCanvas = document.getElementById("HoukouCanvas");
	
	var ctx = HoukouCanvas.getContext('2d');

	//直線描画
	ctx.lineWidth = 5;
    ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(100,100);
    ctx.lineTo(100, 30);
    ctx.stroke();
	
	//円を描画
	ctx.lineWidth = 1;
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.beginPath();
    ctx.arc(100, 100, 70, 0,Math.PI*2, true); // 外の円
    ctx.stroke();
    
    //文字を描画
    ctx.font = "20px serif";
    ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillText("N", 90, 20);
    
    //方角を描画
    DrawVector(100,100,70,houikaku)
    
}

//真北方向に対してθの角度の直線を描画する
function DrawVector(pivot_x, pivot_y, radius, theta){
	var HoukouCanvas = document.getElementById("HoukouCanvas");
	var ctx = HoukouCanvas.getContext('2d');
	
	var delta_x;
	var delta_y;
	var end_x;
	var end_y;
	var syogen;
	
	theta = theta+90.0;
	if(theta <= 90){
		syogen = 1;
	}else if(theta <= 180){
		syogen = 2;
	}else if(theta <= 270){
		syogen = 3;
	}else{
		syogen = 4;
	}
	
	theta = deg2rad(theta);
	delta_x = Math.abs(radius * Math.cos(theta));
	delta_y = Math.abs(radius * Math.sin(theta));
	
	
	if(syogen == 1){
		end_x = pivot_x + delta_x;
		end_y = pivot_y + delta_y;
	}else if(syogen == 2){
		end_x = pivot_x - delta_x;
		end_y = pivot_y - delta_y; 
	}else if(syogen == 3){
		end_x = pivot_x - delta_x;
		end_y = pivot_y + delta_y;
	}else{
		end_x = pivot_x + delta_x;
		end_y = pivot_y + delta_y;
	}
	
	
	//直線描画
	ctx.lineWidth = 5;
    ctx.strokeStyle = "rgb(0, 0, 255)";
    ctx.beginPath();
    ctx.moveTo(pivot_x, pivot_y);
    ctx.lineTo(end_x, end_y);
    ctx.stroke();
}
function CalcHougaku(srcLat, srcLng, dstLat, dstLng){
	var x1 = srcLat;
	var y1 = srcLng;
	var x2 = dstLat;
	var y2 = dstLng;
	var delta_x = x2 - x1;
	
	var r = 6378.137;
	var d;
	d = Math.sin(y1)*Math.sin(y2) + Math.cos(y1)*Math.cos(y2)*Math.cos(delta_x);
	d = r * Math.acos(d);
	
	var fai;
	var a, b;
	a = Math.sin(delta_x);
	b = Math.cos(y1) * Math.tan(y2) - Math.sin(y1)*Math.cos(delta_x);
	fai = Math.atan2(b,a);
	
	var fai2;
	if(fai >= 0){
		alert("a")
		fai2 = fai * 180.0 / Math.PI
	}else{
		alert("b")
		fai2 = (fai + 2 * Math.PI) * 180.0 / Math.PI
	}

	return fai2;
}

var g_alpha;
var g_beta;
var g_gamma;
 
window.addEventListener('deviceorientation', function(e) {
  g_alpha = e.alpha; //方向（方角）を取得する。値は0〜360。
  g_beta = e.beta; //上下の傾きを取得。値は-180〜180。
  g_gamma = e.gamma; //左右の傾きを取得。値は-90〜90。
}, true);


function deg2rad(degrees) {
  return degrees * Math.PI / 180;
};

function rad2deg(radian){
        return radian * 360/(2*Math.PI);
}


/**
 * ２地点間の距離(m)を求める
 * ヒュベニの公式から求めるバージョン
 *
 * @param float $lat1 緯度１
 * @param float $lon1 経度１
 * @param float $lat2 緯度２
 * @param float $lon2 経度２
 * @param boolean $mode 測地系 true:世界(default) false:日本
 * @return float 距離(m)
 */
function distance($lat1, $lon1, $lat2, $lon2, $mode=true)
{
    // 緯度経度をラジアンに変換
    $radLat1 = deg2rad($lat1); // 緯度１
    $radLon1 = deg2rad($lon1); // 経度１
    $radLat2 = deg2rad($lat2); // 緯度２
    $radLon2 = deg2rad($lon2); // 経度２

    // 緯度差
    $radLatDiff = $radLat1 - $radLat2;

    // 経度差算
    $radLonDiff = $radLon1 - $radLon2;

    // 平均緯度
    $radLatAve = ($radLat1 + $radLat2) / 2.0;

    // 測地系による値の違い
    $a = $mode ? 6378137.0 : 6377397.155; // 赤道半径
    $b = $mode ? 6356752.314140356 : 6356078.963; // 極半径
    //$e2 = ($a*$a - $b*$b) / ($a*$a);
    $e2 = $mode ? 0.00669438002301188 : 0.00667436061028297; // 第一離心率^2
    //$a1e2 = $a * (1 - $e2);
    $a1e2 = $mode ? 6335439.32708317 : 6334832.10663254; // 赤道上の子午線曲率半径

    $sinLat = Math.sin($radLatAve);
    $W2 = 1.0 - $e2 * ($sinLat*$sinLat);
    $M = $a1e2 / (Math.sqrt($W2)*$W2); // 子午線曲率半径M
    $N = $a / Math.sqrt($W2); // 卯酉線曲率半径

    $t1 = $M * $radLatDiff;
    $t2 = $N * Math.cos($radLatAve) * $radLonDiff;
    $dist = Math.sqrt(($t1*$t1) + ($t2*$t2));

    return $dist;
}