// ----------
// author: AuIII
// create-time: 2023.xx.xx
// last-modify: 2025.10.09
// version: 2.1.0
// ----------

const e_ipaddr = document.querySelector('#ipaddr')
const e_ipgeo  = document.querySelector('#ipgeo')
const e_btmyip = document.querySelector('#bt-myip');
const e_myip = document.querySelector('#myip');
const e_ipload = document.querySelector('#ip-load');
const e_btip = document.querySelector('#bt-ip');
// const e_info = document.querySelector('#info');
// const e_ipquery = document.querySelector('#ipquery');
// const e_formip = document.querySelector('#ipquery form');
// let index_ip = 1;
// const arr_i = {'ip':1, 'info':2};
const e_nav_bar = document.getElementById('nav-bar');
const e_nav_items = document.getElementsByClassName('nav-btn');
const e_nav_targets = document.getElementsByClassName('nav-target');
const e_navip = e_nav_items['nav-ip'];
const e_info = e_nav_targets['info'];
const e_about = e_nav_items['nav-about'];
const e_formip = document.forms['form-ip'];

//arr_elements = ['scree-size', 'screen-avail', 'outer-size', 'inner-size']
// const e_newtab = document.querySelectorAll('a:not([href^="#"]):not(".self")')
// e_a_new.forEach( a => a.target = '_blank')
// e_a_new.forEach( a => a.setAttribute('target', '_blank') )

const e_sizes = document.querySelectorAll('#size [data-attr]');

//var str_display = '{display: block;}'
//var str_css = '{color:green}'
// -----  切换显示内容 & 导航栏活跃状态 -----
let cont0 = sessionStorage.navActive || 'home';
let nav0 = `nav-${cont0}`;
e_nav_items[nav0].classList.add('active');
e_nav_targets[cont0].classList.add('active');

let resized;
e_nav_bar.addEventListener('click',  (evt)=>{
	ele = evt.target;
	nav1 = ele.id;
	//o = e.dataset.order;
	
	if (!e_nav_items[nav1] || nav1==nav0) {
		return;
	}
	cont1 = nav1.slice(4);
	sessionStorage.navActive = cont1;
	e_nav_items[nav0].classList.remove('active');
	e_nav_targets[cont0].classList.remove('active');
	ele.classList.add('active');
	e_nav_targets[cont1].classList.add('active');
	if(cont0=='home'){
		//不活跃时停止时钟
		stop_clock()
	}

	if (cont1=='home') {
		renew_clock()
	} else if (cont1 == 'size' && resized) {
		e_sizes.forEach( ele => {
			ele.textContent = myeval(ele.dataset.attr)();
		})
		resized = 0;
	}
	nav0 =nav1;
	cont0=cont1;
	//scroll({top: 0});
})

// --- dispatchEvent触发事件 导航栏e_ip 点击事件 ---
let clickEvent = new Event('click', {bubbles: true});
e_btip.addEventListener('click', ()=>{
	e_navip.dispatchEvent(clickEvent)
})

e_about.addEventListener('click', (evt)=>{
	sessionStorage.navActive = 'about';
	e_nav_items[nav0].classList.remove('active');
	e_nav_targets[cont0].classList.remove('active');
	evt.target.classList.add('active');
	e_nav_targets['about'].classList.add('active');
	if(cont0=='home'){
		stop_clock();
	}
	cont0='about';
	nav0='nav-about';
})

// array to be writen to e_info
var arry_info = [
	'onLine',
	// 'connection',
	'language',
	'languages',
	// 'geolocation',
	//'oscpu',		//已弃用.操作系统版本,返回空
	'platform',		//mdn显示已弃用. 'win32','Linux armv81', etc.
	// 'appName',		//已弃用,返回'Netscape'
	// 'appCodeName',		//已弃用,返回'Mozilla'
	// 'appVersion',		//已弃用
	'userAgent'
]
// write navigator[info] to e_info
// function write_info() {
	let str_info = '<table><caption>navigator</caption>';
	for (attr of arry_info) {
		str_info += '<tr><td>'+ attr +'</td><td>'+ navigator[attr] +'</td></tr>';
	}
	str_info += '</table>';
	e_info.insertAdjacentHTML('afterbegin', str_info);
// }


// --- write screen size info ---
// write data-attr to element
const e_attrs = document.querySelectorAll('[data-attr]')
//function write_attrs() {
	e_attrs.forEach( ele => {
		ele.textContent = myeval(ele.dataset.attr)();
	})
// }

//
//xx 连续改变改变窗口大小时，onresize持续调用，耗费cpu xx
// 并非onresize耗费cpu，改变窗口本身耗费cpu
let tt = null;
window.addEventListener('resize', ()=>{
	if (cont0 == 'size') {
	if (tt) {
		clearTimeout(tt)
	}
	tt = setTimeout( ()=>{
		// console.log('resize')
		e_sizes.forEach( ele => {
			ele.textContent = myeval(ele.dataset.attr)();
		})
		tt=null;
	}, 500)
	} else {
		resized = 1;
	}
})
//var w0 = window.innerWidth
//var h0 = window.innerHeight
//e_nav_info.addEventListener('click', ()=>{
//	if (w0 != window.innerWidth || h0 != window.innerHeight) {
//		setdata_screen_size()
//		w0 = window.innerWidth
//		h0 = window.innerHeight
//	}
//})

// screen === window.screen
// document.documentElement === <html>
// body.size != html.size


e_formip.addEventListener("submit", e => {
	e.preventDefault();
	//var dd = new FormData(e_formip);
	//for(var k of dd.entries()) {
	//	console.log(k[0],' : ',k[1]);
	//}
	let input = e_formip.ip.value;
	/*
	if (input == "localhost") {
		e_formip.out.innerText = 
`domain: localhost
ip: 127.0.0.1
region: loopback`
	}
	else if (input.match(/^[0-9.]+$/)) {
		let nums = input.split('.');
		if (nums.length == 4) {
			for (let n of nums) {
				if (!n || Number(n) > 255) {
					e_formip.out.value = 'illigle ip address: ' + input;
					return;
				}
			}
			e_formip.out.value = 'ip address is: ' + input;
			// fetch(`/api/ip/?ip=${input}`)
		}
		else {
			e_formip.out.value = '2.illigle ip address' + input;
		}
	}
	else if (input.match(/^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/)) {
		e_formip.out.value = "domain is: " + input;
		// fetch(`/api/ip/?domain=${input}`)
	}
	else {
		e_formip.out.value = 'unknown domain:' + input;
	}
	*/
	e_formip.out.value = `not support now. Input is ${input}`;
	setTimeout( ()=> e_formip.reset(), 3000);
})
// ----- ip -----
/*
function write_ip(ip) {
	
	let geo = ip.city +' '+ ip.isp
	if (ip.country == '中国') {
		e_ipgeo.innerHTML = geo
	}
	else {
		e_ipgeo.innerHTML = ip.country + ' ' + geo
	}
}*/

// sessionStorage仅当前标签页可用，窗口关闭即失效
// 使用 sessionStorage 减少api请求
e_btmyip.addEventListener('click', e => {

if (sessionStorage.ip) {
	e_myip.innerText = sessionStorage.ip;
} else {
	e_ipload.textContent = '正在查询...';
	// fetch返回"当前 IP：x.x.x.x  来自于：country province city  isp\n"
	fetch("https://myip.ipip.net/")
		.then( res => res.text() )
		.then( data => {
			ip = data.replace('  ', '\n');
			e_myip.innerText = ip;
			sessionStorage.ip = ip;
		})
		.catch(err =>{
			e_ipload.textContent = 'IP地址获取失败';
			setTimeout( ()=> e_ipload.textContent = '', 1000 )
			//console.log('err: ',err);
		})


			// match返回数组. [0]:匹配结果, [n]:第n个括号的捕获结果
			// ip = data.match(/：(.+?) /)[1];
			// if (ip.indexOf('.') == -1)  ip = '\n' + ip;
			// ipgeo = data.slice(data.lastIndexOf('：')+1);
			// sessionStorage.ip = ip;
			// sessionStorage.ipgeo = ipgeo;
			// e_ipaddr.innerText = ip;
			// e_ipgeo.textContent = ipgeo;


	//https://api.myip.la/cn?json
			//ip = data.ip;
			//if (ip.indexOf('.') == -1)  ip = '\n' + ip;
			//e_ipaddr.innerText = ip;
			//e_ipgeo.textContent = data.location.country_name +
			//	" "+ data.location.province +" "+ data.location.city;
		//})
}
})

// 使用 new Function 代替 eval
// 用法: myeval(str)()
function myeval (str) {
	return new Function('return ' + str)
}


/*
// if (/android/i.test(navigator.userAgent)) {
	e_dpcont = document.querySelector('.dp-content');
	// e_dpbtn = document.querySelector('.dp-content');
	e_rain = document.querySelector('#footer');
	let eve_on = new MouseEvent('mouseenter', {
		view: window,
		bubbles:true
	});
	let eve_out = new MouseEvent('mouseleave', {
		view: window,
		bubbles:true
	});
	let eve_touched = new TouchEvent('touchend');//, {bubbles:true});
	let eve_touchon = new TouchEvent('touchstart');//, {bubbles:true});
	let eve_touchmv = new TouchEvent('touchmove');//, {bubbles:true});
	e_dpcont.addEventListener('touchend', (e)=>{
		// e.preventDefault();
		// e_rain.classList.add('hide');
		// e_dpcont.dispatchEvent(
		// e_rain.dispatchEvent(eve_touchend);
			e_navip.dispatchEvent(eve_touchon);
		setTimeout(()=>{
			e_dpcont.style = 'display:none';
		}, 300);
		setTimeout(()=>{
			e_dpcont.style=''
			e_navip.dispatchEvent(clickEvent);
			// e_navip.dispatchEvent(eve_touched);
		}, 1000);
	});//, {capture:true});
	// {passive:true})
	// e_rain.addEventListener('click', ()=>{
		// e_navip.dispatchEvent(clickEvent);
		// e_navip.dispatchEvent(eve_on);
		// setTimeout(()=>{console.log('click')}, 1200);
	// })
// }
*/


/*
// android不兼容replaceAll()
//e_test.innerHTML= JSON.stringify(json_test).replaceAll(',', '<br>')
//e_test.style="white-space: pre"
str_test = JSON.stringify(json_test).replace(/"|{|}/g, '')
e_test.innerHTML= str_test.replace(/,(\w)/g, '<br>\n$1').replace(/([^0-9]:)/g, '$1&emsp;')
*/