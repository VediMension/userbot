
var bgColor = "#fff"; //背景
var upColor = "#ff0000"; //涨颜色
var downColor = "#008b00"; //跌颜色
var labelColor = "#666"; //文字颜色
var borderColor = "#bebebe"; // 图标边框色，会影响坐标轴上悬浮框的背景色
// ma  颜色
var ma5Color = "#39afe6";
var ma10Color = "#da6ee8";

/**
 * 15:20 时:分 格式时间增加num分钟
 * @param {Object} time 起始时间
 * @param {Object} num
 */

function addTimeStr(time, num) {
    var hour = time.split(':')[0];
    var mins = Number(time.split(':')[1]);
    var mins_un = parseInt((mins + num) / 60);
    var hour_un = parseInt((Number(hour) + mins_un) / 24);
    if (mins_un > 0) {
        if (hour_un > 0) {
            var tmpVal = ((Number(hour) + mins_un) % 24) + "";
            hour = tmpVal.length > 1 ? tmpVal : '0' + tmpVal; //判断是否是一位
        } else {
            var tmpVal = Number(hour) + mins_un + "";
            hour = tmpVal.length > 1 ? tmpVal : '0' + tmpVal;
        }
        var tmpMinsVal = ((mins + num) % 60) + "";
        mins = tmpMinsVal.length > 1 ? tmpMinsVal : 0 + tmpMinsVal; //分钟数为 取余60的数
    } else {
        var tmpMinsVal = mins + num + "";
        mins = tmpMinsVal.length > 1 ? tmpMinsVal : '0' + tmpMinsVal; //不大于整除60
    }
    return hour + ":" + mins;
}

//获取增加指定分钟数的 数组  如 09:30增加2分钟  结果为 ['09:31','09:32'] 
function getNextTime(startTime, endTIme, offset, resultArr) {
    var result = addTimeStr(startTime, offset);
    resultArr.push(result);
    if (result == endTIme) {
        return resultArr;
    } else {
        return getNextTime(result, endTIme, offset, resultArr);
    }
}


/**
 * 不同类型的股票的交易时间会不同  
 * @param {Object} type   hs=沪深  us=美股  hk=港股
 */
var time_arr = function(type) {
    if (type.indexOf('us') != -1) { //生成美股时间段
        var timeArr = new Array();
        timeArr.push('09:30')
        return getNextTime('09:30', '16:00', 1, timeArr);
    }
    if (type.indexOf('hs') != -1) { //生成沪深时间段
        var timeArr = new Array();
        timeArr.push('09:30');
        timeArr.concat(getNextTime('09:30', '11:30', 1, timeArr));
        timeArr.push('13:00');
        timeArr.concat(getNextTime('13:00', '15:00', 1, timeArr));
        return timeArr;
    }
    if (type.indexOf('hk') != -1) { //生成港股时间段
        var timeArr = new Array();
        timeArr.push('09:30');
        timeArr.concat(getNextTime('09:30', '11:59', 1, timeArr));
        timeArr.push('13:00');
        timeArr.concat(getNextTime('13:00', '16:00', 1, timeArr));
        return timeArr;
    }

}


var get_m_data = function(m_data, type) {
    var priceArr = new Array();
    var vol = new Array();
    var times = time_arr(type);
    $.each(m_data.data, function(i, v) {
        priceArr.push(v[1]);
        vol.push(v[2]); //目前数据没有均价，取值提前一位
    })
    return {
        priceArr: priceArr,
        vol: vol,
        times: times
    }
}


//分时图 option

/**
 * 生成分时option 
 * @param {Object} m_data 分时数据
 * @param {Object} type 股票类型  us-美股  hs-沪深  hk-港股
 */

function initMOption(m_data, type) {
    var m_datas = get_m_data(m_data, type);

    var baseNumber = Number(m_data.yestclose).toFixed(2)
    var _minVal = Number(baseNumber - baseNumber * handle_num()).toFixed(2);
    var _maxVal = (Number(baseNumber) + baseNumber * handle_num()).toFixed(2);
    var _interval = Math.abs(Number((baseNumber - _minVal) / 5));

    function handle_num() {
        var _aa = Math.abs((Math.max.apply(null, m_datas.priceArr) - baseNumber) / baseNumber).toFixed(2);
        var _bb = Math.abs((baseNumber - Math.min.apply(null, m_datas.priceArr)) / baseNumber).toFixed(2);
        return _aa > _bb ? _aa : _bb;
    }

    function format_y(v) {
        v = v.toFixed(2)
        if (v > m_data.yestclose) {
            return '{red|' + v + '}';
        } else if (v == baseNumber) {
            return v;
        } else {
            return '{green|' + v + '}';
        }
    }

    function more_val(val, l) {
        out = []
        for (i = 0; i < l; i++) {
            out.push(val)
        }
        return out
    }
    return {
        tooltip: { //弹框指示器
            trigger: 'axis',
            backgroundColor: "#f1f1f1",
            borderColor: "#ccc",
            borderWidth: 1,
            textStyle: {
                color: '#333'
            },
            axisPointer: {
                type: 'cross',
                label: {
                    show: true,
                    backgroundColor: '#333'
                }
            },
            formatter: function(params, ticket, callback) {
                var i = params[0].dataIndex;
                var color;
                if (m_datas.priceArr[i] > m_data.yestclose) {
                    color = 'style="color:' + upColor + '"';
                } else {
                    color = 'style="color:' + downColor + '"';
                }
                var html = '<div class="commColor" style="width:100px;">\
                  <div>当前价 <span  ' + color + ' >' + m_datas.priceArr[i] + '</span></div>\
			            <div>涨幅 <span  ' + color + ' >' + ratioCalculate(m_datas.priceArr[i], m_data.yestclose) + '%</span></div>\
				          <div>成交量 <span  ' + color + ' >' + m_datas.vol[i] + '</span></div></div>';
                return html;
            }
        },
        legend: { //图例控件,点击图例控制哪些系列不显示
            icon: 'rect',
            type: 'scroll',
            itemWidth: 14,
            itemHeight: 2,
            selectedMode: false,
            left: 0,
            top: '1%',
            textStyle: {
                fontSize: 12,
                color: labelColor
            }
        },
        color: [ma5Color, ma10Color],
        grid: [{
            show: true,
            borderColor: borderColor,
            id: 'gd1',
            height: '63%', //主K线的高度,
            top: '9%'
        }, {
            show: true,
            borderColor: borderColor,
            id: 'gd2',
            height: '63%', //主K线的高度,
            top: '9%'
        }, {
            show: true,
            borderColor: borderColor,
            id: 'gd3',
            top: '76%',
            height: '19%' //交易量图的高度
        }],
        xAxis: [ //==== x轴
            { //主图 
                gridIndex: 0,
                boundaryGap: false,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: borderColor,
                    }
                },
                data: m_datas.times,
                axisLabel: { //label文字设置
                    show: false
                },
                splitLine: { //分割线设置
                    show: true,
                    lineStyle: {
                        type: 'dashed'
                    }
                },
            },
            {
                show: false,
                gridIndex: 1,
                boundaryGap: false,
                data: m_datas.times,
                axisLabel: { //label文字设置
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: borderColor,
                    }
                },
            }, { //交易量图
                splitNumber: 2,
                type: 'category',
                gridIndex: 2,
                boundaryGap: false,
                data: m_datas.times,
                axisLabel: { //label文字设置
                    color: labelColor,
                    fontSize: 10
                },
                axisTick: {
                    show: false
                },
                splitLine: { //分割线设置
                    show: true,
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: borderColor,
                    }
                }
            }
        ],
        yAxis: [ //y轴
            {
                type: 'value',
                min: _minVal,
                max: _maxVal,
                interval: _interval,
                gridIndex: 0,
                scale: true,
                axisTick: { // 分割线 短
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: borderColor,
                    }
                },
                axisPointer: {
                    show: true,
                    label: {
                        formatter: function(params) {
                            return (params.value).toFixed(2);
                        }
                    }
                },
                axisLabel: {
                    color: '#333',
                    formatter: format_y,
                    rich: {
                        red: {
                            color: 'red',
                            lineHeight: 10
                        },
                        green: {
                            color: 'green',
                            lineHeight: 10
                        }
                    }
                },
                z: 4,
                splitLine: { //分割线设置
                    show: true,
                    lineStyle: {
                        type: 'dashed'
                    }
                },
            }, {
                scale: true,
                gridIndex: 1,
                min: _minVal,
                max: _maxVal,
                interval: _interval,
                position: 'right',
                z: 4,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: borderColor,
                    }
                },
                axisLabel: { //label文字设置
                    color: function(val) {
                        val = Number(val).toFixed(2)
                        if (val == baseNumber) {
                            return '#333'
                        }
                        return val > baseNumber ? upColor : downColor;
                    },
                    inside: false, //label文字朝内对齐 
                    formatter: function(val) {
                        var resul = ratioCalculate(val, baseNumber);
                        return Number(resul).toFixed(2) + '%'
                    }
                },
                splitLine: { //分割线设置
                    show: false,
                    lineStyle: {
                        color: '#181a23'
                    }
                },
                axisPointer: {
                    show: true,
                    label: {
                        formatter: function(params) { //计算右边Y轴对应的当前价的涨幅比例
                            return ratioCalculate(params.value, baseNumber) + '%';
                        }
                    }
                }
            }, { //交易图
                // name: '万',
                nameGap: '0',
                nameTextStyle: {
                    color: labelColor
                },
                gridIndex: 2,
                z: 4,
                splitNumber: 3,
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: borderColor,
                    }
                },
                axisTick: {
                    show: false
                },
                axisPointer: {
                    show: false,
                    label: {
                        formatter: function(params) { //计算右边Y轴对应的当前价的涨幅比例