export default function (url, options) {
    options = options || {}
    let outputUrl = '/pages' + url + '/main'
	if(options.data){
		let searchDataArr = []
		Object.keys(options.data).map(function(key){
			searchDataArr.push( key + '=' + options.data[key] )
		})
		let searchData = searchDataArr.join('&')
		outputUrl = searchData ? outputUrl + '?' + searchData : outputUrl
	}
    wx.navigateTo({
        url: outputUrl
    })
}
