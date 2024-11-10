const validateDocumentId = (req, res, next) => {
    const { id } = req.params;
    if (!id || isNaN(id)) { // Adjust this condition as needed based on your ID validation logic
        return res.status(400).json({ message: 'Invalid document ID' });
    }
    next();
};

module.exports = validateDocumentId;
 