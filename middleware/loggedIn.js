export function loggedIn(req, res, next) {
    console.log(req.cookies)
    if (req.user) {
        next();
    } else {
        res.json(false);
    }
}