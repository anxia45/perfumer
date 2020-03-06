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

//--------------------------------------------用户-----------------------------------------//
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
//--------------------------------------------首页---------------------------------------//
//  =================================目录
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
//  =================================话题
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
//--------------------------------------------品牌---------------------------------------//
// 搜索
router.post('/searchbrand', function(req, res, next) {
	// 模糊查询两种方法直接在SQL语句后加 mysql.escape("%"+req.body.name+"%")
	// sql += " WHERE product_name LIKE "+mysql.escape("%"+req.body.name+"%")
	var sqlsearch = "select * from brandClassContent"
	if (req.body.bcc_name_ch) {
		sqlsearch += " where bcc_name_ch like ?"; //'%1%';"
	}

	// sql+= ' limit ? offset ?';
	// let param = [ "%"+req.body.name+"%",pageNum, (page - 1) * pageNum ]

	var data = ["%" + req.body.bcc_name_ch + "%"]
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
	var bcc_img = req.body.bcc_img;
	var bcc_name_ch = req.body.bcc_name_ch;
	var bcc_name_eh = req.body.bcc_name_eh;
	var bcc_url = req.body.bcc_url;
	var data = {
		bcc_img: bcc_img,
		bcc_name_ch: bcc_name_ch,
		bcc_name_eh: bcc_name_eh,
		bcc_url: bcc_url
	};

	// 判断是否为空
	if (bcc_img == '' || bcc_name_ch == '' || bcc_name_eh == '' || bcc_url == '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlAdd = 'insert into brandClassContent set ?';
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
	var sqlId = "select * from brandClassContent where bcc_id = '" + id + "'";
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
	var bcc_id = req.body.bcc_id;
	var bcc_img = req.body.bcc_img;
	var bcc_name_ch = req.body.bcc_name_ch;
	var bcc_name_eh = req.body.bcc_name_eh;
	var bcc_url = req.body.bcc_url;
	// 判断是否为空
	if (bcc_id == '' || bcc_img == '' || bcc_name_ch == '' || bcc_name_eh == '' || bcc_url == '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlupdate = "update brandClassContent set bcc_img = '" + bcc_img + "',bcc_name_ch = '" + bcc_name_ch +
		"',bcc_name_eh = '" + bcc_name_eh + "',bcc_url = '" + bcc_url + "' where bcc_id ='" + bcc_id + "'";
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
	var sqldel = 'delete from brandClassContent where bcc_id = ' + id;
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
//--------------------------------------------调香师---------------------------------------//
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
			responseData.code = -1;
			responseData.msg = '删除失败';
			res.json(responseData);
		} else {
			responseData.msg = '删除成功';
			res.json(responseData);
		}
	})
})
// ===========================================调香师详情页==============================================
//查询
router.post('/perfumercon',function (req,res,next) {
	var sqlAll = "select * from perfumercon a join perfumer b on a.pc_id =b.pc_id";
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

})
// 添加
router.post('/perfumerconAdd', function(req, res, next) {
	var addpfname = req.body.addpfname;
	var addpfimg = req.body.addpfimg;
	var addpfnum = req.body.addpfnum;
	var addpfscore = req.body.addpfscore;
	var addpffirst = req.body.addpffirst;
	var addpfin = req.body.addpfin;
	var addpfafter = req.body.addpfafter;
	var addpfsmell = req.body.addpfsmell;
	var data = {
		addpfname: addpfname,
		addpfimg: addpfimg,
		addpfnum: addpfnum,
		addpfscore: addpfscore,
		addpffirst: addpffirst,
		addpfin: addpfin,
		addpfafter: addpfafter,
		addpfsmell: addpfsmell
	};

	// 判断是否为空
	if (addpfname == '' || addpfimg == '' || addpfnum == '' || addpfscore == '') {
		responseData.code = 1,
			responseData.msg = '内容不能为空';
		res.json(responseData);
		return;
	}
	var sqlAdd = 'insert into perfumercon set ?';
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

// 查看
router.get('/perfumerconId', function(req, res, next) {
	var id = JSON.stringify(req.query).substr(2,1);
	var sqlAll = "select * from perfumercon a join perfumer b on a.pc_id =b.pc_id where b.pc_id ='"+id+"'";
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
