var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('frontend/index');
})

router.get('/backstage', function(req, res, next) {
	res.render('backstage/index');
})
//------------------------------------------后端管理--------------------------------------//
// 用户
router.get('/user', function(req, res, next) {
	res.render('backstage/user');
});

// 首页
router.get('/homepage', function(req, res, next) {
	res.render('backstage/homepage');
});
// 目录
router.get('/catalog', function(req, res, next) {
	res.render('backstage/catalog');
});
// 轮播
router.get('/carousel', function(req, res, next) {
	res.render('backstage/carousel');
});
// 热门话题
router.get('/tipic', function(req, res, next) {
	res.render('backstage/tipic');
});
// 常见问题
router.get('/answer', function(req, res, next) {
	res.render('backstage/answer');
});
// 香评达人
router.get('/member', function(req, res, next) {
	res.render('backstage/member');
});

// 品牌
router.get('/brand', function(req, res, next) {
	res.render('backstage/brand');
});
// 品牌内容
router.get('/brandcon', function(req, res, next) {
	res.render('backstage/brandcon');
});

// 香调
router.get('/fragrancenotes', function(req, res, next) {
	res.render('backstage/fragrancenotes');
})

router.get('/fragrancenotescon', function(req, res, next) {
	res.render('backstage/fragrancenotescon')
})

// 气味分类
router.get('/smellclass', function(req, res, next) {
	res.render('backstage/smellclass');
});

// 气味
router.get('/smell', function(req, res, next) {
	res.render('backstage/smell');
});
// 气味内容
router.get('/smellcon', function(req, res, next) {
	res.render('backstage/smellcon');
});
// 调香师
router.get('/perfumer', function(req, res, next) {
	res.render('backstage/perfumer');
});
// 调香师内容
router.get('/perfumercon', function(req, res, next) {
	res.render('backstage/perfumercon');
});
// 登录
router.get('/login', function(req, res, next) {
	res.render('backstage/login');
});

// ===============================================================
// 测试
router.get('/file', function(req, res, next) {
	res.render('backstage/file');
})

module.exports = router;
