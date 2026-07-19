const pool = require("../database/db");
const bcrypt = require("bcrypt");

exports.getLoginPage = (req, res) => {
    res.render("login.html");
};

exports.getRegisterPage = (req, res) => {
    res.render("signup.html");
};

exports.register = async (req, res) => {
    const {
        login_id,
        user_name,
        phone,
        email,
        password,
        password_confirm
    } = req.body;

    const registerData = {
        login_id: login_id?.trim(),
        user_name: user_name?.trim(),
        phone: phone?.trim(),
        email: email?.trim()
    };

    try {
        if (
            !registerData.login_id ||
            !registerData.user_name ||
            !password ||
            !password_confirm
        ) {
            return res.status(400).render("signup.html", {
                errorMessage: "필수 항목을 모두 입력해 주세요.",
                registerData
            });
        }

        if (!/^\d+$/.test(registerData.login_id)) {
            return res.status(400).render("signup.html", {
                errorMessage: "학번은 숫자로만 입력해 주세요.",
                registerData
            });
        }

        if (password.length < 8) {
            return res.status(400).render("signup.html", {
                errorMessage: "비밀번호는 8자 이상 입력해 주세요.",
                registerData
            });
        }

        if (password !== password_confirm) {
            return res.status(400).render("signup.html", {
                errorMessage: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
                registerData
            });
        }

        const [existingUsers] = await pool.query(
            `
            SELECT user_id
            FROM users
            WHERE login_id = ?
            LIMIT 1
            `,
            [registerData.login_id]
        );

        if (existingUsers.length > 0) {
            return res.status(409).render("signup.html", {
                errorMessage: "이미 가입된 학번입니다.",
                registerData
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await pool.query(
            `
            INSERT INTO users (
                login_id,
                password_hash,
                user_name,
                phone,
                email,
                user_role,
                user_status
            )
            VALUES (?, ?, ?, ?, ?, 'student', 'pending')
            `,
            [
                registerData.login_id,
                passwordHash,
                registerData.user_name,
                registerData.phone || null,
                registerData.email || null
            ]
        );

        return res.render("login.html", {
            successMessage:
                "회원가입이 완료되었습니다. 관리자 승인 후 로그인할 수 있습니다."
        });

    } catch (error) {
        console.error("회원가입 오류:", error);

        return res.status(500).render("signup.html", {
            errorMessage: "회원가입 처리 중 오류가 발생했습니다.",
            registerData
        });
    }
};

exports.login = async (req, res) => {
    const { P_userId, P_password } = req.body;

    try {
        if (!P_userId || !P_password) {
            return res.status(400).render("login.html", {
                errorMessage: "학번과 비밀번호를 모두 입력해 주세요."
            });
        }

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
            LIMIT 1
            `,
            [P_userId.trim()]
        );

        if (rows.length === 0) {
            return res.status(401).render("login.html", {
                errorMessage: "학번 또는 비밀번호가 올바르지 않습니다."
            });
        }

        const user = rows[0];

        const isPasswordMatch = await bcrypt.compare(
            P_password,
            user.password_hash
        );

        if (!isPasswordMatch) {
            return res.status(401).render("login.html", {
                errorMessage: "학번 또는 비밀번호가 올바르지 않습니다."
            });
        }

        if (user.user_status === "pending") {
            return res.status(403).render("login.html", {
                errorMessage: "관리자 승인 대기 중인 계정입니다."
            });
        }

        if (user.user_status === "rejected") {
            return res.status(403).render("login.html", {
                errorMessage: "가입이 거절된 계정입니다."
            });
        }

        if (user.user_status === "blocked") {
            return res.status(403).render("login.html", {
                errorMessage: "차단된 계정입니다. 관리자에게 문의해 주세요."
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
        console.error("로그인 오류:", error);

        return res.status(500).render("login.html", {
            errorMessage: "로그인 처리 중 오류가 발생했습니다."
        });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("로그아웃 오류:", error);
            return res.status(500).send("로그아웃 처리 중 오류가 발생했습니다.");
        }

        res.clearCookie("connect.sid");
        return res.redirect("/");
    });
};