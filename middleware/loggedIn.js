export function loggedIn(req, res, next) {
    console.log(req)
    if (req.user) {
        next();
    } else {
        res.json(false);
    }
}