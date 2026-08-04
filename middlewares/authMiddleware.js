const requireAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }

    if (req.session.user.role !== "admin") {
        return res.status(403).send("접근 권한이 없습니다.");
    }

    next();
};

module.exports = {
    requireAdmin
};