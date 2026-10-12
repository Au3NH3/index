const e_lgbox = document.querySelector('#login');
// children / childNodes只返回子代（不包含子代的子代）
// e.children[0] e.children.namedItem('id or name')
const e_lgform = e_lgbox.children.namedItem('login-form');
// const e_login_msg = document.querySelector('#login_msg');

//document.cookies format:	"k1=v1; k2=v2"
function get_cookie(name) {
	if (document.cookie) {
		let cookies = document.cookie.split('; ');
		for (let item of cookies) {
			let kv = item.split('=');
			if (kv[0] == name) {
				return kv[1];
			}
		}
	}
	return '';
}

// function write_greeting(user) {}
let user = get_cookie('user');
if (user) {
	// write_greeting(user);
	// var e_greet = document.createElement('div');
	// e_greet.className = 'text-center';
	// e_lgbox.insertAdjacentElement('beforebegin', e_greet);
	e_lgbox.innerHTML = "<div class='text-center'>欢迎, " + user + 
		"!<br><a href='/auth/logout'>退出登录</a></div>";

}

function encrypt(str) {
	for (let i=0; i<3; i++) {
		str = btoa(str)
	}
	return str;
}

e_lgform.addEventListener('submit', (event)=>{
	event.preventDefault();
	/*
	e_lgform.pass.value = encrypt(e_lgform.pass.value);
	let data = new FormData(e_lgform);

	var protocol = location.protocol.slice(0, -1);
	if (protocol != 'https') {
		e_lgform.msg.innerHTML = 
`Submit failed!
Please access over <em>https</em> for security.
Current protocol is <em>${protocol}</em>
` +		"user: " + data.get("user") + "&emsp;pass: ***";
		//for(var k of data.entries()) {
		//	console.log(k[0],' : ',k[1]);
		//}
		e_lgform.user.value = '';
		e_lgform.pass.value = '';
		e_lgform.user.focus();
		return;
	}

	fetch('/auth', {
		method: 'POST',
		// headers: {"Conten-Type": "application/json"},
		// body: JSON.stringify(data)
		body: data
	})
	.then(res => res.text())
	.then(text => e_lgform.msg.value = text);
	*/
	e_lgform.msg.value = 'developing... not supported';
	setTimeout( ()=> {
		//e_lgform.msg.value = '';
		e_lgform.reset();
	}, 3000);
	// .then(res => res.json())
	// .then(auth => {
		// if (auth.authed) {
			// // e_login.innerHTML = auth.user;
			// write_greeting(auth.user);
		// }
		// else {
			// e_lgform.msg.value = '登录失败<br>' +
				// 'user: ' + e_lgform.user.value + '&emsp; pass: ***';
			// e_lgform.user.value = '';
			// e_lgform.pass.value = '';
		// }
	// })
})