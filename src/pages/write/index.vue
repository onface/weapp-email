<template>
    <div>
        <div class="weui-cell weui-cell_input">
            <div class="weui-cell__hd">
                <div class="weui-label">收件人</div>
            </div>
            <div class="weui-cell__bd">
                <input class="weui-input" :disabled="disabled" v-model="to" />
            </div>
        </div>
        <div class="weui-cell weui-cell_input">
            <div class="weui-cell__hd">
                <div class="weui-label">邮件标题</div>
            </div>
            <div class="weui-cell__bd">
                <input class="weui-input" v-model="subject" />
            </div>
        </div>
        <div class="weui-cells weui-cells_after-title">
          <div class="weui-cell">
              <div class="weui-cell__bd">
                  <textarea class="weui-textarea" v-model="content" placeholder="请输入邮件内容" style="height: 3.3em" />
              </div>
          </div>
        </div>
        <button class="weui-btn" type="primary" @click="send" >发送</button>
    </div>
</template>

<script>
import Go from "../../m/go/index"
import request from "../../m/request/index"
export default {
  data () {
    return {
        subject:'', // 电子邮件标题
        to: '', // 收件人电子邮件地址
        content: '', // 电子邮件内容
        disabled: ''
    }
  },
  onLoad: function (option) {
    // 如果有收件人参数时，自动填充收件人电子邮件地址
      if (option.to) {
        this.to = option.to.replace(/(^.*<|>.*$)/g, '')
        this.disabled = 'disabled'
      }
  },
  components: {

  },
  methods: {
      send: function () {
          const self = this
          request({
              url: '/send',
              method: 'POST',
              data: {
                  subject: self.subject,
                  to: self.to,
                  content: self.content
              },
              success: function (res) {
                  if (res.data.type === 'fail') {
                      wx.showToast({
                          title: res.msg
                      })
                  }
                  else {
                      wx.showToast({
                          title: 'sent success！'
                      })
                  }
              }
          })
      }
  },
  created () {

  }
}
</script>

<style scoped>

</style>
