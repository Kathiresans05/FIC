import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const path = user.role === 'Agent' ? '/agent/dashboard' : 
                   user.role.includes('Admin') ? '/admin/dashboard' : '/team/dashboard';
      navigate(path);
    }
  }, [user, navigate]);



  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    
    if (!result || !result.success) {
      setError(result?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-box">
            <img 
              src="https://forgeindiaconnect.com/assets/img/logo/forgeindia_l1.webp" 
              alt="Forge India Logo" 
              style={{ height: '84px', marginBottom: '16px' }} 
            />
          </div>
          <p className="tagline">Smart Recruitment Operations & Referral Incentives</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">


          {error && (
            <div className="error-message" style={{ color: '#DC2626', backgroundColor: '#FEF2F2', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: '500', textAlign: 'center', border: '1px solid #FEE2E2' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="e.g. name@forgeindia.pro" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn">
            Login to Dashboard
          </button>
          
          <div className="login-footer">
            <a href="#" className="forgot-link">Forgot password?</a>
            <p className="help-text">Need help? Contact support@forgeindia.pro</p>
          </div>
        </form>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F1F5F9;
          padding: 20px;
        }
        .login-card {
          width: 100%;
          max-width: 540px;
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          padding: 40px;
        }
        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .logo-box h1 {
          font-size: 2rem;
          margin-bottom: 8px;
        }
        .logo-box h1 span { color: var(--accent-orange); }
        .tagline {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .form-group {
          margin-bottom: 24px;
        }
        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        .role-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .role-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          text-align: left;
          transition: 0.2s;
        }
        .role-card:hover {
          background: var(--bg-main);
          border-color: #CBD5E1;
        }
        .role-card.active {
          border-color: var(--accent-orange);
          background: #FFF7ED;
          box-shadow: 0 0 0 1px var(--accent-orange);
        }
        .role-icon {
          color: var(--text-secondary);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .role-card.active .role-icon {
          color: var(--accent-orange);
        }
        .role-info {
          display: flex;
          flex-direction: column;
        }
        .role-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .role-desc {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 2px;
          line-height: 1.4;
        }
        input {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: 14px;
          background: #F8FAFC;
        }
        .password-input {
          position: relative;
        }
        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }
        .password-toggle:hover {
          color: #64748B;
        }
        .login-btn {
          width: 100%;
          padding: 14px;
          background: var(--primary);
          color: white;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 16px;
          margin-top: 8px;
          transition: 0.2s;
        }
        .login-btn:hover {
          background: #111827;
        }
        .login-footer {
          margin-top: 24px;
          text-align: center;
        }
        .forgot-link {
          font-size: 14px;
          color: var(--accent-orange);
          font-weight: 500;
        }
        .help-text {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
};

export default Login;
