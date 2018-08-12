export default function (url) {
    wx.navigateTo({
        url: '/pages' + url + '/main'
    })
}
