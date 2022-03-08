export function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.json(false);
    }
}