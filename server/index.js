var bodyParser = require('body-parser')
var express = require('express')
var app = express()
const nodemailer = require('nodemailer')
var ImapManger = require('imap-manager')
var emailjs = require('emailjs/email')
app.listen(1219)
app.use(bodyParser.json())
app.use(function (req, res, next) {
    function notLoginPage () {
        if (req.path !== '/login') {
            res.send({
                type: 'need_login'
            })
            return
        }
    }
    req.body.email = req.body.email || req.query.email
    req.body.password = req.body.password || req.query.password
    if (!req.body.email) {
        notLoginPage()
        res.send({type: 'fail', msg: '请输入邮箱'})
        return
    }
    if (!req.body.password) {
        notLoginPage()
        res.send({type: 'fail', msg: '请输入密码'})
        return
    }
    let domain = req.body.email.replace(/^.*@/, '')
    req.body.$domain = domain
    next()
})
function createImap  (req, callback) {
    let options = {
      host: 'imap.' + req.body.$domain, // 配置IMAP路由
      port: 993, // 设定服务器路由端口
      tls: true, // 传输层安全协议
      authTimeout: 10000, // 设定超时时间范围
      connTimeout: 20000 // 设定超时时间范围
    }
    var mailserver = ImapManger(options);
    callback(mailserver)
}
app.post('/login', function (req, res) {
    let output = {}
    createImap(req, function (imap) {
        imap.getFolders(req.body.email, req.body.password, function(err, result) {
            if (err) {
                if (err === 'An unspecified error has occurred') {
                    err = 'Email or passwrod invalid.'
                }
                res.send({
                    type: 'fail',
                    msg: err
                })
                return
            }
            else {
                res.send({
                    type: 'pass'
                })
                return
            }

        })
    })
})
app.get('/inbox', function (req, res) {
    createImap(req, function (imap) {
        imap.getEmails(req.body.email, req.body.password, 'Inbox', function(err, result) {
            if (err) {
                res.send({
                    type: 'fail',
                    msg: err
                })
                return
            }
            else {
                res.send({
                    type: 'pass',
                    data: result
                })
                return
            }

        })
    })
})
app.post('/send', function (req, res) {
    var server = emailjs.server.connect({
        user: req.body.email,
        password: req.body.password,
        host: 'smtp.' + req.body.$domain,
        ssl: true
    })
    server.send({
        from: req.body.email,
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.content
    }, function (err, info) {
        if (err) {
            res.send({
                type: 'fail',
                msg: err.message
            })
        }
        else {
            console.log(info)
            res.send({
                type: 'pass'
            })
        }
    })
})
