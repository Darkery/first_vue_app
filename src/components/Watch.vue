<template>
<div id="watch-example">
  <button v-on:click.prevent="getCount">Add one</button>
  <p>count = {{ count }}</p>
  <textarea v-model="message" placeholder="Edit"></textarea>
  <p style="white-space: pre-line;">Your msg is {{ message }}</p>
  <p>
    Ask a yes/no question:
    <input v-model="question" @keyup.alt.enter="submit">
    <input v-model.trim="question" @click.middle="submit">
  </p>
  <p>{{ answer }}</p>
</div>
</template>

<!-- 因为 AJAX 库和通用工具的生态已经相当丰富，Vue 核心代码没有重复 -->
<!-- 提供这些功能以保持精简。这也可以让你自由选择自己更熟悉的工具。 -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/0.10.0/lodash.min.js"></script>


<script>
import axios from 'axios'
import _ from 'lodash'
export default {
  name: '#watch-example',
  data() {
    return {
      message: "",
      count: 0,
      question: '',
      answer: 'I cannot give you an answer until you ask a question!'
    };
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    question: function (newQuestion, oldQuestion) {
      console.log('xxxxxxxxxxxxxxxxx')
      this.answer = 'Question is ' + this.question

      this.debouncedGetAnswer()
    }
  },
  created() {
    // `_.debounce` 是一个通过 Lodash 限制操作频率的函数。
    // 在这个例子中，我们希望限制访问 yesno.wtf/api 的频率
    // AJAX 请求直到用户输入完毕才会发出。想要了解更多关于
    // `_.debounce` 函数 (及其近亲 `_.throttle`) 的知识，
    // 请参考：https://lodash.com/docs#debounce
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)
  },
  methods: {
    getAnswer() {
      if (this.question.indexOf('?') === -1) {
        this.answer = 'Questions usually contain a question mark. ;-)'
        return
      }
      this.answer = 'Thinking...'
      var vm = this
      console.log('aaaaaaaaaaaaa')
      axios.get('https://yesno.wtf/api')
        .then(res => {
          vm.answer = _.capitalize(res.data.answer)
        })
        .catch(error => {
          vm.answer = 'Error! Could not reach the API. ' + error
        })
    },

    // getCount: c => { c++ }
    getCount: function() {
      this.count++;
    },
    submit: function() {
      alert("Submitted!")
    }
  }
}
</script>
