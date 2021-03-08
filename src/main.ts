import Vue from 'vue'
import axios from 'axios'
import Toasted from 'vue-toasted' // 底部提示弹窗
import {Table, TableColumn, Input, Select, Option, Form, FormItem, Dialog, Button, Loading} from 'element-ui' // 按需加载
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import {comparePrice, transVolume, transDate, transMarketN