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


let insertSql = 'INSERT INTO tasks(user_id,task_name,start_time,end_time,remark) VALUES((SELECT id FROM users WHERE username=?),?,?,?,?)'
let selectSql = 'SELECT task_id,task_name,start_time,end_time,remark,is_done FROM tasks WHERE user_id=(SELECT id FROM users WHERE username=?)'
let updateSql = 'UPDATE tasks SET task_name=?,start_time=?,end_time=?,remark=?,is_done=? WHERE task_id=?'
let deleteSql = 'DELETE FROM tasks WHERE task_id=?'
router.post('/addtask', urlencodedParser, (req, res) => {
    let { username, task_name, start_time, end_time, remark } = req.body
    db.query(insertSql, [username, task_name, start_time, end_time, remark], (err, result) => {
        if (err) {
            console.log(err.message);
            res.status(200).json({ status: 1, message: 'add task error' })
        } else {
            res.status(200).json({ status: 0, message: 'add task success' })
        }
    })
})

router.get('/getTask', urlencodedParser, (req, res) => {
    db.query(selectSql, req.query.username, (err, result) => {
        if (err) {
            console.log(err.message);
            res.status(200).json({ status: 1, message: 'show task error' })
        } else {
            res.status(200).json({ status: 0, message: 'show task success', tasks: result })
        }
    })
})

router.post('/modifyTask', urlencodedParser, (req, res) => {
    let { task_id, task_name, start_time, end_time, remark, is_done } = req.body
    console.log(req.body);
    db.query(updateSql, [task_name, start_time, end_time, remark, is_done, task_id], (err, result) => {
        if (err) {
            console.log(err.message);
            res.status(200).json({ status: 1, message: 'modify task error' })
        } else {
            console.log('update success');
            res.status(200).json({ status: 0, message: 'modify task success' })
        }
    })
})

router.get('/deleteTask', urlencodedParser, (req, res) => {
    console.log(req.query);
    db.query(deleteSql, req.query.task_id, (err, result) => {
        if (err) {
            console.log(err.message);
            res.status(200).json({ status: 1, message: 'delete task error' })
        } else {
            res.status(200).json({ status: 0, message: 'delete task success' })
        }
    })
})
module.exports = router