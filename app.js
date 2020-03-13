/*
 入口
 服务端 app.js
 */
// 加载express模块
var express = require('express');
// 加载模板处理模块
var swig = require('swig');
// 加载body-parser,用来处理post提交过来的数据
var bodyParser = require('body-parser');
// 加载session模块
var session = require('express-session');
// 加载cookie-parser模板
var  cookieParser= require('cookie-parser');
//
var multiparty = require('multiparty');
//
var fs = require('fs');
var router = express.Router();
// 创建webf服务器
var app = express();

// 引入路由器
var userRouter = require('./routers/admin')
var mainRouter = require('./routers/main')
var apiRouter = require('./routers/api')
var cartRouter = require('./routers/cart');

app.listen(8088, function(err) {
	if(!err){
		console.log('Server is running in port 8088');
	}else{
		console.log(err);
	}
});

//处理facivon.ico
router.get('/favicon.ico',function(req,res){});

// session
app.use(cookieParser('sessionAn'));
app.use(session({
	secret: 'sessionAn', // 与cookieParser中的一致
	resave: true,
	saveUninitialized: true,
	 cookie: { maxAge: 60 }
}));

// 设置静态文件托管
// 当用户访问的url以/public开始，那么直接返回对应的__dirname+'/public'下的文件
app.use('/public', express.static(__dirname + '/public'));
// path.join(__dirname, 'public') 表示工程路径后面追加 public
// app.use(express.static(path.join(__dirname, 'public')))

/**
 * 图片显示不出来(可配置虚拟托管静态文件)
 * uploads\RZdCnWyxuY0E8dGHmdD1rSyI.jpg
 * 在uploads这个路径下的uploads目录中找
 */
app.use('/uploads',express.static('uploads'));
//获取表单提交的数据以及post提交过来的图片
app.post('/uploads',(req,res) => {
	//获取表单提交的数据以及post提交过来的图片
	var form = new multiparty.Form();
	// console.log(form)
	form.uploadDir='uploads'; //上传图片保存的地址 目录必须存在
	form.parse(req, function(err, fields, files) {
		//获取提交的数据以及图片上传成功返回的图片信息
		console.log(fields);//获取表单的数据
		// console.log(files);//图片上传成功返回的信息
		var filesTmp = JSON.stringify(files,null,2);
		if (err) {
			console.log(err);
		} else {
			console.log(filesTmp);
						console.log('rename ok');
						res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
						res.end("{'status':200, 'message': '上传成功！'}");
			// var inputFile = files.pic[0];
			// var uploadedPath = inputFile.path;
			// var dstPath = 'uploads' + inputFile.originalFilename;
		//	重命名为真实文件名称
		// 	fs.rename(uploadedPath,dstPath,function (err) {
		// 		if (err) {
		// 			console.log(err);
		// 			res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
		// 			res.end("{'status':100, 'message': '上传失败！'}");
		// 		} else {
		// 			console.log('rename ok');
		// 			res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
		// 			res.end("{'status':200, 'message': '上传成功！'}");
		// 		}
		// 	})

		}
	});
})
// 配置应用模板
// 定义当前应用所使用的模板引擎
app.engine('html', swig.renderFile);
// 设置模板文件存放的目录
app.set('views', './views');
// 注册所使用的模板引擎;
// 参数1：必须是view engine,
// 参数2：和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的。
app.set('view engine', 'html');
// 在开发过程中，需要取消模板缓存
swig.setDefaults({
	cache: false
});
//bodyparser设置
app.use(bodyParser.urlencoded({
	extended: true
}));
// 挂载路由器
app.use('/admin', userRouter);
app.use('/api', apiRouter);
app.use('/', mainRouter);
app.use('/cart', cartRouter);

////////////////////// 所有路由定义完之后，最后做404处理 /////////////////////////////  无效
router.use('*', function (req, res){
	console.log('404 handler..')
	res.render('404.html', {
		status: 404,
		title: 'NodeBlog',
	});
});
