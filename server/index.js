var bodyParser = require('body-parser')
var express = require('express')
var app = express()
const nodemailer = require('nodemailer')
var Imap = require('imap')

app.listen(1219)
app.use(bodyParser.json())
app.use(function (req, res, next) {
    if (!req.body.email) {
        res.send({type: 'fail', msg: '请输入邮箱'})
        return
    }
    if (!req.body.password) {
        res.send({type: 'fail', msg: '请输入密码'})
        return
    }
    let domain = req.body.email.replace(/^.*@/, '')
    req.body.$domain = domain
    next()
})
app.post('/login', function (req, res) {
    let output = {}
    let options = {
      user: req.body.email,
      password: req.body.password,
      host: 'imap.' + req.body.$domain,
      port: 993,
      tls: true
    }
    var imap = new Imap(options)
    imap.once('ready', function () {
        res.send({
            type: 'pass'
        })
        return
    })
    imap.once('error', function (err) {
        res.send({
            type: 'fail',
            msg: err.message
        })
        return
    })
    imap.connect()
    // imap.openBox('INBOX', true, function () {
    //     console.log(arguments)
    // })
    // res.send(output)
})
app.post('/send', function (req, res) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.' + req.body.$domain,
        port: 587,
        secure: false,
        auth: {
            user: req.body.email,
            pass: req.body.password
        },
        debug: true
    })
})
