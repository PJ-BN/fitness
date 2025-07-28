
import React, { useState } from 'react';
import useUserProfile from '../hooks/useUserProfile';
import type { UserProfileUpdate, ChangePasswordRequest } from '../types/user';
import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {
  const { user, loading, error, updateUserProfile, changePassword } = useUserProfile();
  
  // State for profile update form
  const [profileUpdateData, setProfileUpdateData] = useState<UserProfileUpdate>({
    name: '',
    phoneNumber: ''
  });
  
  // State for password change form
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    oldPassword: '',
    newPassword: ''
  });
  
  // Form submission states
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState<boolean>(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<boolean>(false);
  const [profileUpdateError, setProfileUpdateError] = useState<string | null>(null);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  // Initialize form with user data when it loads
  React.useEffect(() => {
    if (user) {
      setProfileUpdateData({
        name: user.name,
        phoneNumber: user.phoneNumber
      });
    }
  }, [user]);

  const handleProfileUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileUpdateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileUpdateSuccess(false);
    setProfileUpdateError(null);
    
    const success = await updateUserProfile(profileUpdateData);
    if (success) {
      setProfileUpdateSuccess(true);
      setTimeout(() => setProfileUpdateSuccess(false), 3000);
    } else {
      setProfileUpdateError('Failed to update profile. Please try again.');
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeSuccess(false);
    setPasswordChangeError(null);
    
    const success = await changePassword(passwordData);
    if (success) {
      setPasswordChangeSuccess(true);
      setPasswordData({
        oldPassword: '',
        newPassword: ''
      });
      setTimeout(() => setPasswordChangeSuccess(false), 3000);
    } else {
      setPasswordChangeError('Failed to change password. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className={styles['profile-container']}>
        <div className={styles['loading-container']}>
          <div className={styles.spinner}></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['profile-container']}>
        <div className={styles['error-container']}>
          <div className={styles['error-icon']}>⚠️</div>
          <h2 className={styles['error-title']}>Error</h2>
          <p className={styles['error-text']}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className={`${styles.btn} ${styles['btn-primary']}`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['profile-container']}>
      <div className={styles['profile-content']}>
        <div className={styles['profile-header']}>
          <h1 className={styles['profile-title']}>Your Profile</h1>
          <p className={styles['profile-subtitle']}>Manage your account settings and preferences</p>
        </div>

        {user && (
          <div className={styles['profile-grid']}>
            {/* Profile Card */}
            <div className={styles['profile-card']}>
              <div className={styles['profile-card-header']}>
                <div className={styles['profile-avatar']}>👤</div>
                <h2 className={styles['profile-name']}>{user.name}</h2>
                <p className={styles['profile-email']}>{user.email}</p>
              </div>
              <div className={styles['profile-details']}>
                <div className={styles['detail-item']}>
                  <h3 className={styles['detail-label']}>Username</h3>
                  <p className={styles['detail-value']}>{user.userName}</p>
                </div>
                <div className={styles['detail-item']}>
                  <h3 className={styles['detail-label']}>Phone Number</h3>
                  <p className={styles['detail-value']}>{user.phoneNumber}</p>
                </div>
                <div className={styles['detail-item']}>
                  <h3 className={styles['detail-label']}>Member Since</h3>
                  <p className={styles['detail-value']}>Joined recently</p>
                </div>
              </div>
            </div>

            {/* Update Forms */}
            <div>
              {/* Update Profile Card */}
              <div className={styles['form-card']}>
                <div className={styles['form-header']}>
                  <h2 className={styles['form-title']}>Update Profile</h2>
                </div>
                <div className={styles['form-body']}>
                  <form onSubmit={handleProfileUpdateSubmit}>
                    <div className={styles['form-group']}>
                      <label htmlFor="name" className={styles['form-label']}>Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileUpdateData.name}
                        onChange={handleProfileUpdateChange}
                        className={styles['form-control']}
                        required
                      />
                    </div>
                    <div className={styles['form-group']}>
                      <label htmlFor="phoneNumber" className={styles['form-label']}>Phone Number</label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={profileUpdateData.phoneNumber}
                        onChange={handleProfileUpdateChange}
                        className={styles['form-control']}
                        required
                      />
                    </div>
                    <div className={styles['form-footer']}>
                      <button
                        type="submit"
                        className={`${styles.btn} ${styles['btn-primary']}`}
                      >
                        Save Changes
                      </button>
                      {profileUpdateSuccess && (
                        <div className={styles['success-message']}>
                          <span className={styles['success-icon']}>✓</span>
                          <span>Updated successfully!</span>
                        </div>
                      )}
                    </div>
                    {profileUpdateError && (
                      <div className={styles['error-message']}>{profileUpdateError}</div>
                    )}
                  </form>
                </div>
              </div>

              {/* Change Password Card */}
              <div className={styles['form-card']}>
                <div className={styles['form-header']}>
                  <h2 className={styles['form-title']}>Change Password</h2>
                </div>
                <div className={styles['form-body']}>
                  <form onSubmit={handlePasswordChangeSubmit}>
                    <div className={styles['form-group']}>
                      <label htmlFor="oldPassword" className={styles['form-label']}>Current Password</label>
                      <input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        className={styles['form-control']}
                        required
                      />
                    </div>
                    <div className={styles['form-group']}>
                      <label htmlFor="newPassword" className={styles['form-label']}>New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={styles['form-control']}
                        required
                      />
                    </div>
                    <div className={styles['form-footer']}>
                      <button
                        type="submit"
                        className={`${styles.btn} ${styles['btn-primary']}`}
                      >
                        Change Password
                      </button>
                      {passwordChangeSuccess && (
                        <div className={styles['success-message']}>
                          <span className={styles['success-icon']}>✓</span>
                          <span>Password changed!</span>
                        </div>
                      )}
                    </div>
                    {passwordChangeError && (
                      <div className={styles['error-message']}>{passwordChangeError}</div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
