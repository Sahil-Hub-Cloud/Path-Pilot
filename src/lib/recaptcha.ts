export async function verifyRecaptcha(token: string) {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
        console.warn("RECAPTCHA_SECRET_KEY missing. Skipping verification.");
        return { success: true, score: 1.0 };
    }

    try {
        const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${secretKey}&response=${token}`,
        });

        let data;
        try {
            data = await response.json();
        } catch (e) {
            console.error("Malformed JSON from reCAPTCHA:", e);
            return { success: false, error: "Invalid response format" };
        }

        return {
            success: data.success,
            score: data.score, // v3 returns a score (0.0 to 1.0)
            error: data["error-codes"]?.join(", "),
        };
    } catch (error) {
        console.error("reCAPTCHA verification error:", error);
        return { success: false, error: "Verification system error" };
    }
}
