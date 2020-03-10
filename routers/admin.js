var express = require('express');
var router = express.Router();
var pool = require('../db/DBConfig.js');
var multiparty = require('multiparty');

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

// ================================================= 用户 =================================================
// 查询
router.post('/users', function(req, res, next) {
	var sqlAll = 'select * from users';
	pool.query(sqlAll, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.pre = '查询失败';
			res.json(responseData);
		} else {
			responseData.pre = '查询成功';
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
// 搜索
router.post('/searchuser', function(req, res, next) {
	// 模糊查询两种方法直接在SQL语句后加 mysql.escape("%"+req.body.name+"%")
	// sql += " WHERE product_name LIKE "+mysql.escape("%"+req.body.name+"%")
	var sqlsearch = "select * from users"
	if (req.body.user_name) {
		sqlsearch += " where user_name like ?"; //'%1%';"
	}

	// sql+= ' limit ? offset ?';
	// let param = [ "%"+req.body.name+"%",pageNum, (page - 1) * pageNum ]

	var data = ["%" + req.body.user_name + "%"]
	pool.query(sqlsearch, data, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.pre = '搜索失败';
			responseData.msg = data;
			res.json(responseData);
		} else {
			responseData.pre = '搜索成功';
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
// 添加用户
router.post('/usersadd', function(req, res, next) {
	var name = req.body.user_name;
	var pwd = req.body.user_pwd;
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
	if (name == '' || pwd == '' || phone == '') {
		responseData.code = 1;
		responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}

	if (!(pwdStr.test(pwd))) {
		responseData.code = 2;
		responseData.msg = '密码格式不正确';
		res.json(responseData);
		return;
	}

	if (!(telStr.test(phone))) {
		responseData.code = 3;
		responseData.msg = '手机号格式不正确';
		res.json(responseData);
		return;
	}
	var sqladd = 'insert into users set ?';
	pool.query(sqladd, data, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '添加失败';
			res.json(responseData);
		} else {
			responseData.msg = '添加成功';
			res.json(responseData);
		}
	})
})
// 根据id获取对应的信息
router.post('/usersId/:id', function(req, res, next) {
	var id = req.params.id;
	var sqlId = "select * from users where user_id ='" + id + "'";
	pool.query(sqlId, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data,
				res.json(responseData);
		}
	})
})
// 修改用户
router.post('/usersupdate', function(req, res) {
	var id = req.body.user_id;
	var name = req.body.user_name;
	var pwd = req.body.user_pwd;
	var phone = req.body.user_phone;
	// 手机号正则表达式
	var telStr = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
	// 密码正则表达式
	var pwdStr = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
	// /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{8,16}$/   
	// [\s\S] 中的\s空白符，\S非空白符，所以[\s\S]是任意字符。也可以用 [\d\D]、[\w\W]来表示
	// 非空判断
	if (name == '' || pwd == '' || phone == '') {
		responseData.code = 1;
		responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}

	if (!(pwdStr.test(pwd))) {
		responseData.code = 2;
		responseData.msg = '密码格式不正确';
		res.json(responseData);
		return;
	}

	if (!(telStr.test(phone))) {
		responseData.code = 3;
		responseData.msg = '手机号格式不正确';
		res.json(responseData);
		return;
	}
	var sqlupdate = "update users set user_name = '" + name + "',user_pwd = '" + pwd + "',user_phone = '" + phone +
		"' where user_id ='" + id + "'";
	pool.query(sqlupdate, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '修改失败';
			res.json(responseData);
		} else {
			responseData.msg = '修改成功';
			res.json(responseData);
		}
	})
})
// 删除用户
router.get('/usersdelete/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
	var sqldel = 'delete from users where user_id = ' + id;
	pool.query(sqldel, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = "删除失败";
			res.json(responseData);
		} else {
			responseData.msg = "删除成功";
			res.json(responseData);
		}
	})
})
// ================================================= 首页 =================================================
// ---------------------- 目录 ------------------------//
// 搜索
router.post('/searchcatalog', function(req, res, next) {
	// 模糊查询两种方法直接在SQL语句后加 mysql.escape("%"+req.body.name+"%")
	// sql += " WHERE product_name LIKE "+mysql.escape("%"+req.body.name+"%")
	var sqlsearch = "select * from catalog"
	if (req.body.cg_alias) {
		sqlsearch += " where cg_alias like ?"; //'%1%';"
	}

	// sql+= ' limit ? offset ?';
	// let param = [ "%"+req.body.name+"%",pageNum, (page - 1) * pageNum ]

	var data = ["%" + req.body.cg_alias + "%"]
	pool.query(sqlsearch, data, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.pre = '搜索失败';
			responseData.msg = data;
			res.json(responseData);
		} else {
			responseData.pre = '搜索成功';
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
//添加
router.post('/catalogAdd', function(req, res, next) {
	var cg_alias = req.body.cg_alias;
	var cg_url = req.body.cg_url;
	var data = {
		cg_alias:cg_alias,
		cg_url:cg_url
	};

	// 判断是否为空
	if (cg_alias == '' || cg_url == '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlAdd = 'insert into catalog set ?';
	pool.query(sqlAdd, data, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '添加失败';
			res.json(responseData);
		} else {
			responseData.msg = '添加成功';
			res.json(responseData);
		}
	})
})
// 查询单条数据
router.post('/catalogId/:id', function(req, res, next) {
	var id = req.params.id;
	var sqlId = "select * from catalog where cg_id = '" + id + "'";
	pool.query(sqlId, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data;
				res.json(responseData);
		}
	})
})
// 修改
router.post('/catalogupdate', function(req, res, next) {
	var cg_id = req.body.cg_id;
	var cg_alias = req.body.cg_alias;
	var cg_url = req.body.cg_url;
	// 判断是否为空
	if (cg_id == '' || cg_alias == '' || cg_url == '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlupdate = "update catalog set cg_alias = '" + cg_alias + "',cg_url = '" + cg_url +
		"' where cg_id ='" + cg_id + "'";
	pool.query(sqlupdate, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '修改失败';
			res.json(responseData);
			console.log(err);
		} else {
			responseData.msg = '修改成功';
			res.json(responseData);
		}
	})
})
// 删除
router.get('/catalogdelete/:id', function(req, res, next) {
	var id = req.params.id;
	var sqldel = 'delete from catalog where cg_id = ' + id;
	pool.query(sqldel, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '删除失败';
			res.json(responseData);
		} else {
			responseData.msg = '删除成功';
			res.json(responseData);
		}
	})
})
// ---------------------- 话题 ------------------------//
// 搜索
router.post('/searchtipic', function(req, res, next) {
	// 模糊查询两种方法直接在SQL语句后加 mysql.escape("%"+req.body.name+"%")
	// sql += " WHERE product_name LIKE "+mysql.escape("%"+req.body.name+"%")
	var sqlsearch = "select * from tipic"
	if (req.body.title) {
		sqlsearch += " where title like ?"; //'%1%';"
	}

	// sql+= ' limit ? offset ?';
	// let param = [ "%"+req.body.name+"%",pageNum, (page - 1) * pageNum ]

	var data = ["%" + req.body.title + "%"]
	pool.query(sqlsearch, data, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.pre = '搜索失败';
			responseData.msg = data;
			res.json(responseData);
		} else {
			responseData.pre = '搜索成功';
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
// 添加
router.post('/tipicAdd', function(req, res, next) {
	var title = req.body.title;
	var data = {
		title:title
	};

	// 判断是否为空
	if (title == '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlAdd = 'insert into tipic set ?';
	pool.query(sqlAdd, data, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '添加失败';
			res.json(responseData);
		} else {
			responseData.msg = '添加成功';
			res.json(responseData);
		}
	})
})

// 查询单条数据
router.post('/tipicId/:id', function(req, res, next) {
	var id = req.params.id;
	var sqlId = "select * from tipic where id = '" + id + "'";
	pool.query(sqlId, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data;
				res.json(responseData);
		}
	})
})
// 修改
router.post('/tipicupdate', function(req, res, next) {
	var id = req.body.id;
	var title = req.body.title;
	// 判断是否为空
	if (id == '' || title == '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlupdate = "update tipic set title = '" + title + "'where id ='" + id + "'";
	pool.query(sqlupdate, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '修改失败';
			res.json(responseData);
			console.log(err);
		} else {
			responseData.msg = '修改成功';
			res.json(responseData);
		}
	})
})
// 删除
router.get('/tipicdelete/:id', function(req, res, next) {
	var id = req.params.id;
	var sqldel = 'delete from tipic where id = ' + id;
	pool.query(sqldel, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '删除失败';
			res.json(responseData);
		} else {
			responseData.msg = '删除成功';
			res.json(responseData);
		}
	})
})
// ================================================= 品牌 =================================================
// 搜索
router.post('/searchbrand', function(req, res, next) {
	// 模糊查询两种方法直接在SQL语句后加 mysql.escape("%"+req.body.name+"%")
	// sql += " WHERE product_name LIKE "+mysql.escape("%"+req.body.name+"%")
	var sqlsearch = "select * from brand"
	if (req.body.b_name_ch) {
		sqlsearch += " where b_name_ch like ?"; //'%1%';"
	}

	// sql+= ' limit ? offset ?';
	// let param = [ "%"+req.body.name+"%",pageNum, (page - 1) * pageNum ]

	var data = ["%" + req.body.b_name_ch + "%"]
	pool.query(sqlsearch, data, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.pre = '搜索失败';
			responseData.msg = data;
			res.json(responseData);
		} else {
			responseData.pre = '搜索成功';
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
router.post('/brandAdd', function(req, res, next) {
	var b_img = req.body.b_img;
	var b_name_ch = req.body.b_name_ch;
	var b_name_eh = req.body.b_name_eh;
	var b_content = req.body.b_content;
	var data = {
		b_name_ch:b_name_ch,
		b_name_eh:b_name_eh,
		b_img: b_img,
		b_content: b_content
	};

	// 判断是否为空
	if (b_name_ch == '' || b_name_eh == '' || b_img == '' || b_content == '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlAdd = 'insert into brand set ?';
	pool.query(sqlAdd, data, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '添加失败';
			res.json(responseData);
		} else {
			responseData.msg = '添加成功';
			res.json(responseData);
		}
	})
})
// 查询单条数据
router.post('/brandId/:id', function(req, res, next) {
	var id = req.params.id;
	var sqlId = "select * from brand where b_id = '" + id + "'";
	pool.query(sqlId, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data;
				res.json(responseData);
		}
	})
})
// 修改
router.post('/brandupdate', function(req, res, next) {
	var b_id = req.body.b_id;
	var b_img = req.body.b_img;
	var b_name_ch = req.body.b_name_ch;
	var b_name_eh = req.body.b_name_eh;
	var b_content = req.body.b_content;
	// 判断是否为空
	if (b_id == '' || b_img == '' || b_name_ch == '' || b_name_eh == '' || b_content == '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlupdate = "update brand set b_img = '" + b_img + "',b_name_ch = '" + b_name_ch +
		"',b_name_eh = '" + b_name_eh + "',b_content = '" + b_content + "' where b_id ='" + b_id + "'";
	pool.query(sqlupdate, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '修改失败';
			res.json(responseData);
			console.log(err);
		} else {
			responseData.msg = '修改成功';
			res.json(responseData);
		}
	})

})
// 删除
router.get('/branddelete/:id', function(req, res, next) {
	var id = req.params.id;
	var sqldel = 'delete from brand where b_id = ' + id;
	pool.query(sqldel, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '删除失败';
			res.json(responseData);
		} else {
			responseData.msg = '删除成功';
			res.json(responseData);
		}
	})
})

// ================================================= 品牌详情页 =================================================
//查询
router.post('/brandcon',function (req,res,next) {
	var sqlAll = "select * from brand a join brandclasscon b on a.b_id = b.b_id ORDER BY b.b_id asc";
	pool.query(sqlAll,function (err,data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '查询失败';
			res.json(responseData);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
// 查询下拉选择框
router.post('/brandconselect',function (req,res,nexxt) {
	var sqlname = 'select b_id,b_name_ch from brand';
	pool.query(sqlname,function (err,data) {
		if(err) {
			console.log(err);
			responseData.msg = '查询失败';
			res.json(responseData);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
// 搜索
router.post('/searchbrandcon', function(req, res, next) {
	// 模糊查询两种方法直接在SQL语句后加 mysql.escape("%"+req.body.name+"%")
	// sql += " WHERE product_name LIKE "+mysql.escape("%"+req.body.name+"%")
	var sqlsearch = "select * from brand a join brandclasscon b on a.b_id = b.b_id"
	if (req.body.bc_name) {
		sqlsearch += " where bc_name like ?"; //'%1%';"
	}

	// sql+= ' limit ? offset ?';
	// let param = [ "%"+req.body.name+"%",pageNum, (page - 1) * pageNum ]

	var data = ["%" + req.body.bc_name + "%"]
	pool.query(sqlsearch, data, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data
			res.json(responseData);
		}
	})
})
// 添加
router.post('/brandconAdd', function(req, res, next) {
	var bc_name = req.body.addbcname;
	var bc_img = req.body.addbcimg;
	var bc_num = req.body.addbcnum;
	var bc_score = req.body.addbcscore;
	var bc_first = req.body.addbcfirst;
	var bc_in = req.body.addbcin;
	var bc_after = req.body.addbcafter;
	var bc_smell = req.body.addbcsmell;
	var b_name_ch = req.body.addbnamech;
	var data = {
		bc_name: bc_name,
		bc_img: bc_img,
		bc_num: bc_num,
		bc_score: bc_score,
		bc_first: bc_first,
		bc_in: bc_in,
		bc_after: bc_after,
		bc_smell: bc_smell,
		b_id: b_name_ch,
	};

	// 判断是否为空
	if (b_name_ch === '' || bc_name === '' || bc_img === '' || bc_num === '' || bc_score === '' || bc_first === '' || bc_in === '' || bc_after === ''
		|| bc_smell === '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlAdd = 'insert into brandclasscon set ?';
	pool.query(sqlAdd, data, function(err, data) {
		if (err) {
			console.log(err);
			responseData.code = -1;
			responseData.msg = '添加失败';
			res.json(responseData);
		} else {
			responseData.msg = '添加成功';
			res.json(responseData);
		}
	})
})
// 查看 && 查询单条数据
router.get('/brandclassconId', function(req, res, next) {
	var id = JSON.stringify(req.query).substr(2,1);
	var sqlAll = "select * from brand a join brandclasscon b on a.b_id = b.b_id where b.b_id ='"+id+"'";
	pool.query(sqlAll, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
// 修改
router.post('/brandconupdate', function(req, res, next) {
	var bc_id = req.body.updatebcid;
	var bc_name = req.body.updatebcname;
	var bc_img = req.body.updatebcimg;
	var bc_num = req.body.updatebcnum;
	var bc_score = req.body.updatebcscore;
	var bc_first = req.body.updatebcfirst;
	var bc_in = req.body.updatebcin;
	var bc_after = req.body.updatebcafter;
	var bc_smell = req.body.updatebcsmell;
	var b_name_ch = req.body.updatebnamech;
	// 判断是否为空
	if (b_name_ch === '' || bc_name === '' || bc_img === '' || bc_num === '' || bc_score === '' || bc_first === '' || bc_in === '' || bc_after === ''
		|| bc_smell === '' || bc_id === '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlupdate = "update brandclasscon set bc_name = '" + bc_name + "',bc_img = '" + bc_img + "',bc_num = '" + bc_num +
		"',bc_score = '"+bc_score+"',bc_first = '"+bc_first+"',bc_in = '"+bc_in+"',bc_after = '"+bc_after+"'" +
		",bc_smell = '"+bc_smell+"',b_id = '" + b_name_ch + "' where bc_id ='" + bc_id + "'";
	pool.query(sqlupdate, function(err, data) {
		if (err) {
			console.log(err);
			responseData.code = -1;
			responseData.msg = '修改失败';
			res.json(responseData);
		} else {
			responseData.msg = '修改成功';
			res.json(responseData);
		}
	})
})
// 删除
router.get('/brandcondelete/:id', function(req, res, next) {
	var id = req.params.id;
	var sqldel = 'delete from brandclasscon where bc_id = ' + id;
	pool.query(sqldel, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '删除失败';
			res.json(responseData);
		} else {
			responseData.msg = '删除成功';
			res.json(responseData);
		}
	})
})
// ================================================= 气味分类 =================================================
// 搜索
router.post('/searchsmellclass', function(req, res, next) {
	// 模糊查询两种方法直接在SQL语句后加 mysql.escape("%"+req.body.name+"%")
	// sql += " WHERE product_name LIKE "+mysql.escape("%"+req.body.name+"%")
	var sqlsearch = "select * from smellclass"
	if (req.body.ss_title) {
		sqlsearch += " where ss_title like ?"; //'%1%';"
	}

	// sql+= ' limit ? offset ?';
	// let param = [ "%"+req.body.name+"%",pageNum, (page - 1) * pageNum ]

	var data = ["%" + req.body.ss_title + "%"]
	pool.query(sqlsearch, data, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data
			res.json(responseData);
		}
	})
})
// 查询单条数据
router.post('/smellclassId/:id', function(req, res, next) {
	var id = req.params.id;
	var sqlId = "select * from smellclass where ss_id = '" + id + "'";
	pool.query(sqlId, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
// 修改
router.post('/smellclassupdate', function(req, res, next) {
	var ss_id = req.body.ss_id;
	var ss_img = req.body.ss_img;
	var ss_title = req.body.ss_title;
	var ss_content = req.body.ss_content;
	// 判断是否为空
	if (ss_id == '' || ss_title == '' || ss_img == '' || ss_content == '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlupdate = "update smellclass set ss_img = '" + ss_img + "',ss_title = '" + ss_title + "',ss_content = '" + ss_content +
		"' where ss_id ='" + ss_id + "'";
	pool.query(sqlupdate, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '修改失败';
			res.json(responseData);
		} else {
			responseData.msg = '修改成功';
			res.json(responseData);
		}
	})
})
// 删除
router.get('/smellclassdelete/:id', function(req, res, next) {
	var id = req.params.id;
	var sqldel = 'delete from smellclass where ss_id = ' + id;
	pool.query(sqldel, function(err, data) {
		if (err) {
			console.log(err);
			responseData.code = -1;
			responseData.msg = '删除失败';
			res.json(responseData);
		} else {
			responseData.msg = '删除成功';
			res.json(responseData);
		}
	})
})
// ================================================= 气味 =================================================
// 分类产品
// 查询
router.post('/smell',function(req,res,next){
	var sqlAll = "select * from smell a join smellclass b on a.ss_id = b.ss_id";
	pool.query(sqlAll,function(err,data){
		if (err) {
			responseData.code = -1;
			responseData.msg = '查询失败';
			res.json(responseData);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	});
})
// 搜索
router.post('/searchsmell', function(req, res, next) {
	// 模糊查询两种方法直接在SQL语句后加 mysql.escape("%"+req.body.name+"%")
	// sql += " WHERE product_name LIKE "+mysql.escape("%"+req.body.name+"%")
	var sqlsearch = "select * from smell a join smellclass b on a.ss_id = b.ss_id "
	if (req.body.s_name_ch) {
		sqlsearch += " where s_name_ch like ?"; //'%1%';"
	}

	// sql+= ' limit ? offset ?';
	// let param = [ "%"+req.body.name+"%",pageNum, (page - 1) * pageNum ]

	var data = ["%" + req.body.s_name_ch + "%"]
	pool.query(sqlsearch, data, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data
			res.json(responseData);
		}
	})
})
// 查询下拉选择框
router.post('/smellselect',function (req,res,next) {
	var sqlname = 'select ss_id,ss_title from smellclass';
	pool.query(sqlname,function (err,data) {
		if(err) {
			console.log(err);
			responseData.msg = '查询失败';
			res.json(responseData);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
// 添加
router.post('/smelladd', function(req, res, next) {
	var ss_title = req.body.ss_title;
	var s_img = req.body.s_img;
	var s_name_chadd = req.body.s_name_chadd;
	var s_name_ehadd = req.body.s_name_ehadd;
	var s_content_add = req.body.s_content_add;
	var data = {
		s_name_ch: s_name_chadd,
		s_name_eh:s_name_ehadd,
		s_img: s_img,
		s_content:s_content_add,
		ss_id: ss_title
	};

	// 判断是否为空
	if (ss_title == '' || s_img == '' || s_name_chadd == '' || s_name_ehadd == '' || s_content_add == '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlAdd = 'insert into smell set ?';
	pool.query(sqlAdd, data, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '添加失败';
			res.json(responseData);
			console.log(err);
		} else {
			responseData.msg = '添加成功';
			res.json(responseData);
		}
	})
})
// 查询单条数据
router.post('/smellId/:id', function(req, res, next) {
	var id = req.params.id;
	var sqlId = "select * from smell a join smellclass b on a.ss_id = b.ss_id where a.s_id  = '" + id + "'";
	pool.query(sqlId, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
// 修改
router.post('/smellupdate', function(req, res, next) {
	var s_id = req.body.s_id;
	var ss_title = req.body.ss_title;
	var s_img = req.body.s_img;
	var s_name_ch = req.body.s_name_ch;
	var s_name_eh = req.body.s_name_eh;
	var s_content = req.body.s_content;
	// 判断是否为空
	if (s_id == '' || ss_title == '' || s_img == '' || s_name_ch == '' || s_name_eh == '' || s_content == '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlupdate = "update smell set s_name_ch = '" + s_name_ch + "',s_name_eh = '" + s_name_eh + "',s_img ='"+s_img+"',s_content = '" + s_content +
		"',ss_id = '" + ss_title + "' where s_id ='" + s_id + "'";
	pool.query(sqlupdate, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '修改失败';
			res.json(responseData);
			console.log(err);
		} else {
			responseData.msg = '修改成功';
			res.json(responseData);
		}
	})
})
// 删除
router.get('/smelldelete/:id', function(req, res, next) {
	var id = req.params.id;
	var sqldel = 'delete from smell where s_id = ' + id;
	pool.query(sqldel, function(err, data) {
		if (err) {
			console.log(err);
			responseData.code = -1;
			responseData.msg = '删除失败';
			res.json(responseData);
		} else {
			responseData.msg = '删除成功';
			res.json(responseData);
		}
	})
})
// ================================================= 气味详情页 =================================================
//查询
router.post('/smellcon',function (req,res,next) {
	var sqlAll = "select * from smellcon a join smell b on a.s_id = b.s_id";
	pool.query(sqlAll,function (err,data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '查询失败';
			res.json(responseData);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
// 搜索
router.post('/searchsmellcon', function(req, res, next) {
	// 模糊查询两种方法直接在SQL语句后加 mysql.escape("%"+req.body.name+"%")
	// sql += " WHERE product_name LIKE "+mysql.escape("%"+req.body.name+"%")
	var sqlsearch = "select * from smellcon a join smell b on a.s_id = b.s_id"
	if (req.body.sc_title) {
		sqlsearch += " where sc_title like ?"; //'%1%';"
	}

	// sql+= ' limit ? offset ?';
	// let param = [ "%"+req.body.name+"%",pageNum, (page - 1) * pageNum ]

	var data = ["%" + req.body.sc_title + "%"]
	pool.query(sqlsearch, data, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data
			res.json(responseData);
		}
	})
})
// 查询下拉选择框
router.post('/smellconselect',function (req,res,nexxt) {
	var sqlname = 'select * from smell';
	pool.query(sqlname,function (err,data) {
		if(err) {
			console.log(err);
			responseData.msg = '查询失败';
			res.json(responseData);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
// 添加
router.post('/smellconAdd', function(req, res, next) {
	var sc_title = req.body.sc_name;
	var sc_img = req.body.sc_img;
	var sc_num = req.body.sc_num;
	var sc_score = req.body.sc_score;
	var sc_first = req.body.sc_first;
	var sc_in = req.body.sc_in;
	var sc_after = req.body.sc_after;
	var sc_smell = req.body.sc_smell;
	var s_name_ch = req.body.s_name_ch;
	var data = {
		sc_title: sc_title,
		sc_img: sc_img,
		sc_num: sc_num,
		sc_score: sc_score,
		sc_first: sc_first,
		sc_in: sc_in,
		sc_after: sc_after,
		sc_smell: sc_smell,
		s_id: s_name_ch,
	};

	// 判断是否为空
	if (sc_title === '' || s_name_ch === '' || sc_img === '' || sc_num === '' || sc_score === '' || sc_first === '' || sc_in === '' || sc_after === ''
		|| sc_smell === '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlAdd = 'insert into smellcon set ?';
	pool.query(sqlAdd, data, function(err, data) {
		if (err) {
			console.log(err);
			responseData.code = -1;
			responseData.msg = '添加失败';
			res.json(responseData);
		} else {
			responseData.msg = '添加成功';
			res.json(responseData);
		}
	})
})
// 查看 && 查询单条数据
router.get('/smellconId', function(req, res, next) {
	var id = JSON.stringify(req.query).substr(2,1);
	var sqlAll = "select * from smellcon a join smell b on a.s_id = b.s_id where a.sc_id ='"+id+"'";
	pool.query(sqlAll, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
//修改
router.post('/smellconupdate', function(req, res, next) {
	var sc_id = req.body.sc_id;
	var sc_title = req.body.sc_name;
	var sc_img = req.body.sc_img;
	var sc_num = req.body.sc_num;
	var sc_score = req.body.sc_score;
	var sc_first = req.body.sc_first;
	var sc_in = req.body.sc_in;
	var sc_after = req.body.sc_after;
	var sc_smell = req.body.sc_smell;
	var s_name_ch = req.body.s_name_ch;

	// 判断是否为空
	if (sc_title == '' || s_name_ch == '' || sc_img == '' || sc_num == '' || sc_score == '' || sc_first == '' || sc_in == '' || sc_after == ''
		|| sc_smell == '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlupdate = "update smellcon set sc_title = '" + sc_title + "',sc_img = '" + sc_img + "',sc_num = '" + sc_num +
		"',sc_score = '"+sc_score+"',sc_first = '"+sc_first+"',sc_in = '"+sc_in+"',sc_after = '"+sc_after+"'" +
		",sc_smell = '"+sc_smell+"',s_id = '" + s_name_ch + "' where sc_id ='" + sc_id + "'";
	pool.query(sqlupdate, function(err, data) {
		if (err) {
			console.log(err);
			responseData.code = -1;
			responseData.msg = '修改失败';
			res.json(responseData);
		} else {
			responseData.msg = '修改成功';
			res.json(responseData);
		}
	})
})
// 删除
router.get('/smellcondelete/:id', function(req, res, next) {
	var id = req.params.id;
	var sqldel = 'delete from smellcon where sc_id = ' + id;
	pool.query(sqldel, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '删除失败';
			res.json(responseData);
		} else {
			responseData.msg = '删除成功';
			res.json(responseData);
		}
	})
})
// ================================================= 调香师 =================================================
// 搜索
router.post('/searchper', function(req, res, next) {
	// 模糊查询两种方法直接在SQL语句后加 mysql.escape("%"+req.body.name+"%")
	// sql += " WHERE product_name LIKE "+mysql.escape("%"+req.body.name+"%")
	var sqlsearch = "select * from perfumer"
	if (req.body.pc_name) {
		sqlsearch += " where pc_name like ?"; //'%1%';"
	}

	// sql+= ' limit ? offset ?';
	// let param = [ "%"+req.body.name+"%",pageNum, (page - 1) * pageNum ]

	var data = ["%" + req.body.pc_name + "%"]
	pool.query(sqlsearch, data, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data
			res.json(responseData);
		}
	})
})
// 添加
router.post('/perfumerAdd', function(req, res, next) {
	var pc_img = req.body.pc_img;
	var pc_name = req.body.pc_name;
	var pc_introduce = req.body.pc_introduce;
	var data = {
		pc_img: pc_img,
		pc_name: pc_name,
		pc_introduce: pc_introduce
	};

	// 判断是否为空
	if (pc_img == '' || pc_name == '' || pc_introduce == '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlAdd = 'insert into perfumer set ?';
	pool.query(sqlAdd, data, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '添加失败';
			res.json(responseData);
		} else {
			responseData.msg = '添加成功';
			res.json(responseData);
		}
	})
})
// 查询单条数据
router.post('/perfumerId/:id', function(req, res, next) {
	var id = req.params.id;
	var sqlId = "select * from perfumer where pc_id = '" + id + "'";
	pool.query(sqlId, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
// 修改
router.post('/perfumerupdate', function(req, res, next) {
	var pc_id = req.body.pc_id;
	var pc_img = req.body.pc_img;
	var pc_name = req.body.pc_name;
	var pc_introduce = req.body.pc_introduce;
	// 判断是否为空
	if (pc_id == '' || pc_img == '' || pc_name == '' || pc_introduce == '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlupdate = "update perfumer set pc_img = '" + pc_img + "',pc_name = '" + pc_name + "',pc_introduce = '" + pc_introduce +
		"' where pc_id ='" + pc_id + "'";
	pool.query(sqlupdate, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '修改失败';
			res.json(responseData);
		} else {
			responseData.msg = '修改成功';
			res.json(responseData);
		}
	})
})
// 删除
router.get('/perfumerdelete/:id', function(req, res, next) {
	var id = req.params.id;
	var sqldel = 'delete from perfumer where pc_id = ' + id;
	pool.query(sqldel, function(err, data) {
		if (err) {
			console.log(err);
			responseData.code = -1;
			responseData.msg = '删除失败';
			res.json(responseData);
		} else {
			responseData.msg = '删除成功';
			res.json(responseData);
		}
	})
})
// ================================================= 调香师详情页 =================================================
//查询
router.post('/perfumercon',function (req,res,next) {
	var sqlAll = "select * from perfumercon a join perfumer b on a.pc_id =b.pc_id ORDER BY b.pc_id asc";
	pool.query(sqlAll,function (err,data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '查询失败';
			res.json(responseData);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
// 搜索
router.post('/searchpercon', function(req, res, next) {
	// 模糊查询两种方法直接在SQL语句后加 mysql.escape("%"+req.body.name+"%")
	// sql += " WHERE product_name LIKE "+mysql.escape("%"+req.body.name+"%")
	var sqlsearch = "select * from perfumercon a join perfumer b on a.pc_id =b.pc_id "
	if (req.body.pf_name) {
		sqlsearch += " where pf_name like ?"; //'%1%';"
	}

	// sql+= ' limit ? offset ?';
	// let param = [ "%"+req.body.name+"%",pageNum, (page - 1) * pageNum ]

	var data = ["%" + req.body.pf_name + "%"]
	pool.query(sqlsearch, data, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data
			res.json(responseData);
		}
	})
})
// 查询下拉选择框
router.post('/perfumerconselect',function (req,res,nexxt) {
	var sqlname = 'select pc_id,pc_name from perfumer';
	pool.query(sqlname,function (err,data) {
		if(err) {
			console.log(err);
			responseData.msg = '查询失败';
			res.json(responseData);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
// 添加
router.post('/perfumerconAdd', function(req, res, next) {
	var pf_name = req.body.addpfname;
	var pf_img = req.body.addpfimg;
	var pf_num = req.body.addpfnum;
	var pf_score = req.body.addpfscore;
	var pf_first = req.body.addpffirst;
	var pf_in = req.body.addpfin;
	var pf_after = req.body.addpfafter;
	var pf_smell = req.body.addpfsmell;
	var pc_name = req.body.addpcname;
	var data = {
		pf_name: pf_name,
		pf_img: pf_img,
		pf_num: pf_num,
		pf_score: pf_score,
		pf_first: pf_first,
		pf_in: pf_in,
		pf_after: pf_after,
		pf_smell: pf_smell,
		pc_id: pc_name,
	};

	// 判断是否为空
	if (pf_name === '' || pc_name === '' || pf_img === '' || pf_num === '' || pf_score === '' || pf_first === '' || pf_in === '' || pf_after === ''
		|| pf_smell === '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlAdd = 'insert into perfumercon set ?';
	pool.query(sqlAdd, data, function(err, data) {
		if (err) {
			console.log(err);
			responseData.code = -1;
			responseData.msg = '添加失败';
			res.json(responseData);
		} else {
			responseData.msg = '添加成功';
			res.json(responseData);
		}
	})
})
// 查看 && 查询单条数据
router.get('/perfumerconId', function(req, res, next) {
	var id = JSON.stringify(req.query).substr(2,1);
	var sqlAll = "select * from perfumercon a join perfumer b on a.pc_id =b.pc_id where a.pf_id ='"+id+"'";
	pool.query(sqlAll, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			responseData.msg = data;
			res.json(responseData);
		}
	})
})
//修改
router.post('/perfumerconupdate', function(req, res, next) {
	var pf_id = req.body.updatepfid;
	var pf_name = req.body.updatepfname;
	var pf_img = req.body.updatepfimg;
	var pf_num = req.body.updatepfnum;
	var pf_score = req.body.updatepfscore;
	var pf_first = req.body.updatepffirst;
	var pf_in = req.body.updatepfin;
	var pf_after = req.body.updatepfafter;
	var pf_smell = req.body.updatepfsmell;
	var pc_name = req.body.updatepcname;

	// 判断是否为空
	if (pf_id === '' || pf_name === '' || pc_name === '' || pf_img === '' || pf_num === '' || pf_score === '' || pf_first === '' || pf_in === '' || pf_after === ''
		|| pf_smell === '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlupdate = "update perfumercon set pf_name = '" + pf_name + "',pf_img = '" + pf_img + "',pf_num = '" + pf_num +
		"',pf_score = '"+pf_score+"',pf_first = '"+pf_first+"',pf_in = '"+pf_in+"',pf_after = '"+pf_after+"'" +
		",pf_smell = '"+pf_smell+"',pc_id = '" + pc_name + "' where pf_id ='" + pf_id + "'";
	pool.query(sqlupdate, function(err, data) {
		if (err) {
			console.log(err);
			responseData.code = -1;
			responseData.msg = '修改失败';
			res.json(responseData);
		} else {
			responseData.msg = '修改成功';
			res.json(responseData);
		}
	})
})
// 删除
router.get('/perfumercondelete/:id', function(req, res, next) {
	var id = req.params.id;
	var sqldel = 'delete from perfumercon where pf_id = ' + id;
	pool.query(sqldel, function(err, data) {
		if (err) {
			responseData.code = -1;
			responseData.msg = '删除失败';
			res.json(responseData);
		} else {
			responseData.msg = '删除成功';
			res.json(responseData);
		}
	})
})

module.exports = router;
