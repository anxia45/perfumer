var express = require('express');
var router = express.Router();
var pool = require('../db/DBConfig.js');

// 统一格式返回
var responseData;
router.use(function(req, res, next) {
	responseData = {
		code: 0,
		msg: '',
		pre: ''
	}
	next();
})

// ================================================= 路径 =================================================
router.get('/homepage', function(req, res, next) {
	res.render('frontend/homepage');
})
router.get('/brand', function(req, res, next) {
	res.render('frontend/brand');
})
router.get('/brandcon', function(req, res, next) {
	res.render('frontend/brandcon');
})
router.get('/fragrancenotes', function(req, res, next) {
	res.render('frontend/fragrancenotes');
})
router.get('/smell', function(req, res, next) {
	res.render('frontend/smell');
})
router.get('/smellcon', function(req, res, next) {
	res.render('frontend/smellcon');
})
router.get('/perfumer', function(req, res, next) {
	res.render('frontend/perfumer');
})

router.get('/perfumercon', function(req, res, next) {
	res.render('frontend/perfumercon');
})

router.get('/login', function(req, res, next) {
	res.render('frontend/login');
})
router.get('/loginpc', function(req, res, next) {
	res.render('frontend/loginpc');
})
router.get('/register', function(req, res, next) {
	res.render('frontend/register');
})
router.get('/registerpc', function(req, res, next) {
	res.render('frontend/registerpc');
})
// ================================================= 注册登录 =================================================
// ---------------------- 登录 ------------------------//
router.post('/login', function(req, res, next) {
	var name = req.body.user_name;
	var pwd = req.body.user_pwd;
	var user = {
		user_name: name,
		user_pwd: pwd
	}
	// 非空判断
	if (name == '') {
		responseData.code = 1,
			responseData.msg = '用户名不能为空',
			res.json(responseData);
		return;
	}

	if (pwd == '') {
		responseData.code = 2,
			responseData.msg = '密码不能为空',
			res.json(responseData);
		return;
	}
	var selSql = "select * from users where user_name = '" + name + "' and user_pwd = '" + pwd + "'";
	pool.query(selSql, user, function(err, data) {
		if (err) throw err
		else {
			if (data.length == 0) {
				responseData.code = -1,
					responseData.msg = '用户名不存在',
					res.json(responseData)
				return;
			} else {
				var response = data[0];
				if (response.user_name == name && response.user_pwd == pwd) {
					responseData.pre = '登录成功';
					responseData.msg = user;
					req.session.user = user;
					// login_data();
					res.json(responseData);
					return;
				} else {
					responseData.code = -2
					responseData.msg = '用户名或密码有错误',
						res.json(responseData)
					return;
				}
			}
		}
	})
});
// ---------------------- 退出登录 ------------------------//
router.get('/logout', function(req, res, next) {
	// 销毁session
	req.session.destroy(function(err) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = '退出登录成功'
			res.json(responseData);
		}
	})

})

// ---------------------- 注册 ------------------------//
router.post('/register', function(req, res, next) {
	var name = req.body.user_name;
	var pwd = req.body.user_pwd;
	var pwd1 = req.body.user_pwd1;
	var phone = req.body.user_phone;
	var data = {
		user_name: name,
		user_pwd: pwd,
		user_phone: phone
	};
	// 手机号正则表达式
	var telStr = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
	// 密码正则表达式
	var pwdStr = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
	// /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{8,16}$/
	// [\s\S] 中的\s空白符，\S非空白符，所以[\s\S]是任意字符。也可以用 [\d\D]、[\w\W]来表示
	// 非空判断
	if (name == '') {
		responseData.code = 1,
			responseData.msg = '用户名不能为空',
			res.json(responseData);
		return;
	} else if (pwd == '') {
		responseData.code = 2,
			responseData.msg = '密码不能为空',
			res.json(responseData);
		return;
	} else if (pwd1 == '') {
		responseData.code = 3,
			responseData.msg = '确认密码不能为空',
			res.json(responseData);
		return;
	} else if (pwd !== pwd1) {
		responseData.code = 4,
			responseData.msg = '两次密码不相同',
			res.json(responseData);
		return;
	} else if (!(pwdStr.test(pwd))) {
		responseData.code = 5,
			responseData.msg = '密码格式不正确',
			res.json(responseData);
		return;
	} else if (phone == '') {
		responseData.code = 6,
			responseData.msg = '手机号不能为空',
			res.json(responseData);
		return;
	} else if (!(telStr.test(phone))) {
		responseData.code = 7,
			responseData.msg = '手机号格式不正确',
			res.json(responseData);
		return;
	} else {
		var sqlAll = "select user_name from users where user_name = '" + name + "';";
		var regssql = 'insert into users set ?';
		// 先查询用户名是否存在，再决定注册插入用户名和密码
		pool.query(sqlAll, function(err, result) {
			if (err) {
				console.log(err)
				return;
			}
			if (result == '') {
				//将用户名和密码插入到数据表中的函数
				pool.query(regssql, data, function(err, result) {
					if (err) {
						console.log(err);
						return;
					}
					responseData.msg = '注册成功',
						res.json(responseData);
					console.log('注册成功')
				})
			} else {
				responseData.code = -1,
					responseData.msg = '注册失败，用户名已存在',
					res.json(responseData)
				console.log(data.user_name + '用户名已存在')
			}
		})
	}
});

// ---------------------- 查询目录 ------------------------//
router.post('/catalog', function(req, res, next) {
	var sqlAll = 'select * from catalog';
	pool.query(sqlAll, function(err, data) {
		if (err) {
			console.log(err);
			return;
		}
		responseData.msg = data;
		res.json(responseData);
	})
});
// ================================================= 首页 =================================================
// ---------------------- 轮播 ------------------------//
router.post('/homecarousel', function(req, res, next) {
	var sqlAll = 'select * from homecarousel';
	pool.query(sqlAll, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			console.log('查询成功');
		}
		responseData.msg = data;
		res.json(responseData);
	})
})

// ---------------------- 新品 ------------------------//
router.post('/productsnew', function(req, res, next) {
	var sqlAll = 'select * from productsnew ORDER BY time desc';
	pool.query(sqlAll, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			console.log('查询成功');
		}
		responseData.msg = data;
		res.json(responseData);
	})

})

// ---------------------- 热门话题 ------------------------//
router.post('/tipic', function(req, res, next) {
	var sqlAll = 'select * from tipic';
	pool.query(sqlAll, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			console.log('查询成功');
		}
		responseData.msg = data;
		res.json(responseData);
	})

})

// ---------------------- 常见问题 ------------------------//
router.post('/answer', function(req, res, next) {
	var sqlAll = 'select * from answer';
	pool.query(sqlAll, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			console.log('查询成功');
		}
		responseData.msg = data;
		res.json(responseData);
	})

})

// ---------------------- 香评达人 ------------------------//
router.post('/member', function(req, res, next) {
	var sqlAll = 'select * from member ORDER BY time desc';
	pool.query(sqlAll, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			console.log('查询成功');
		}
		responseData.msg = data;
		res.json(responseData);
	})
})
// ================================================= 品牌 =================================================

// ---------------------- 分类列表 ------------------------//
// router.post('/brandClass', function(req, res, next) {
// // 	var sqlAll = 'select * from brandClass ORDER BY bc_id asc';
// // 	pool.query(sqlAll, function(err, data) {
// // 		if (err) {
// // 			console.log(err);
// // 		} else {
// // 			console.log('查询成功');
// // 		}
// // 		responseData.msg = data;
// // 		res.json(responseData);
// // 	})
// // })
// ---------------------- 分类内容 ------------------------//
router.post('/brand', function(req, res, next) {
	var sqlAll = 'select * from brand';
	pool.query(sqlAll, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			console.log('查询成功');
		}
		responseData.msg = data;
		res.json(responseData);
	})
})
// router.post('/brandclasscontent1', function(req, res, next) {
//
// 	var name = req.body;
// 	var strname = JSON.stringify(req.body);
// 	console.log(name)
// 	console.log(strname)
//
// 	var sqlAll = 'select * from brandClass a join brandclasscontent b on a.bc_id = b.bc_id where a.bc_name = ' + strname +
// 		' ORDER BY a.bc_id asc';
// 	pool.query(sqlAll, function(err, data) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			console.log('查询成功');
// 		}
// 		responseData.msg = data;
// 		res.json(responseData);
// 	})
// })
// ---------------------- 品牌的详情页 ------------------------//
router.post('/brandcon1', function(req, res, next) {
	var id = JSON.stringify(req.body).substr(2, 1);
	var sqlAll = "select * from brand a join brandclasscon b on a.b_id = b.b_id where b.b_id ='" + id + "'";
	pool.query(sqlAll, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
// ================================================= 香调 =================================================
//目录
router.post('/fragrantclass', function(req, res, next) {
	var sqlAll = "select * from fragrantclass";
	pool.query(sqlAll, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '查询失败';
			res.json(responseData);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	});
});
// 产品
router.get('/fragrantcon/:name', function(req, res, next) {
	var name = req.params.name;
	console.log(name);
	var sqlAll = "select * from fragrantcon a join fragrantclass b on a.fc_id = b.fc_id where b.fc_title = '" + name +
		"'";
	pool.query(sqlAll, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '查询失败';
			res.json(responseData);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	});
});

// ================================================= 气味 =================================================
//目录
router.post('/smellclass', function(req, res, next) {
	var sqlAll = "select * from smellclass";
	pool.query(sqlAll, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '查询失败';
			res.json(responseData);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	});
});
// 分类产品
router.get('/smell/:name', function(req, res, next) {
	var name = req.params.name;
	console.log(name);
	var sqlAll = "select * from smell a join smellclass b on a.ss_id = b.ss_id where b.ss_title = '" + name + "'";
	pool.query(sqlAll, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '查询失败';
			res.json(responseData);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	});
});
// 详情内容
router.post('/smellcon1', function(req, res, next) {
	var id = JSON.stringify(req.body).substr(2, 1);
	var sqlAll = "select * from smellcon a join smell b on a.s_id = b.s_id where b.s_id = '" + id + "'";
	pool.query(sqlAll, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
// ================================================= 调香师 =================================================
// ---------------------- 调香师简介 ------------------------//
router.post('/perfumerIntroduce', function(req, res, next) {
	var sqlAll = 'select * from perfumerIntroduce';
	pool.query(sqlAll, function(err, data) {
		if (err) {
			console.log(err);
			return;
		} else {
			console.log('查询成功');
		}
		responseData.msg = data;
		res.json(responseData);
	})
});
// ---------------------- 调香师 ------------------------//
router.post('/perfumer', function(req, res, next) {
	var sqlAll = 'select * from perfumer';
	pool.query(sqlAll, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			console.log('查询成功');
		}
		responseData.msg = data
		res.json(responseData);
	})
})

// ---------------------- 调香师详情页 ------------------------//
router.post('/perfumercon1', function(req, res, next) {
	var id = JSON.stringify(req.body).substr(2, 1);
	var sqlAll = "select * from perfumercon a inner join perfumer b on a.pc_id =b.pc_id where b.pc_id ='" + id + "'";
	pool.query(sqlAll, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	})
})


module.exports = router;
