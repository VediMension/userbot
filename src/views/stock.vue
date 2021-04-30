
<template>
  <div class="stock-window" v-if="stock">
    <div class="window-content">
      <!--个股名称代码-->
      <div class="stock-top">
        <h2 class="stock-name">
          {{ stock.name }}
        </h2>
        <span class="stock-code">({{ this.code.toUpperCase() }})</span>
      </div>
      <!--股价部分-->
      <div class="price-row">
        <div class="left-part" :class="comparePrice(stock.gain.price, 0)">
          <span class="current-price"> ¥{{ stock.current.toFixed(2) }} </span>
          <span class="gain-price">
            {{ stock.gain.price > 0 ? "+" : ""
            }}{{ stock.gain.price.toFixed(2) }}
          </span>
          <span class="gain-percent">
            {{ stock.gain.percent > 0 ? "+" : ""
            }}{{ stock.gain.percent.toFixed(2) }}%
          </span>
        </div>
        <div class="right-part">
          <span class="current-time">
            {{ transDate(stock.time) }} (数据获取时间)</span
          >
        </div>
      </div>
      <!--个股信息-->
      <el-form label-position="left" inline class="stock-info-form">
        <el-form-item
          label="最高:"
          :class="comparePrice(stock.highest, stock.yesterday)"
        >
          <span>{{ stock.highest.toFixed(2) }}</span>
        </el-form-item>
        <el-form-item
          label="今开:"
          :class="comparePrice(stock.today, stock.yesterday)"
        >
          <span>{{ stock.today.toFixed(2) }}</span>
        </el-form-item>
        <el-form-item
          label="涨停:"
          :class="comparePrice(stock.limit.up, stock.yesterday)"
        >
          <span>{{ stock.limit.up.toFixed(2) }}</span>
        </el-form-item>
        <el-form-item label="成交量:">
          <span>{{ transVolume(stock.volume.total) }}手</span>
        </el-form-item>
        <el-form-item
          label="最低:"
          :class="comparePrice(stock.lowest, stock.yesterday)"
        >
          <span>{{ stock.lowest.toFixed(2) }}</span>
        </el-form-item>
        <el-form-item label="昨收:">
          <span>{{ stock.yesterday.toFixed(2) }}</span>
        </el-form-item>
        <el-form-item
          label="跌停:"
          :class="comparePrice(stock.limit.down, stock.yesterday)"
        >
          <span>{{ stock.limit.down.toFixed(2) }}</span>
        </el-form-item>
        <el-form-item label="成交额:">
          <span>{{ stock.volume.turn }}万</span>
        </el-form-item>
        <el-form-item label="换手:">
          <span>{{ stock.turnover.toFixed(2) }}%</span>
        </el-form-item>
        <el-form-item label="总市值:">
          <span>{{ stock.cap }}亿</span>
        </el-form-item>
        <el-form-item label="市净率:">
          <span>{{ stock.ratio }}</span>
        </el-form-item>
        <el-form-item label="振幅:">
          <span>{{ stock.swing.toFixed(2) }}%</span>
        </el-form-item>
        <el-form-item label="流通值:">
          <span>{{ stock.float }}亿</span>
        </el-form-item>
      </el-form>
      <!--K线图/买卖/成交-->
      <div class="k-line">
        <div class="order-list">
          <p class="inner-title">五档盘口</p>
          <!--卖手-->
          <ul class="sell-order">
            <li v-for="(item, index) in reverseSell" v-bind:key="index">
              <span class="order-index"
                >卖{{ reverseSell.length - index }}</span
              >
              <span
                class="order-price"
                :class="comparePrice(item.price, stock.yesterday)"
                >{{ item.price.toFixed(2) }}</span
              >
              <span class="order-count">{{ transVolume(item.count) }}</span>
            </li>
          </ul>
          <!--买手-->
          <ul class="buy-order">
            <li v-for="(item, index) in stock.buy" v-bind:key="index">
              <span class="order-index">买{{ index + 1 }}</span>
              <span
                class="order-price"
                :class="comparePrice(item.price, stock.yesterday)"
                >{{ item.price.toFixed(2) }}</span
              >
              <span class="order-count">{{ transVolume(item.count) }}</span>
            </li>
          </ul>
          <p class="inner-title">成交明细</p>
          <!--实时成交-->
          <ul
            class="deal-detail"
            v-if="this.stockIndex.indexOf(this.code) === -1"
          >
            <li v-for="(item, index) in reverseDeal" v-bind:key="index">
              <span class="deal-time">{{ item.time }}</span>
              <span
                class="deal-price"
                :class="comparePrice(item.price, stock.yesterday)"
                >{{ item.price.toFixed(2) }}</span
              >
              <span
                class="deal-count"
                :class="{
                  'deal-buy': item.type === 'B',
                  'deal-sell': item.type === 'S',
                }"
                >{{ transVolume(item.count) }}</span
              >
            </li>
          </ul>
        </div>
        <!--K线图-->
        <div class="line-picture">
          <img :src="kline" draggable="false" />
        </div>
      </div>
    </div>
  </div>