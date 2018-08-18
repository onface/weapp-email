var bodyParser = require('body-parser')
var express = require('express')
var app = express()
const nodemailer = require('nodemailer')
var ImapManger = require('imap-manager')
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
function createIamp  (req, callback) {
    let options = {
      host: 'imap.' + req.body.$domain,
      port: 993,
      tls: true,
      authTimeout: 10000,
      connTimeout: 20000
    }
    var mailserver = ImapManger(options);
    callback(mailserver)
}
app.post('/login', function (req, res) {
    let output = {}
    createIamp(req, function (iamp) {
        iamp.getFolders(req.body.email, req.body.password, function(err, result) {
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
    createIamp(req, function (err, imap) {
        if (err) {
            res.send({
                type: 'fail',
                msg: err.message
            })
            return
        }
        else {
            iamp.getEmails(req.body.email, req.body.password, function(err, result) {
                if (err) {
                    res.send({
                        type: 'fail',
                        msg: err.message
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
            return
        }
    })
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
