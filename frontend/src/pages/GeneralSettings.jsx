import React, { useState, useRef } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  LogOut, 
  Save, 
  Camera, 
  CheckCircle2, 
  ChevronRight,
  Eye,
  EyeOff,
  Cloud
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GeneralSettings = () => {
  const { user, updateUserSession } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.mobile || '+91 98765 43210');
  const [address, setAddress] = useState(user?.location || 'Main HQ, Brigade Road, Bangalore, KA');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const fileInputRef = useRef(null);

  // Security Toggles
  const [twoFactor, setTwoFactor] = useState(user?.twoFactor || false);
  
  // Notification Toggles
  const [emailNotif, setEmailNotif] = useState(user?.emailNotifications ?? true);
  const [pushNotif, setPushNotif] = useState(user?.pushNotifications ?? false);
  const [payoutNotif, setPayoutNotif] = useState(user?.payoutNotifications ?? true);

  // Password States
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [pMsg, setPMsg] = useState({ text: '', type: '' });

  const handlePasswordUpdate = () => {
    if (!passwords.new || passwords.new.length < 8) {
      setPMsg({ text: 'New password must be at least 8 characters.', type: 'error' });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    
    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setPMsg({ text: 'Password successfully updated!', type: 'success' });
      setPasswords({ current: '', new: '', confirm: '' });
      setTimeout(() => setPMsg({ text: '', type: '' }), 3000);
    }, 1200);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE}/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          mobile: phone,
          location: address,
          avatar: avatarPreview,
          twoFactor,
          emailNotifications: emailNotif,
          pushNotifications: pushNotif,
          payoutNotifications: payoutNotif
        })
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      const updatedUser = await response.json();
      
      // Normalize _id -> id and update global session
      const normalizedUser = { ...updatedUser, id: updatedUser._id || updatedUser.id };
      updateUserSession(normalizedUser);

      setHasSaved(true);
      setTimeout(() => setHasSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="content-wrapper settings-page">
      <div className="section-header">
        <div>
          <h1>Settings & Preferences</h1>
          <p className="text-secondary">Manage your account details, notification triggers, and security settings.</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Sidebar Tabs */}
        <div className="settings-sidebar card">
          <button 
            className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> Profile Information
          </button>
          <button 
            className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={18} /> Security & Password
          </button>
          <button 
            className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} /> Notification Sync
          </button>
          <button 
            className={`settings-tab-btn ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            <Globe size={18} /> Language & Region
          </button>
          <div className="sidebar-divider"></div>
          <button className="settings-tab-btn text-red">
            <LogOut size={18} /> Sign Out
          </button>
        </div>

        {/* Content Area */}
        <div className="settings-content card">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <div className="section-header-lite">
                <h3>Profile Information</h3>
                <p>Update your personal details and how others see you.</p>
              </div>

              <div className="profile-header-edit">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <div 
                  className="avatar-large-edit" 
                  style={{ backgroundImage: avatarPreview ? `url(${avatarPreview})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  {!avatarPreview && <span className="avatar-txt">{name?.charAt(0).toUpperCase() || 'A'}</span>}
                  <button className="edit-cam-btn" onClick={() => fileInputRef.current.click()} type="button">
                    <Camera size={14} />
                  </button>
                </div>
                <div className="profile-name-box">
                  <h4>{user?.name || 'Admin User'}</h4>
                  <p>{user?.role || 'Administrator'}</p>
                </div>
              </div>

              <form className="settings-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-input input-disabled" defaultValue={user?.email || 'admin@forgeindia.pro'} disabled />
                    <p className="input-hint">Email cannot be changed directly. Contact support for help.</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Employee / Agent ID</label>
                    <input type="text" className="form-input input-disabled" defaultValue="EMP-1024-HF" disabled />
                  </div>
                  <div className="form-group col-span-2">
                    <label className="form-label">Address / Branch</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <div className="section-header-lite">
                <h3>Security Settings</h3>
                <p>Manage your account password and extra layers of protection.</p>
              </div>

              <div className="security-box card-lite">
                <h4>Change Password</h4>
                <div className="form-grid mt-6">
                  <div className="form-group col-span-2">
                    <label className="form-label">Current Password</label>
                    <div className="password-input-group">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        className="form-input border-none-input" 
                        placeholder="••••••••" 
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      />
                      <button type="button" className="pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      placeholder="Min 8 characters" 
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      placeholder="Confirm password" 
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                  </div>
                </div>
                {pMsg.text && (
                  <p className={`mt-4 text-xs font-semibold ${pMsg.type === 'error' ? 'text-red' : 'text-green'}`}>
                    {pMsg.text}
                  </p>
                )}
                <button 
                  className="btn btn-primary btn-sm mt-6" 
                  onClick={handlePasswordUpdate}
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>

              <div className="security-box card-lite mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4>Two-Factor Authentication (2FA)</h4>
                    <p className="text-secondary text-xs">Recommended: Adds an extra layer of security to your account.</p>
                  </div>
                  <div 
                    className={`toggle-switch ${twoFactor ? 'active' : ''}`}
                    onClick={() => setTwoFactor(!twoFactor)}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <div className="section-header-lite">
                <h3>Notification Sync</h3>
                <p>Choose how and when you want to be notified.</p>
              </div>
              
              <div className="notif-group mt-6">
                <h4 className="g-title">Platform Alerts</h4>
                <div className="notif-item">
                  <div className="ni-info">
                    <h5>Email Notifications</h5>
                    <p>Receive summaries of job updates and new candidate leads.</p>
                  </div>
                  <div 
                    className={`toggle-switch ${emailNotif ? 'active' : ''}`}
                    onClick={() => setEmailNotif(!emailNotif)}
                  ></div>
                </div>
                <div className="notif-item">
                  <div className="ni-info">
                    <h5>Browser Push Notifications</h5>
                    <p>Real-time alerts while you are using the dashboard.</p>
                  </div>
                  <div 
                    className={`toggle-switch ${pushNotif ? 'active' : ''}`}
                    onClick={() => setPushNotif(!pushNotif)}
                  ></div>
                </div>
                <div className="notif-item">
                  <div className="ni-info">
                    <h5>Incentive/Payout Updates</h5>
                    <p>Get notified when your incentives are approved or dispatched.</p>
                  </div>
                  <div 
                    className={`toggle-switch ${payoutNotif ? 'active' : ''}`}
                    onClick={() => setPayoutNotif(!payoutNotif)}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div className="settings-footer">
            <button className="btn btn-outline">Cancel</button>
            <button 
              className={`btn ${hasSaved ? 'bg-green-lite text-green' : 'btn-primary'}`} 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>Saving...</>
              ) : hasSaved ? (
                <><CheckCircle2 size={18} /> Settings Saved!</>
              ) : (
                <><Save size={18} /> Save All Changes</>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .settings-layout { display: grid; grid-template-columns: 280px 1fr; gap: 32px; margin-top: 8px; align-items: flex-start; }
        
        .settings-sidebar { padding: 16px; border: 1px solid var(--border); box-shadow: var(--shadow-sm); height: fit-content; }
        .settings-tab-btn { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 16px; border-radius: var(--radius-md); font-size: 14px; font-weight: 600; color: var(--text-secondary); text-align: left; transition: 0.2s; margin-bottom: 4px; }
        .settings-tab-btn:last-child { margin-bottom: 0; }
        .settings-tab-btn:hover { background: #F8FAFC; color: var(--text-primary); }
        .settings-tab-btn.active { background: #EFF6FF; color: var(--accent-blue); border: 1px solid #DBEAFE; }
        .sidebar-divider { height: 1px; background: var(--border); margin: 16px 0; }
        .text-red { color: #DC2626 !important; }
        
        .settings-content { padding: 40px; border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
        .section-header-lite { margin-bottom: 32px; border-bottom: 1px solid var(--border); padding-bottom: 24px; }
        .section-header-lite h3 { font-size: 20px; font-weight: 700; color: var(--text-primary); }
        .section-header-lite p { font-size: 14px; color: var(--text-secondary); margin-top: 6px; }
        
        .profile-header-edit { display: flex; align-items: center; gap: 24px; padding: 24px; background: #F8FAFC; border: 1px solid var(--border); border-radius: 16px; margin-bottom: 40px; }
        .avatar-large-edit { width: 80px; height: 80px; border-radius: 50%; background: #E2E8F0; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; color: #475569; position: relative; border: 4px solid white; box-shadow: var(--shadow-md); }
        .edit-cam-btn { position: absolute; bottom: 0; right: 0; width: 28px; height: 28px; border-radius: 50%; background: var(--accent-blue); color: white; border: 2px solid white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; }
        .edit-cam-btn:hover { transform: scale(1.1); }
        .profile-name-box h4 { font-size: 18px; font-weight: 700; color: var(--text-primary); }
        .profile-name-box p { font-size: 14px; color: var(--text-secondary); margin-top: 2px; }
        
        /* Form Styling */
        .settings-form { max-width: 800px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-label { font-size: 13px; font-weight: 600; color: #475569; }
        .form-input { padding: 12px 16px; border: 1px solid #E2E8F0; border-radius: var(--radius-md); font-size: 14px; color: var(--text-primary); background: #FFFFFF; transition: all 0.2s; outline: none; }
        .form-input:focus { border-color: var(--accent-blue); box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        .form-input:disabled, .input-disabled { background: #F1F5F9; color: #94A3B8; cursor: not-allowed; }
        .input-hint { font-size: 12px; color: #64748B; margin-top: 4px; }
        
        .settings-footer { display: flex; justify-content: flex-end; gap: 16px; margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--border); }
        .card-lite { padding: 32px; border: 1px solid var(--border); border-radius: 16px; background: white; }
        .security-box h4 { font-size: 16px; font-weight: 700; color: var(--text-primary); border-bottom: 1px solid var(--border); padding-bottom: 16px; margin-bottom: 8px; }
        
        .password-input-group { display: flex; align-items: center; border: 1px solid #E2E8F0; border-radius: var(--radius-md); background: white; padding-right: 14px; transition: all 0.2s; }
        .password-input-group:focus-within { border-color: var(--accent-blue); box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        .border-none-input { border: none !important; box-shadow: none !important; width: 100%; flex: 1; }
        .password-input-group input { border: none; flex: 1; outline: none; }
        .pw-toggle { color: #64748B; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; border-radius: 50%; transition: 0.2s; }
        .pw-toggle:hover { background: #F1F5F9; color: var(--accent-blue); }
        
        .notif-group { display: flex; flex-direction: column; gap: 16px; }
        .g-title { font-size: 13px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .notif-item { display: flex; justify-content: space-between; align-items: center; padding: 20px; border: 1px solid var(--border); border-radius: 12px; background: white; transition: 0.2s; }
        .notif-item:hover { border-color: #CBD5E1; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        .ni-info h5 { font-size: 15px; font-weight: 600; color: var(--text-primary); }
        .ni-info p { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }
        
        /* Toggle Switch Utility */
        .toggle-switch { width: 36px; height: 20px; background: #E2E8F0; border-radius: 10px; position: relative; cursor: pointer; transition: 0.2s; }
        .toggle-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; background: white; border-radius: 50%; transition: 0.2s; shadow: var(--shadow-sm); }
        .toggle-switch.active { background: var(--accent-blue); }
        .toggle-switch.active::after { left: 18px; }

        .items-center { display: flex; align-items: center; }
        .justify-between { justify-content: space-between; }
        .mt-4 { margin-top: 16px; }
        .mt-6 { margin-top: 24px; }
        .col-span-2 { grid-column: span 2; }
        
        @media (max-width: 1024px) {
          .settings-layout { grid-template-columns: 1fr; }
          .settings-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
};

export default GeneralSettings;
