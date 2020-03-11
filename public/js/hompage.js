// 轮播
$.ajax({
	url: '/api/homecarousel',
	type: 'post',
	dataType: 'json',
	success: function(data) {
		$("#lunbotu").empty();
		$("#olnum").empty();
		//填充轮播图数
		for (var i = 0; i < data.msg.length; i++) {
			if (i == 0) {
				$("#olnum").append("<li data-target='#carousel-example-generic' data-slide-to='0'  class='active'></li>")
			} else {
				$("#olnum").append("<li data-target='#carousel-example-generic' data-slide-to='" + i + "'></li>")
			}
		}
		//填充每幅图像的具体信息
		for (var i = 0; i < data.msg.length; i++) {
			if (i == 0) {
				$("#lunbotu").append("<div class='item active'>" +
					"<img src='" + data.msg[i].imgurl + "' alt='' width='100%'>" +
					// "<div class='carousel-caption'>" +
					// "<p> " + "第" + i + "</p>" +
					// "</div>" +
					"</div>");
			} else {
				$("#lunbotu").append("<div class='item'>" +
					"<img src='" + data.msg[i].imgurl + "' alt='' width='100%'>" +
					// "<div class='carousel-caption'>" +
					// "<p> " + "第" + i + "</p>" +
					// "</div>" +
					"</div>");
			}
		}
	}
})
// 新品
$.ajax({
	url: '/api/productsnew',
	type: 'post',
	dataType: 'json',
	success: function(data) {
		var ht = '';
		var ht1 = '';
		var ht2 = '';
		var ht3 = '';
		if (data.code == 0) {
			for (var i = 0; i < 4; i++) {
				ht += "<div class='col-md-3 col-xs-3 col-4'>" +
					"<a href='#'>" +
					"<img src='" + data.msg[i].imgurl + "'>" +
					"<div class='con'>" +
					"<p>" + data.msg[i].tags + "</p>" +
					"<div class=''>" + data.msg[i].text + "</div>" +
					"<div class='' style='padding-top: 1px;'>" + data.msg[i].text_type + "</div>" +
					"<div class='' style='padding-top: 7px;'>浓度</div>" +
					"<div class='price'>￥" + data.msg[i].price + "起 - 瓶装" + data.msg[i].capacity + "mL</div>" +
					"</div>" +
					"</a>" +
					"</div>";
			}
			$('#productnew').append(ht);
			// --------------------------------------------------------------------
			ht1 += "<img src='" + data.msg[0].imgurl + "'>" +
				"<div class='con'>" +
				"<p>" + data.msg[0].tags + "</p>" +
				"<div class=''>" + data.msg[0].text + "</div>" +
				"<div class='' style='padding-top: 1px;'>" + data.msg[0].text_type + "</div>" +
				"<div class='' style='padding-top: 7px;'>浓度</div>" +
				"<div class='price'>￥" + data.msg[i].price + "起 - 喷装" + data.msg[0].capacity + "ml</div>" +
				"</div>";
			$('#product1').append(ht1);
			// --------------------------------------------------------------------
			ht2 += "<img src='" + data.msg[2].imgurl + "'>" +
				"<div class='con'>" +
				"<p>" + data.msg[2].tags + "</p>" +
				"<div class=''>" + data.msg[2].text + "</div>" +
				"<div class='' style='padding-top: 1px;'>" + data.msg[2].text_type + "</div>" +
				"<div class='' style='padding-top: 7px;'>浓度</div>" +
				"<div class='price'>￥" + data.msg[i].price + "起 - 喷装" + data.msg[2].capacity + "ml</div>" +
				"</div>";
			$('#product2').append(ht2);
			// --------------------------------------------------------------------
			ht3 += "<img src='" + data.msg[3].imgurl + "'>" +
				"<div class='con'>" +
				"<p>" + data.msg[3].tags + "</p>" +
				"<div class=''>" + data.msg[3].text + "</div>" +
				"<div class='' style='padding-top: 1px;'>" + data.msg[3].text_type + "</div>" +
				"<div class='' style='padding-top: 7px;'>浓度</div>" +
				"<div class='price'>￥" + data.msg[i].price + "起 - 喷装" + data.msg[3].capacity + "ml</div>" +
				"</div>";
			$('#product3').append(ht3);
			//------------------------------------------------------------------------
			$("#lunbotu2").empty();
			//填充每幅图像的具体信息
			for (var i = 0; i < 5; i++) {
				if (i == 1) {
					$("#lunbotu2").append("<div class='item active'>" +
						"<img src='" + data.msg[i].imgurl + "' alt='' width='100%'>" +
						"<div class='con'>" +
						"<p> " + data.msg[i].tags + "</p>" +
						"<div class=''>" + data.msg[i].text + "</div>" +
						"<div class='' style='padding-top: 1px;'>" + data.msg[i].text_type + "</div>" +
						"<div class='' style='padding-top: 7px;'>浓度</div>" +
						"<div class='price'>￥" + data.msg[i].price + "起 - 喷装" + data.msg[i].capacity + "ml</div>" +
						"</div>" +
						"</div>");
				} else {
					$("#lunbotu2").append("<div class='item'>" +
						"<img src='" + data.msg[i].imgurl + "' alt='' width='100%'>" +
						"<div class='con'>" +
						"<p> " + data.msg[i].tags + "</p>" +
						"<div class=''>" + data.msg[i].text + "</div>" +
						"<div class='' style='padding-top: 1px;'>" + data.msg[i].text_type + "</div>" +
						"<div class='' style='padding-top: 7px;'>浓度</div>" +
						"<div class='price'>￥" + data.msg[i].price + "起 - 喷装" + data.msg[i].capacity + "ml</div>" +
						"</div>" +
						"</div>");
				}
			}
		}
	}
})
// 热门话题
$.ajax({
	url: '/api/tipic',
	type: 'post',
	dataType: 'json',
	success: function(data) {
		var ht = '';
		if (data.code == 0) {
			for (var i = 0; i < data.msg.length; i++) {
				ht += "<li><a href='#'>" + data.msg[i].title + "</a></li>";
			}
			$('#tipic').append(ht);
		}
	}
})
// 常见问题
$.ajax({
	url: '/api/answer',
	type: 'post',
	dataType: 'json',
	success: function(data) {
		var ht = '';
		if (data.code == 0) {
			for (var i = 0; i < data.msg.length; i++) {
				ht += "<li><a href='#'>" + data.msg[i].title + "</a></li>";
			}
			$('#answer').append(ht);
		}
	}
})
// 香评达人
$.ajax({
	url: '/api/member',
	type: 'post',
	dataType: 'json',
	success: function(data) {
		var ht = '';
		if (data.code == 0) {
			for (var i = 0; i < 6; i++) {
				ht += "<li>" +
					"<a href='#'>" +
					"<img src='" + data.msg[i].imgurl + "'>" +
					"</a>" +
					"<a class='name' href='#'>" + data.msg[i].title + "</a>" +
					"</li>";
			}
			$('#member').append(ht);
		}
	}
})
