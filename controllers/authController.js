const pool = require("../database/db");

exports.getLoginPage = (req, res) => {
    res.render("login.html");
};

exports.login = async (req, res) => {
    const { P_userId, P_password } = req.body;

    try {
        const [rows] = await pool.query(
            `
            SELECT
                user_id,
                login_id,
                password_hash,
                user_name,
                user_role,
                user_status
            FROM users
            WHERE login_id = ?
            `,
            [P_userId]
        );

        if (rows.length === 0) {
            return res.render("login.html", {
                errorMessage: "아이디 또는 비밀번호가 올바르지 않습니다."
            });
        }

        const user = rows[0];

        if (user.password_hash !== P_password) {
            return res.render("login.html", {
                errorMessage: "아이디 또는 비밀번호가 올바르지 않습니다."
            });
        }

        if (user.user_status !== "active") {
            return res.render("login.html", {
                errorMessage: "승인되지 않은 계정입니다."
            });
        }

        req.session.user = {
            user_id: user.user_id,
            login_id: user.login_id,
            name: user.user_name,
            role: user.user_role
        };

        return res.redirect("/");

    } catch (error) {
        console.error(error);

        return res.render("login.html", {
            errorMessage: "로그인 처리 중 오류가 발생했습니다."
        });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
};