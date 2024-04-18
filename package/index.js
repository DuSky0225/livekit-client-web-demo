import "element-ui/lib/theme-chalk/index.css";
import "vant/es/dialog/style";
import "ant-design-vue/dist/antd.css";
import "./assets/index.css"
import $ from "jquery";
import './core/use'
window.jQuery = $;
window.$ = $;
import {
  Grid,
  GridItem,
  Icon,
  Tabbar,
  TabbarItem,
  List,
  Cell,
  PullRefresh,
  Toast,
  Lazyload,
  Notify,
  DatetimePicker,
  Popup,
  Uploader,
  ActionSheet,
} from "vant";

import { message } from 'ant-design-vue';

import {
  Form,
  FormItem,
  Radio,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Col,
  Switch,
  Input,
  Dialog,
  Checkbox,
  CheckboxGroup,
  Upload,
  Collapse,
  Drawer,
  Progress,
  Dropdown,
  Image,
  DropdownMenu,
  DropdownItem,
  Loading,
  Select,
  Option,
  OptionGroup,
  Popover,
  Tooltip
} from "element-ui";

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Switch);
Vue.use(Dialog);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Col);
Vue.use(Input);
Vue.use(Upload);
Vue.use(Tooltip);

Vue.use(Tabbar)
  .use(Form)
  .use(Icon)
  .use(FormItem)
  .use(Option)
  .use(OptionGroup)
  .use(Popover)
  .use(Select)
  .use(Radio)
  .use(Grid)
  .use(GridItem)
  .use(Drawer)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Collapse)
  .use(Progress)
  .use(TabbarItem)
  .use(List)
  .use(Cell)
  .use(PullRefresh)
  .use(Toast)
  .use(Image)
  .use(Lazyload)
  .use(Dialog)
  .use(Notify)
  .use(Popup)
  .use(Uploader)
  .use(ActionSheet)
  .use(Checkbox)
  .use(CheckboxGroup);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Switch);
Vue.use(DatetimePicker); // 时间选择
Vue.prototype.$Dialog = Dialog;
Vue.prototype.$message = message;
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
import Vue from 'vue'
import JmeetingWeb from './JmeetingWeb.vue'
import SelectContact from './components/SelectContact.vue'
const components = [
    JmeetingWeb,
    SelectContact
];
const BusJMeeting = new Vue()
Vue.prototype.$busMeeting = BusJMeeting;
const install = function (Vue) {
    components.forEach(component => {
        Vue.component(component.name, component);
    });
};
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default install
