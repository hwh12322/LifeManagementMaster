const mysql = require('mysql')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const express = require('express')
const router = express.Router()
const cors = require('cors')

const db = mysql.createPool({
    host: '0k8.h.filess.io',
    port: '3307',
    user: 'LiveManagement_judgetest',
    password: '77c7b67ea55e201eb1790f9e74210fd5181a4a0d',
    database: 'users_db'
})

router.use(cors())

let insertSql = 'INSERT INTO users(username,password) VALUES(?,?)'
let selectSql = 'SELECT * FROM users where username=? and password=?'
let changePasswordSql = 'UPDATE users SET password=? where username=? and password=?'
let changeUsernameSql = 'UPDATE users SET username=? where username=?'

router.post('/register', urlencodedParser, (req, res) => {
    let { username, password } = req.body
    db.query(insertSql, [username, password], (err, result) => {
        if (err) {
            console.log(err.message);
            return res.status(200).json({ status: 1, message: '用户名已被注册' })
        } else {
            console.log('insert success');
            return res.status(200).json({ status: 0, message: '注册成功' })
        }
    })
})

router.post('/login', urlencodedParser, (req, res) => {
    let { username, password } = req.body
    db.query(selectSql, [username, password], (err, result) => {
        if (err) {
            console.log(err.message);
            res.end(err.message);
        } else {
            if (result.length === 0) {
                return res.status(200).json({ status: 1, message: 'username or password error' })
                console.log('username or password error');
            }
            else {//登录成功
                return res.status(200).json({ status: 0, message: 'login success' })
            }
        }
    })
})



router.post('/UserInfoChange', urlencodedParser, (req, res) => {
    console.log(req.body);
    let { username, newUsername, password, newPassword } = req.body
    db.query(changePasswordSql, [newPassword, username, password], (err, result) => {
        if (err) {
            console.log(err.message);
            res.end(err.message + " ");
        } else {
            if (result.affectedRows === 0) {
                console.log('update password error');
                return res.status(200).json({ status: 1, message: '原密码错误' })
            }
            else {//修改密码成功
                console.log('update success');
                console.log(result);
                db.query(changeUsernameSql, [newUsername, username], (err, result) => {
                    if (err) {
                        console.log(err.message);
                        return res.status(200).json({ status: 1, message: '用户名已被注册' })
                    } else {//修改用户名成功
                        return res.status(200).json({ status: 0, message: '用户信息修改成功' })
                    }
                })
            }
        }
    })
})
module.exports = router