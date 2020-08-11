<template>
<div id="test">
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <label for="mike">Mike</label>
  <p>Checked names: {{ checkedNames }}</p>
  <input type="radio" id="one" value="One" v-model="radio">
  <label for="one">One</label>
  <input type="radio" id="two" value="Two" v-model="radio">
  <label for="two">Two</label>
  <p>You're choosing: {{ radio }}</p>
  <select v-model="selected" multiple style="width: 200px;">
    <option disabled value="">Please choose your answer</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <p>You're choosing: {{ selected }}</p>
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
  name: '#test',
  data() {
    return {
      selected: [],
      checkedNames: [],
      radio: ''
    };
  },
  watch: {
  },
  created() {
  },
  methods: {
    getAnswer() {
    },
  }
}
</script>
