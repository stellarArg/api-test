const {ArqService} = include('services');

module.exports = async (req, res, next) => {
    const header = req.get('Authorization');
    if (!header) {
        return res.sendStatus(401);
    }
    try {
        const {
            success, user, message, tokenExpired
        } = await ArqService.validateToken(header);
        if (!success || user.deleted) {
            return res.sendStatus(401);
        }
        // eslint-disable-next-line require-atomic-updates
        req.user = {
            ...user,
            message,
            tokenExpired
        };
        return next();
    } catch (err) {
        return res.sendStatus(401);
    }
};
