export default function (settings) {
    settings.url = 'http://127.0.0.1:1219' + settings.url
    wx.request(settings)
}
