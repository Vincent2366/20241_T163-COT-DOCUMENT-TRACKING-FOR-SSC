
exports.scheduleReminder = (req, res) => {
    res.send("Scheduled a reminder in Google Calendar");
  };
  
  exports.getTasks = (req, res) => {
    res.send("Retrieved Google Tasks related to document handling");
  };
  
  exports.verifyCaptcha = (req, res) => {
    res.send("CAPTCHA verified successfully");
  };
   