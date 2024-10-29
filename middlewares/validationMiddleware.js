
exports.validateReminderData = (req, res, next) => {
    const { date, time, message } = req.body;
  
    if (!date || !time || !message) {
      return res.status(400).json({ message: "Date, time, and message are required." });
    }
  
    next(); 
  };
  
  exports.validateCaptchaData = (req, res, next) => {
    const { captchaCode } = req.body;
  
    if (!captchaCode) {
      return res.status(400).json({ message: "CAPTCHA code is required." });
    }
  
    next();
  };
  