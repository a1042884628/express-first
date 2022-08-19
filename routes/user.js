//引入exress包
const express = require('express');
//引入连接池模块
const pool = require('../pool.js');
//console.log(pool);
//创建路由器对象
const router = express.Router();
//添加路由
//1.用户注册  post  /reg  接口地址：http://127.0.0.1:8080/user/reg
router.post('/reg', (req, res) => {
	//1.1获取post请求的数据
	let obj = req.body;
	console.log(obj);
	//1.2验证数据是否为空
	if (!obj.uname) {
		res.send({
			statecode: 401,
			message: 'uname required'
		});
		//阻止往后执行
		return;
	}
	if (!obj.upwd) {
		res.send({
			statecode: 402,
			message: 'upwd required'
		});
		return;
	}
	if (!obj.email) {
		res.send({
			statecode: 403,
			message: 'email required'
		});
		return;
	}
	if (!obj.phone) {
		res.send({
			statecode: 404,
			message: 'phone required'
		});
		return;
	}
	//1.3执行SQL命令
	pool.query('INSERT INTO user SET ?', [obj], (err, result) => {
		if (err) throw err;
		console.log(result);
		//注册成功
		res.send({
			statecode: 200,
			message: 'reg success'
		});
	});
});
//2.用户登录  post  /login  接口地址：http://127.0.0.1:8080/user/login
router.post('/login', (req, res) => {
	//2.1获取post请求的数据
	let obj = req.body;
	console.log(obj);
	//2.2验证数据是否为空
	if (!obj.uname) {
		res.send({
			statecode: 401,
			message: 'uname required'
		});
		return;
	}
	if (!obj.upwd) {
		res.send({
			statecode: 402,
			message: 'upwd required'
		});
		return;
	}
	//2.3执行SQL命令
	//到数据中查询是否有用户名和密码同时匹配的数据
	pool.query('SELECT * FROM user WHERE uname=? AND upwd=?', [obj.uname, obj.upwd], (err, result) => {
		if (err) throw err;
		//返回的结果是空数组，长度为0，说明登录失败
		console.log(result);
		if (result.length === 0) {
			res.send({
				statecode: 301,
				message: 'login err'
			});
		} else { //查询到了匹配的用户，登录是成功
			res.send({
				statecode: 200,
				message: 'login success'
			});
		}
	});
});
//3.修改用户  get  /update  接口地址：http://127.0.0.1:8080/user/update
router.get('/update', (req, res) => {
	//3.1获取查询字符串传递的数据
	let obj = req.query;
	console.log(obj);
	//3.2使用for-in遍历对象，验证各项是否为空
	//声明变量用于保存状态码
	let i = 400;
	for (let k in obj) {
		//每循环一个属性，i加1
		i++;
		//k代表每个属性名  obj[k]代表对应的属性值
		//console.log(k,obj[k]);
		//如果属性值为空，则提示该项属性不能为空
		if (!obj[k]) {
			res.send({
				statecode: i,
				message: k + ' required'
			});
			return;
		}
	}
	//3.3执行SQL命令
	//修改数据，将整个对象修改
	pool.query('UPDATE user SET ? WHERE id=?', [obj, obj.id], (err, result) => {
		if (err) throw err;
		//返回的是对象，如果对象下的affectedRows为0说明修改失败，否则修改成功
		console.log(result);
		if (result.affectedRows === 0) {
			res.send({
				statecode: 301,
				message: 'update err'
			});
		} else {
			res.send({
				statecode: 200,
				message: 'update success'
			});
		}
	});
});
//4.删除用户  get  /delete  接口地址：http://127.0.0.1:8080/user/delete
router.get('/delete', (req, res) => {
	//4.1获取查询字符串传递的数据
	let obj = req.query;
	console.log(obj);
	//4.2验证数据是否为空
	if (!obj.id) {
		res.send({
			statecode: 401,
			message: 'id required'
		});
		return;
	}
	//4.3执行SQL命令
	pool.query('DELETE FROM user WHERE id=?', [obj.id], (err, result) => {
		if (err) throw err;
		//返回对象，通过affectedRows判断是否删除成功
		console.log(result);
		if (result.affectedRows === 0) {
			res.send({
				statecode: 200,
				message: 'delete success'
			});
		} else {
			res.send({
				statecode: 301,
				message: 'delete err'
			});
		}
	});
});
//查询所有用户
//   /user/userlist  接口地址：http://127.0.0.1:8080/user/userlist
router.get("/userlist", (req, res) => {
	// 准备sql语句
	var sql = "select * from user";
	//连接池查询数据库
	pool.query(sql, (err, result) => {
		console.log('result', result)
		if (err) throw err;
		//把查询结果当做响应传给前台
		res.send({
			statecode: 200,
			message: 'success',
			data:result
		});
	});
});

// 查询对应uid的用户
//   /user/userlist_uid  接口地址：http://127.0.0.1:8080/user/userlist_id
router.get("/userlist_id", (req, res) => {
	let obj = req.query;
	// console.log(obj)
	// 准备sql语句
	var sql = "select * from user where id=?";
	//连接池查询数据库
	pool.query(sql, [obj.uid], (err, result) => {
		if (err) throw err;
		//把查询结果当做响应传给前台
		res.send(result);
	});
});
//导出路由器
module.exports = router;
