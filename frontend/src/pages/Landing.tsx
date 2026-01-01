import { Link } from "react-router-dom";
import "./Landing.css";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Landing() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (token) {
        navigate("/dashboard", { replace: true });
      }
    }, [token, navigate]);
  
    return (
      <div className="landing">
        <header className="landing-hero">
            <div className="landing-center">

                <div className="landing-badge">🍅 Tomato Tasks</div>

                <h1 className="landing-title">
                Turn daily tasks into a garden you can actually grow.
                </h1>

                <p className="landing-subtitle">
                Create tasks, beat the time bombs, and earn tomatoes. Miss deadlines
                and the garden fights back with fog, weeds, and wilted leaves—until
                you complete tasks to recover.
                </p>

                <div className="landing-cta">
                <Link className="btn btn-primary" to="/register">
                    Get started
                </Link>
                <Link className="btn btn-secondary" to="/login">
                    Log in
                </Link>
                </div>

                <div className="landing-stats">
                <div className="stat">
                    <div className="stat-num">⏱️</div>
                    <div className="stat-text">
                    <strong>Time-bomb tasks</strong>
                    <span>Deadlines that matter</span>
                    </div>
                </div>

                <div className="stat">
                    <div className="stat-num">🌱</div>
                    <div className="stat-text">
                    <strong>Garden growth</strong>
                    <span>Earn tomatoes for consistency</span>
                    </div>
                </div>

                <div className="stat">
                    <div className="stat-num">🌫️</div>
                    <div className="stat-text">
                    <strong>Punishments</strong>
                    <span>Fog, weeds, fungus, bugs and wilt — all fixable</span>
                    </div>
                </div>
                </div>

            </div>
            </header>
  
        <footer className="landing-footer">
          © 2025 Tomato Tasks · Built with 💚
        </footer>
      </div>
    );
}
  