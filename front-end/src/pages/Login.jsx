import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useResume from "./resumecontext";
import "./Login.css";

export default function Login() {
    const { fetchProfiles, showToast } = useResume();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
        const url = `http://localhost:5000${endpoint}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(isLogin ?
                    { email: formData.email, password: formData.password } :
                    formData
                ),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            if (!isLogin) {
                showToast("Account created successfully! Please sign in.", "success");
                setIsLogin(true);
                setFormData({ ...formData, password: "" });
                return;
            }

            // Save user info to local storage (only for Login)
            localStorage.setItem("user", JSON.stringify(data));

            // Refresh resumes state for the new user
            await fetchProfiles();

            // Redirect based on role
            if (data.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container animate-in">
                <div className="login-left">
                    <div className="brand">
                        <span className="brand-icon">📄</span>
                        <h1>ResumePro</h1>
                    </div>
                    <p>Create professional resumes in minutes with our AI-powered templates.</p>
                    <div className="features">
                        <div className="feature-item">✓ 30+ Premium Templates</div>
                        <div className="feature-item">✓ High-Quality PDF Export</div>
                        <div className="feature-item">✓ Real-time Live Preview</div>
                    </div>
                </div>

                <div className="login-right">
                    <div className="form-box">
                        <h2>{isLogin ? "Welcome Back" : "Join ResumePro"}</h2>
                        <p className="form-subtitle">
                            {isLogin ? "Enter your details to continue" : "Start your professional journey today"}
                        </p>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="input-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {isLogin && (
                                <div className="form-options">
                                    <label className="remember-me">
                                        <input type="checkbox" /> Remember me
                                    </label>
                                    <a href="#" className="forgot-pwd">Forgot password?</a>
                                </div>
                            )}

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
                            </button>
                        </form>

                        <div className="social-login">
                            <span className="divider">Or continue with</span>
                            <div className="social-btns">
                                <button className="social-btn google">
                                    <svg width="20" height="20" viewBox="0 0 24 24">
                                        <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.75 1.81L20.1 3.5C17.81 1.44 14.96 1 12 1 7.73 1 4.12 3.55 2.5 7.14l4.22 3.28C7.69 7.74 9.6 5.04 12 5.04z" />
                                        <path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.44c-.28 1.48-1.13 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.49-5.02 3.49-8.62z" />
                                        <path fill="#FBBC05" d="M2.5 7.14c-.31.9-.5 1.87-.5 2.86s.19 1.96.5 2.86l4.22-3.28C6.63 10.87 6.63 10.13 6.72 9.58L2.5 7.14z" />
                                        <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.5 1.18-4.2 1.18-3.24 0-5.97-2.18-6.96-5.11L2.5 12.86c1.62 3.59 5.23 6.14 9.5 6.14z" />
                                    </svg>
                                </button>
                                <button className="social-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <p className="switch-text">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                            <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
                                {isLogin ? "Sign Up" : "Sign In"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
