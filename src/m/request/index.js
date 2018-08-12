import Go from "../go/index"
export default function (settings) {
    wx.showLoading()
    var user = {}
    if (wx.getStorageSync('user')) {
        user =  JSON.parse(wx.getStorageSync('user'))
    }
    settings.data = settings.data || {}
    if (settings.url !== '/login') {
        settings.data.email = user.email
        settings.data.password = user.password
    }
    settings.url = 'http://127.0.0.1:1219' + settings.url
    let cloneSuccess = settings.success
    settings.success = function (res) {
        if (res.data.type === 'need_login') {
            Go('/index')
            return
        }
        cloneSuccess.apply(this, arguments)
    }
    settings.complete = settings.complete || function () {
        wx.hideLoading()
    }
    settings.fail = settings.fail || function () {
        wx.showToast({
            icon: 'none',
            title: 'network errors'
        })
    }
    wx.request(settings)
}
