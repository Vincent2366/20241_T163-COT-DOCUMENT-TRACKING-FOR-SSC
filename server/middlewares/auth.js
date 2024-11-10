// user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ error: 'Forbidden' });
};

// user is an officer
const isOfficer = (req, res, next) => {
    if (req.user && req.user.role === 'officer') {
        return next();
    }
    return res.status(403).json({ error: 'Forbidden' });
};

module.exports = { isAdmin, isOfficer };
  