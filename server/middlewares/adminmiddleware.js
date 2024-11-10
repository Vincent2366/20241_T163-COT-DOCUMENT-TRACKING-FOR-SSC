
exports.isAdmin = (req, res, next) => {
    const userRole = req.user.role; // Assuming req.user is set after authentication

    if (userRole !== 'Admin') {
        return res.status(403).json({ message: 'Access denied: Admins only.' });
    }
    next();
};
 