
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
            <div class="stock-info">
              <div :title="props.row.name">
                <h3>{{ props.row.name }}</h3>
                <span v-if="props.row.status">
                  {{ props.row.status === "S" ? "停" : "退" }}
                </span>
              </div>
              <p>{{ props.row.code.toUpperCase() }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="最新价"
          align="right"
          width="75"
          sortable
        >
          <template slot-scope="props">
            <p class="stock-price">{{ props.row.price.toFixed(2) }}</p>
          </template>
        </el-table-column>
        <el-table-column label="成交量" align="right" width="90">
          <template slot-scope="props">
            <p class="stock-volume">
              {{ transVolume(props.row.turnover_amount)
              }}{{ props.row.code.indexOf("hk") > -1 ? "股" : "手" }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="gain.percent"
          label="涨跌幅"
          align="right"
          sortable
        >
          <template slot-scope="props">
            <template v-if="!props.row.status">
              <span
                class="gain-price"
                :class="comparePrice(props.row.gains, 0)"
              >
                {{ props.row.price > 0 ? "+" : ""
                }}{{ props.row.price.toFixed(2) }}
              </span>
              <span
                class="gain-percent"
                :class="comparePrice(props.row.gains, 0)"
              >
                {{ props.row.gains > 0 ? "+" : ""
                }}{{ props.row.gains.toFixed(2) }}%
              </span>
            </template>
            <template v-else>
              <span class="gain-price">-</span>
              <span class="gain-percent">0.00%</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--加自选弹窗-->
    <optional-dialog ref="optionalDialog" @finish="fetchData" />
  </div>
</template>

<script>
import { timeSpan, stockIndex } from "../libs/constant"; // api,请求间隔,三大指数
import Sortable from "sortablejs"; // 表格拖拽库
import OptionalDialog from "../components/optional"; // 添加功能组件
import apis from "../libs/apis";
export default {
  components: {
    OptionalDialog,
  },
  data() {
    return {
      indexs: [], // 指数部分
      optionals: [], // 自选部分
    };
  },
  created() {
    this.fetchData();
  },
  mounted() {
    setInterval(this.fetchData, timeSpan); // 轮训获取数据
    this.rowDrop(); // 拖拽功能
  },
  methods: {
    fetchData() {
      const storage = localStorage.getItem("optionals");
      let storageOptional = [];
      if (storage !== "" && storage !== null) {
        storageOptional = storage.split(",");
      }