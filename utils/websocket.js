import utils from '@/utils/util.js'
class WebSocketClass {
	constructor(url) {
		this.lockReconnect = false; // 是否开始重连
		this.wsUrl = ""; // ws 地址
		this.globalCallback = null; // 回调方法
		this.userClose = false; // 是否主动关闭
		this.createWebSocket(url);
	}
	createWebSocket(url) {
		//  #ifdef H5
		if (typeof(WebSocket) === 'undefined') {
			this.writeToScreen('你的浏览器不支持websocket,无法获取数据')
			return false;
		}
		// #endif

		// #ifdef APP-PLUS
		if (typeof(uni.connectSocket) === 'undefined') {
			this.writeToScreen('你的浏览器不支持websocket,无法获取数据')
			return false;
		}
		// #endif

		this.wsUrl = url;

		try {
			// 创建一个this.ws对象【发送、接收、关闭socket都由这个对象操作】
			// #ifdef H5
			this.ws = new WebSocket(this.wsUrl);
			this.initEventHandle();
			// #endif

			// #ifdef APP-PLUS
			this.ws = uni.connectSocket({
				url: this.wsUrl,
				success(data) {
					console.log('websocket连接成功');
					this.initEventHandle();
				}
			})
			// #endif

		} catch (e) {
			this.reconnect(url);
		}

	}
	initEventHandle() {
		// 监听websocket
		// #ifdef H5
		this.ws.onopen = (event) => {
			console.log("WebSocket连接打开")
		}
		// #endif
		// #ifdef APP-PLUS
		this.ws.onOpen(res => {
			console.log("WebSocket连接打开")
		})
		// #endif

		// #ifdef H5
		this.ws.onclose = (event) => {
			if (!this.userClose) {
				this.reconnect(this.wsUrl)
			}
		}
		// #endif

		// #ifdef APP-PLUS
		this.ws.onClose = (event) => {
			if (!this.userClose) {
				this.reconnect(this.wsUrl)
			}
		}
		// #endif

		// #ifdef H5
		this.ws.onerror = (event) => {
			if (!this.userClose) {
				this.reconnect(this.wsUrl)
			}
		}
		// #endif

		// #ifdef APP-PLUS
		this.ws.onError = (event) => {
			if (!this.userClose) {
				this.reconnect(this.wsUrl)
			}
		}
		// #endif


		// #ifdef H5
		this.ws.onmessage = (event) => {
			if (utils.isJSON(event.data)) {
				const jsonObject = JSON.parse(event.data);
				this.globalCallback(jsonObject);
			} else {
				this.globalCallback(event.data)
			}
		}
		// #endif

		// #ifdef APP-PLUS
		this.ws.onMessage = (event) => {
			if (utils.isJSON(event.data)) {
				const jsonObject = JSON.parse(event.data);
				this.globalCallback(jsonObject);
			} else {
				this.globalCallback(event.data)
			}
		}
		// #endif
	}
	// 关闭wsl连接回调
	reconnect(url) {
		if (this.lockReconnect) {
			return;
		}
		this.ws.close();
		this.lockReconnect = true;
		setTimeout(() => {
			this.createWebSocket(url);
			this.lockReconnect = false
		}, 1000)
	}
	webSocketSendMsg(msg) {
		this.ws && this.ws.send({
			data: msg,
			success() {
				console.log("消息发送成功");
			},
			fail(err) {
				console.log("关闭失败", err)
			}

		})
	}
	// 获取ws返回的数据方法
	getWebSocketMsg(callback) {
		this.globalCallback = callback;
	}
	//关闭ws方法
	closeSocket() {
		if (this.ws) {
			this.userClose = true;
			this.ws.close({
				success() {
					console.log("消息发送成功");
				},
				fail(err) {
					console.log("关闭失败", err)
				}
			})
		}
	}
	writeToScreen(massage) {
		console.log(massage);
	}
}
export default WebSocketClass;