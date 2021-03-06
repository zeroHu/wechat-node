"use strict"

const config = require('./config');
const Wechat = require('./wechat/wechat');
const path = require('path');
const menus_file = path.join('./config/menus.js');

const wechatApi = new Wechat(config.wechat);

const reply = function*(next) {
    // 初始化菜单
    wechatApi.createMenu(menus_file);
    // 获取信息
    let message = this.weixin;
    // 事件
    if (message.MsgType === 'event') {
        // 订阅事件
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('扫码进入的' + message.EventKey + message.ticket);
            }
            this.body = '你是扫码订阅的这个号'
        }
        // 取消订阅
        else if (message.Event === 'unsubscribe') {
            console.log('取关了');
            this.body = '您取关了';
        }
        // 地理位置
        else if (message.Event === 'LOCATION') {
            this.body = '您上报的位置是:' + message.Latitude + '/' + message.Longitude + '-' + message.Precision;
        }
        // 点击了菜单
        else if (message.Event === 'CLICK') {
            this.body = '您点击了菜单' + message.EventKey;
        }
        // 扫码
        else if (message.Event === 'SCAN') {
            this.body = '您扫码了' + message.EventKey;
        }
        // 视图
        else if (message.Event === 'VIEW') {
            this.body = '您点击了菜单中的链接' + message.EventKey;
        }
    }
    // 文本回复
    else if (message.MsgType === 'text') {
        let content = message.Content;
        let reply = '您说的' + message.Content + '太浮夸了';

        // 根据用户输入的内容来回复
        if (content === '1') {
            reply = '你回复1 我是不知道你想干啥的';
        } else if (content === '2') {
            // 图文消息固定格式是这样 可查阅文档 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140543
            reply = [{
                title: "技术改变",
                descripttion: "just descripttion",
                picUrl: "http://blog.zeroyh.cn/images/avatar.jpeg",
                url: "http://blog.zeroyh.cn/"
            }]
        } else if (content === '5') {
            // 自动回复图片消息
            /**
             * data json
             * {
             *     type: 'image',
             *     media_id: 'NyNbgp3NTNx8ENnpzmYeuwi_bskhlQrGK_AfMKxcm_vHR-ffhcBNxvgsQv_Dq_Kc',
             *     created_at: 1512307028
             * }
             * @type {[type]}
             */
            let data = yield wechatApi.uploadMaterial('image', __dirname + '/2.jpg');
            reply = {
                type: 'image',
                mediaId: data.media_id
            }
        }
        this.body = reply;
    }
    // 语音回复
    else if (message.MsgType === 'voice'){

    }
    // 图片回复
    else if(message.MsgType === 'image'){

    }
    yield next;
}

module.exports = {
    reply: reply
};