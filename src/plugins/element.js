import Vue from 'vue'
import {
  Button,
  Upload,
  Input,
  Dialog,
  Form,
  FormItem,
  Message,
  MessageBox,
  Row,
  Col,
  Loading,
  Icon,
  Card,
  Table,
  TableColumn,
  TabPane,
  Tabs,
  Tag,
} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)
Vue.use(Button)
Vue.use(Upload)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Icon)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Tag)

Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$loading = Loading.service