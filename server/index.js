var bodyParser = require('body-parser')
var express = require('express')
var app = express()
const nodemailer = require('nodemailer')
var Imap = require('imap')
var MailParser = require("mailparser").MailParser
var mailparser = new MailParser()

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
      user: req.body.email,
      password: req.body.password,
      host: 'imap.' + req.body.$domain,
      port: 993,
      tls: true
    }
    var imap = new Imap(options)
    imap.once('ready', function () {
        callback(false, imap)
        return
    })
    imap.once('error', function (err) {
        callback(err, imap)
        return
    })
    imap.connect()
}
app.post('/login', function (req, res) {
    let output = {}
    createIamp(req, function (err, imap) {
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
        imap.end()
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
            imap.openBox('INBOX', true, function (err, box) {
                if (err) {
                    res.send({
                        type: 'fail',
                        msg: err.message
                    })
                    return
                }
                // var fetchData = imap.seq.fetch('*', { bodies: '' });
                // fetchData.on('message', function (msg, seqno) {
                //     msg.on('body', function (stream, info) {
                //         stream.pipe(mailparser)//将为解析的数据流pipe到mailparser
                //            mailparser.on("headers", function(headers) {
                //               console.log(
                //                   headers.get('subject'),
                //                   headers.get('from').text,
                //                   headers.get('to').text
                //               )
                //           })
                //
                //     })
                // })
                // fetchData.on('message', function (msg, seqno) {
                //     msg.on('body', function (stream, info) {
                //         stream.pipe(mailparser)//将为解析的数据流pipe到mailparser
                //         mailparser.on("headers", function(headers) {
                //            console.log(
                //                headers.get('subject'),
                //                headers.get('from').text,
                //                headers.get('to').text
                //            )
                //          })
                //          // mailparser.on("data", function(data) {
                //          //    if (data.type === 'text') {//邮件正文
                //          //      console.log("邮件内容信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                //          //      console.log("邮件内容: " + data.html);
                //          //    }
                //          //    if (data.type === 'attachment') {//附件
                //          //      console.log("邮件附件信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                //          //      console.log("附件名称:"+data.filename);//打印附件的名称
                //          //      data.content.pipe(fs.createWriteStream(data.filename));//保存附件到当前目录下
                //          //      data.release();
                //          //    }
                //          //  });
                //     })
                //     res.send({
                //         type: 'pass',
                //         data: arguments
                //     })
                // })
                // fetchData.once('error', function (err) {
                //     res.send({
                //         type: 'fail',
                //         msg: err.message
                //     })
                //     return
                // })
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
