const express = require('express')
const app = express()
const cors = require('cors')
const user = require('./user.js')
const task = require('./task.js')
app.use(cors())


app.use('/user', user)
app.use('/task', task)
app.use(express.static('public'))
app.listen(80, () => {
    console.log('server running at http://127.0.0.1:80');
})