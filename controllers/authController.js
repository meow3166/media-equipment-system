exports.getLoginPage = (req, res) => {
    res.render("login.html");
};

exports.login = (req, res) => {

    const { P_userId, P_password } = req.body;

    if (P_userId === "admin" && P_password === "1234") {

        req.session.user = {
            id: "admin",
            name: "관리자",
            role: "admin"
        };

        return res.redirect("/");
    }

    if (P_userId === "student" && P_password === "1234") {

        req.session.user = {
            id: "student",
            name: "학생",
            role: "student"
        };

        return res.redirect("/");
    }

    return res.send("아이디 또는 비밀번호가 틀렸습니다.");
};

exports.logout = (req, res) => {

    req.session.destroy(() => {
        res.redirect("/");
    });

};