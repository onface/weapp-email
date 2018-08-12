<template>
    <div>
        <div class="weui-cells__title">登录</div>
        <div class="weui-cells weui-cells_after-title">
            <div class="weui-cell weui-cell_input">
                <div class="weui-cell__bd">
                    <input class="weui-input" v-model="form.email" placeholder="email" />
                </div>
            </div>
            <div class="weui-cell weui-cell_input">
                <div class="weui-cell__bd">
                    <input class="weui-input" v-model="form.password" type="password" placeholder="password" />
                </div>
            </div>
        </div>
        <div class="weui-btn-area">
            <button class="weui-btn" type="primary" @click="handleLogin">Login</button>
        </div>
    </div>
</template>

<script>
// import card from '@/components/card'
import request from "../../m/request/index"
export default {
  data () {
    return {
        form: {
            email: 'weapp_email@163.com',
            password: 'code1234'
        }
    }
  },

  components: {

  },
  methods: {
      handleLogin: function () {
          const self = this
          wx.showLoading()
          request({
              url: '/login',
              method: 'POST',
              data: self.form,
              success: function (res) {
                  if(res.data.type === 'fail') {
                      wx.showToast({
                          icon: 'none',
                          title: res.data.msg
                      })
                  }
                  else {
                      wx.showToast({
                          title: 'Is logged in'
                      })
                      wx.setStorageSync('user', JSON.stringify(self.form))
                  }
              },
              fail: function () {
                  wx.showToast({
                      icon: 'none',
                      title: 'network errors'
                  })
              },
              complete: function () {
                  wx.hideLoading()
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
