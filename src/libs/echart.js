
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