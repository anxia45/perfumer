$(function() {
	// 登录ajax
	$('#login').click(function() {
		var data = $('#logins').serialize(); // 此时不能忘记name属性
		$.ajax({
			url: '/api/login',
			type: 'post',
			dataType: 'json',
			data: data,
			success: function(data) {
				if (data.code == 0) {
					// console.log(data);
					var user_name = data.msg.user_name;
					alert(data.pre);
					setTimeout(function() {
						$('#userpwd').val('');
						sessionStorage.setItem("user_name",user_name);
						login_data();
						location.href = '/'
					}, 1000)
				} else if (data.code == 1) {
					alert(data.msg);
				} else if (data.code == 2) {
					alert(data.msg);
				} else if (data.code == -1) {
					alert(data.msg);
					$('#username').val('');
					$('#userpwd').val('');
				} else if (data.code == -2) {
					alert(data.msg);
					$('#username').val('');
					$('#userpwd').val('');
				}
			}
		})
	});

	// 注册ajax
	$('#register').click(function() {
		var data = $('#registers').serialize();
		$.ajax({
			url: '/api/register',
			type: 'post',
			dataType: 'json',
			data: data,
			success: function(data) {
				if (data.code == 0) {
					alert(data.msg);
					setTimeout(function() {
						location.href = '/api/loginpc'
					}, 1000)
				} else if (data.code == 1) {
					alert(data.msg);
				} else if (data.code == 2) {
					alert(data.msg);
				} else if (data.code == 3) {
					alert(data.msg);
				} else if (data.code == 4) {
					alert(data.msg);
				} else if (data.code == 5) {
					alert(data.msg);
				} else if (data.code == 6) {
					alert(data.msg);
				} else if (data.code == 7) {
					alert(data.msg);
				} else if (data.code == -1) {
					alert(data.msg);
					$('#username').val('');
					$('#userpwd').val('');
					$('#userpwd1').val('');
					$('#userphone').val('');
				}
			}
		})
	})
})
