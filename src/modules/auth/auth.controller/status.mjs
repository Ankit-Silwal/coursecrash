import Auth from "../auth.schema.mjs";
import { getSession, extendSession } from "../auth.session.mjs";

export const status = async (req, res) => {
	try {
		const sessionId = req.cookies?.sessionId
			|| req.headers["x-session-id"]
			|| req.query.sessionId;

		if (!sessionId) {
			return res.status(200).json({
				success: true,
				loggedIn: false,
				user: null,
				role: null,
				message: "No session found"
			});
		}

		const session = await getSession(sessionId);
		if (!session) {
			return res.status(200).json({
				success: true,
				loggedIn: false,
				user: null,
				role: null,
				message: "Session expired or invalid"
			});
		}

		// Best-effort extend the session TTL
		await extendSession(sessionId);

		const user = await Auth.findById(session.userId).lean();
		if (!user) {
			return res.status(200).json({
				success: true,
				loggedIn: false,
				user: null,
				role: null,
				message: "User not found for session"
			});
		}

		return res.status(200).json({
			success: true,
			loggedIn: true,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				role: user.role,
				isVerified: user.isVerified
			},
			role: user.role
		});
	} catch (err) {
		console.error("Status endpoint error:", err);
		return res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
};

