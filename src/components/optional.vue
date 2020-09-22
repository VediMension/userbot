
<template>
  <el-dialog
    :visible.sync="isVisible"
    :show-close="false"
    center
    class="optional-dialog"
  >
    <el-select
      v-model="code"
      filterable
      remote
      reserve-keyword
      placeholder="股票代码 / 名称 / 缩写"
      :remote-method="fetchHint"
      :default-first-option="true"
      @change="handleAction"
      ref="codeSelect"
      class="code-select"
      loading-text="加载中..."
    >
      <el-option
        v-for="(item, index) in hints"
        :key="index"
        :label="item.name"
        :value="item.internal_code"
        :popper-append-to-body="false"
      >
        <div class="hint-option-item">
          <span class="hint-market">{{ item.type }}</span>
          <span class="hint-name">{{ item.name }}</span>
          <span class="hint-code">{{ item.code }}</span>
          <span class="hint-letter">{{ item.letter }}</span>
        </div>
      </el-option>
    </el-select>
  </el-dialog>
</template>

<script>
import { stockIndex } from "../libs/constant";
import apis from "../libs/apis";

export default {
  data() {
    return {
      isVisible: false, // 是否显示弹窗
      code: null, // 输入的代码
      hints: [], // 下拉提示
    };
  },
  methods: {
    /**
     * 显示当前添加自选股的弹窗
     * @param key {string|*} - 按键映射的键值
     */
    show(key = null) {
      this.isVisible = !this.isVisible;
      if (!this.isVisible) {
        this.$refs["codeSelect"].blur();
      } else {
        setTimeout(() => {