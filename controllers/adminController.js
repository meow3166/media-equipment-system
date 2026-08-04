const pool = require("../database/db");

exports.getDashboard = async (req, res) => {
    try {
        const [[pendingResult]] = await pool.query(
            `
            SELECT COUNT(*) AS count
            FROM users
            WHERE user_status = 'pending'
              AND user_role = 'student'
            `
        );

        const [[activeResult]] = await pool.query(
            `
            SELECT COUNT(*) AS count
            FROM users
            WHERE user_status = 'active'
              AND user_role = 'student'
            `
        );

        const [[totalResult]] = await pool.query(
            `
            SELECT COUNT(*) AS count
            FROM users
            WHERE user_role = 'student'
            `
        );

        return res.render("admin/dashboard.html", {
            pageTitle: "관리자 대시보드",
            pendingCount: pendingResult.count,
            activeCount: activeResult.count,
            totalCount: totalResult.count
        });

    } catch (error) {
        console.error("관리자 대시보드 조회 오류:", error);

        return res.status(500).send(
            "관리자 대시보드를 불러오는 중 오류가 발생했습니다."
        );
    }
};

exports.getPendingUsers = async (req, res) => {
    try {
        const [pendingUsers] = await pool.query(
            `
            SELECT
                user_id,
                login_id,
                user_name,
                phone,
                email
            FROM users
            WHERE user_status = 'pending'
              AND user_role = 'student'
            ORDER BY user_id DESC
            `
        );

        return res.render("admin/pending-users.html", {
            pageTitle: "회원가입 승인 관리",
            pendingUsers
        });

    } catch (error) {
        console.error("승인 대기 회원 조회 오류:", error);

        return res.status(500).send(
            "승인 대기 회원을 불러오는 중 오류가 발생했습니다."
        );
    }
};

exports.approveUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const [result] = await pool.query(
            `
            UPDATE users
            SET user_status = 'active'
            WHERE user_id = ?
              AND user_status = 'pending'
              AND user_role = 'student'
            `,
            [userId]
        );

        if (result.affectedRows === 0) {
            return res.redirect(
                "/admin/users/pending?error=처리할 수 없는 회원입니다."
            );
        }

        return res.redirect(
            "/admin/users/pending?success=회원가입을 승인했습니다."
        );

    } catch (error) {
        console.error("회원 승인 오류:", error);

        return res.redirect(
            "/admin/users/pending?error=승인 처리 중 오류가 발생했습니다."
        );
    }
};

exports.rejectUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const [result] = await pool.query(
            `
            UPDATE users
            SET user_status = 'rejected'
            WHERE user_id = ?
              AND user_status = 'pending'
              AND user_role = 'student'
            `,
            [userId]
        );

        if (result.affectedRows === 0) {
            return res.redirect(
                "/admin/users/pending?error=처리할 수 없는 회원입니다."
            );
        }

        return res.redirect(
            "/admin/users/pending?success=회원가입을 거절했습니다."
        );

    } catch (error) {
        console.error("회원 거절 오류:", error);

        return res.redirect(
            "/admin/users/pending?error=거절 처리 중 오류가 발생했습니다."
        );
    }
};