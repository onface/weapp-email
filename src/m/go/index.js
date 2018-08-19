export default function (url, options) {
    options = options || {}
    let outputUrl = '/pages' + url + '/main'
	if (options.data) {
        wx.setStorageSync('go', options.data)
    }
    wx.switchTab({
        url: outputUrl
    })
}
