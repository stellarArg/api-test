module.exports = (err, req, res, next) => {
    if (err) {
        return res.status(err.status || 403).send({
            message: err.message,
            errors: err.errors
        });
    }
    next();
};
