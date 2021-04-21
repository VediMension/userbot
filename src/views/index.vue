
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
        @contextmenu="showContext(item)"
        :class="comparePrice(item.gains, 0)"
      >
        <div class="upper-info">
          <h3>{{ item.name }}</h3>
          <p>{{ item.price.toFixed(2) }}</p>
        </div>
        <p class="index-gain">
          <span
            >{{ item.price > 0 ? "+" : ""
            }}{{ item.price.toFixed(2) }}</span
          >
          <span
            >{{ item.gains > 0 ? "+" : ""
            }}{{ item.gains.toFixed(2) }}%</span
          >
        </p>
      </div>
    </div>
    <!--自选部分-->
    <div class="table-container">
      <el-table
        class="optional-stock-table"
        height="500"
        size="small"
        row-key="code"
        :data="optionals"
        @row-click="clickRow"
        :header-cell-style="{ padding: 0 }"
      >
        <el-table-column label="股票" width="100">
          <template slot-scope="props">