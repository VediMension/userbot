
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