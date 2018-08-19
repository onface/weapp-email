<template>
    <div>
        <button class="weui-btn get-new-btn" type="primary" @click="getNew">收信</button>
        <div class="weui-panel weui-panel_access">
            <div class="weui-panel__bd">
                <div class="weui-media-box weui-media-box_text" v-for="(item, index) in data">
                    <div @click="handleShowEmail(item.attributes.uid)" >
                        <div class="weui-media-box__title weui-media-box__title_in-text">{{item.header.subject}}</div>
                        <div class="weui-media-box__desc">{{item.header.from}}</div>
                    </div>
                    <div class="emailcnt" v-if="showEmail === item.attributes.uid">
                        <wxParse :content="item.content.text.html" />
                        <div class="emailcnt-tool">
                            <button class="weui-btn" type="primary" @click="writeEmail(item.header.from[0])" >回复</button>
                            <button class="weui-btn" @click="showEmail = ''" type="default">关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import wxParse from 'mpvue-wxparse'
import request from "../../m/request/index"
import Go from "../../m/go/index"
export default {
  data () {
    return {
        data: [],
        showEmail: ''
    }
  },

  components: {
      wxParse
  },
  methods: {
      handleShowEmail: function (uid) {
          this.showEmail = uid
      },
      writeEmail: function (from) {
          this.showEmail = ''
          Go('/write', {
              data: {
                  to: from
              }
          })
      },
      getNew: function () {
          const self = this
          request({
              url: '/inbox',
              method: 'GET',
              success: function (res) {
                  if (res.data.type === 'fail') {
                      wx.showToast({
                          title: res.msg
                      })
                  }
                  else {
                      self.data = res.data.data.reverse()
                  }
              }
          })
      }
  },
  onLoad () {
     const self = this
     self.getNew()
  }
}
</script>

<style scoped>
.emailcnt {
    position: fixed;
    z-index: 10;
    top:0;left:0;width: 100%;height: 100%;
    background-color: white;
    overflow-y: auto;
    border:2rpx solid #eee;
    border-radius: .3em;
}
.emailcnt-tool {
    padding: 30rpx;
}
.get-new-btn {
    margin: 1em;
}
</style>
