// ----------
// author: https://github.com/au3nh3
// version:
//
// usage:
// ----------
// 在html相应id标签内写入内容:
//		#date : 当前日期 - 2020年01月23日 星期四
//		#time : 当前时间 - 12:34:56
//		#ntptime: ntp网络时间
// 按钮:
//		停止时钟 :
//		刷新时钟 :
// 函数:
//		write_clock(Date, element)
//		stop_clock()
//		renew_clock()
// ----------

// write into HTML if id is set
const e_date = document.querySelector("#date")
const e_time = document.querySelector("#time")
const e_ntptime = document.querySelector("#ntptime")
const e_timezone = document.querySelector("#zone")
const e_latency = document.querySelector("#latency")
const e_time_diff = document.querySelector("#time-diff")

/*
class time extends Date {
	tid = null
	set bind_element(e) {
		this.element = e
	}
	write() {
		clearInterval(this.tid)
		let delay = 1000 - this.getMilliseconds()
		let ts = this.getTime()
		setTimeout( ()=> {
			ts += delay
			this.tid = setInterval( ()=> {
				ts += 1000
				this.setTime(ts)
				this.element.innerHTML = this.toTimeString().slice(0, 8)
			}, 1000)
		}, delay)
		this.element.innerHTML = this.toTimeString().slice(0, 8)
	}
	stop_clock() {
		clearInterval(this.tid)
		this.tid = null
	}
	refresh(ts = Date.now()) {
		clearInterval(this.tid)
		this.setTime(ts)
		write()
	}
}
*/
var local_time = new Date()
if (e_date) {
	let year = local_time.getFullYear()
	let month = local_time.getMonth() + 1
	let date = local_time.getDate()
	let nday = local_time.getDay()
	var arr_day = ['日', '一', '二', '三', '四', '五', '六']
	e_date.innerHTML = `${year} 年 ${month} 月 ${date} 日 &emsp;星期 ${arr_day[nday]}`;
}
if (e_timezone) {
	//var str_timezone = local_time.toTimeString().replace(/.*:[0-9][0-9] /, '')
	e_timezone.innerHTML = local_time.toTimeString().slice(9)
}
if (e_time) {
	// local_time.element = e_time
	write_clock(local_time, e_time)
}

function write_clock(date, element) {
	clearInterval(date.tid);
	if (!element) {
		element = date.element;
	}
	else{
		date.element = element;
	}
	let delay = 1000 - date.getMilliseconds()
	let ts = date.getTime()
	setTimeout( ()=> {
		ts += delay
		date.tid = setInterval( ()=> {
			ts += 1000
			date.setTime(ts)
			element.innerHTML = date.toTimeString().slice(0, 8)
		}, 1000)
	}, delay)
	element.innerHTML = date.toTimeString().slice(0, 8)
	// return tid
}
function stop_clock(date = local_time) {
	clearInterval(date.tid)
	date.tid = null
}
function renew_clock(date = local_time, ts = Date.now()) {
	clearInterval(date.tid)
	date.setTime(ts)
	write_clock(date)
}

function write_ntptime(ts) {
	let t1 = Date.now()
	let latency = t1 - t0
	let t = ts + parseInt(latency/2)
	var ntp_time = new Date(t)
	write_clock(ntp_time, e_ntptime)
	if (e_latency) {
		e_latency.innerHTML = latency + ' ms'
	}
	if (e_time_diff) {
		write_time_diff(t1-t)
		//console.log('网络延时:', t1-t0 + 'ms')
	}
}
function write_time_diff(dt) {
	dt = dt / 1000
	if (dt >= 1) {
		stat = '快'
	}
	else if (dt <= -1) {
		dt = -dt
		stat = '慢'
	}
	else {
		e_time_diff.innerHTML = '时间误差小于1s'
		return
	}
	str_time_diff = '本地时间 <b>' + stat + '</b> 了&emsp;'

	if (dt >= 86400) {
		// str_time_diff += String(dt/86400000).replace(/\.[0-9]+/, '') + ' 天'
		str_time_diff += parseInt(dt/86400) + ' 天 ' +
				parseInt(dt%86400/3600) + ' 小时'
		e_time_diff.innerHTML = str_time_diff
		return
	}
	if (dt >= 3600) {
		str_time_diff += parseInt(dt/3600) + ' 小时 '
	}
	if (dt >= 60) {
		str_time_diff += parseInt(dt%3600/60) + ' 分 ' +
				parseInt(dt%60) + ' 秒'
	}
	else {
		str_time_diff += dt + ' 秒'
	}
	e_time_diff.innerHTML = str_time_diff
}

// get ntp-time with JSONP
// 不直接在html内添加<script>而是使用append因为需要计算往返时间
/*
if (e_ntptime) {
	var e_script = document.createElement('script');
	//e_script.setAttribute('src', '/api/time?cb')
	e_script.src = 'https://api.aoeiu.eu.org/time?cb';
	var t0 = Date.now();
	// document.body.appendChild(e_script);
	document.head.appendChild(e_script);
}
*/
// get npt-time with fetch
if (e_ntptime) {
	t0 = Date.now();
	fetch('https://api.aoeiu.eu.org/time').then(res => {
		return res.text();
	})
	.then(data =>{
		write_ntptime(parseInt(data));
	})
	.catch(err =>{
		e_ntptime.innerHTML = '获取失败';
		e_latency.innerHTML = '连接失败';
	})
}