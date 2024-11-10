const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: Object.values(err.errors).map(e => e.message)
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            error: 'This email or username is already registered'
        });
    }
 
    res.status(500).json({
        success: false,
        error: 'Something went wrong on the server'
    });
};

module.exports = errorHandler; 