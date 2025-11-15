import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Hotel } from "lucide-react";
import { toast } from "sonner";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication (in real app, call API)
    if (formData.email && formData.password) {
      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error("Please fill in all fields");
    }
  };

  return (
    <div className="login">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Hotel />
            <span>Deepak Inn</span>
          </div>
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="login-submit">
            Sign In
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{" "}
          <Link to="/register" className="login-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
