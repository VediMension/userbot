
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