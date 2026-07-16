const axios = require("axios");

const USER_URL = "https://script.google.com/macros/s/AKfycbzkDQpen2n25crfT5ARoHgOCphR-Yq394NWw24VTd7g4W3MYZ18VLSJ74npAoGrizWg/exec";

async function testWithQuery(label, queryStr) {
  console.log(`Testing with query: ${queryStr}...`);
  const dataInput = {
    action: "register",
    timeNow: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
    userIp: "1.2.3.4",
    AccountID: "test_q_" + Math.floor(Math.random() * 100000),
    CellPhone: "+84 987 654 321",
    NickName: "Test Query Parameter",
    PWD: "password123",
    AgentID: ""
  };

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: USER_URL + queryStr,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(dataInput),
    timeout: 10000
  };

  try {
    const response = await axios.request(config);
    console.log(`[${label}] Response:`, JSON.stringify(response.data));
  } catch (error) {
    console.error(`[${label}] Error:`, error.message);
  }
}

async function run() {
  await testWithQuery("sheet query", "?sheet=GDK1");
  await testWithQuery("sheetName query", "?sheetName=GDK1");
  await testWithQuery("sheet_name query", "?sheet_name=GDK1");
  await testWithQuery("action query", "?action=GDK1");
}

run();
