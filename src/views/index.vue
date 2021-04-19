
<template>
  <div id="box">
    <!--顶栏部分-->
    <div class="header">
      <h1>自选小工具</h1>
      <div class="action-buttons">
        <a class="button-pin" @click="addOptional">
          <i class="el-icon-edit"></i>
        </a>
        <a class="button-min">
          <i class="el-icon-s-home"></i>
        </a>
      </div>
    </div>
    <!--指数部分-->
    <div class="stock-index">
      <div
        v-for="(item, index) in indexs"
        :key="index"