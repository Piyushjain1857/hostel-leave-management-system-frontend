import { useState, useEffect } from 'react';
import { Camera, Save, X, User, BookOpen, Home, Shield, Image as ImageIcon, Crop } from 'lucide-react';
import ImageCropper from '../components/ImageCropper';
import { convertHeicToJpeg } from '../utils/heicConverter';

export default function AdvancedEditProfile() {
  const [profile, setProfile] = useState({
    name: '', email: '', phone: '', address: '', 
    course: '', year: '', hostelRoom: '', 
    parentContact: '', emergencyContact: '',
    profileImage: '', coverImage: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Cropper State
  const [cropModal, setCropModal] = useState({
    isOpen: false,
    imageSrc: null,
    field: null, // 'profileImage' or 'coverImage'
    aspect: 1
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('studentToken');
      setLoading(true);
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + '/api/advanced-profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setProfile(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e, field) => {
    let file = e.target.files[0];
    if (file) {
      file = await convertHeicToJpeg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropModal({
          isOpen: true,
          imageSrc: reader.result,
          field,
          aspect: field === 'profileImage' ? 1 : 16 / 9
        });
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // reset file input
    }
  };

  const openCropForExisting = (field) => {
    if (profile[field]) {
      setCropModal({
        isOpen: true,
        imageSrc: profile[field],
        field,
        aspect: field === 'profileImage' ? 1 : 16 / 9
      });
    }
  };

  const handleCropDone = (croppedImageBase64) => {
    setProfile(prev => ({ ...prev, [cropModal.field]: croppedImageBase64 }));
    setCropModal({ isOpen: false, imageSrc: null, field: null, aspect: 1 });
  };

  const handleCropCancel = () => {
    setCropModal({ isOpen: false, imageSrc: null, field: null, aspect: 1 });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const token = localStorage.getItem('studentToken');
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/advanced-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error.' });
    }
    setSaving(false);
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading profile...</div>;

  return (
    <div className="advanced-container animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      
      {/* Cover Photo */}
      <div style={{ position: 'relative', height: '220px', borderRadius: '16px 16px 0 0', background: profile.coverImage ? `url(${profile.coverImage}) center/cover` : 'linear-gradient(135deg, #cbd5e1, #94a3b8)', marginBottom: '5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'all 0.3s ease', overflow: 'hidden' }}>
        <div className="cover-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', transition: 'background 0.3s ease' }}></div>
        
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.75rem', zIndex: 10 }}>
          {profile.coverImage && (
            <button className="edit-cover-btn" onClick={() => openCropForExisting('coverImage')} style={{ background: 'rgba(255,255,255,0.9)', color: '#334155', padding: '0.6rem 1.2rem', borderRadius: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'transform 0.2s, background 0.2s', border: 'none' }} title="Crop Cover Photo">
              <Crop size={16} /> Crop
            </button>
          )}
          <label className="edit-cover-btn" style={{ background: 'rgba(255,255,255,0.9)', color: '#334155', padding: '0.6rem 1.2rem', borderRadius: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'transform 0.2s, background 0.2s' }}>
            <ImageIcon size={16} /> Update Cover
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'coverImage')} style={{ display: 'none' }} />
          </label>
        </div>
        
        {/* Profile Photo */}
        <div className="profile-avatar-container" style={{ position: 'absolute', bottom: '-4.5rem', left: '2.5rem', width: '140px', height: '140px', borderRadius: '50%', border: '5px solid #fff', background: profile.profileImage ? `url(${profile.profileImage}) center/cover` : '#e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)', zIndex: 20, overflow: 'hidden' }}>
          <div className="profile-avatar-overlay">
            <label className="avatar-action-btn" title="Upload New Photo">
              <Camera size={20} />
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'profileImage')} style={{ display: 'none' }} />
            </label>
            {profile.profileImage && (
              <button type="button" className="avatar-action-btn" title="Crop Current Photo" onClick={() => openCropForExisting('profileImage')}>
                <Crop size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', color: '#1e293b' }}>{profile.name || 'Your Name'}</h1>
            <p style={{ margin: 0, color: '#64748b' }}>Student Profile Management</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary" onClick={() => window.history.back()}><X size={18} /> Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}</button>
          </div>
        </div>

        {message && (
          <div className={`toast-alert ${message.type === 'success' ? 'toast-success' : 'toast-error'}`} style={{ marginBottom: '2rem' }}>
            {message.text}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          
          {/* Personal Info */}
          <section className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}><User size={18} /> Personal Information</h3>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" name="name" value={profile.name} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Email</label>
              <input type="email" className="form-input" name="email" value={profile.email} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Phone</label>
              <input type="text" className="form-input" name="phone" value={profile.phone} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Address</label>
              <textarea className="form-input" name="address" value={profile.address || ''} onChange={handleChange} rows="2"></textarea>
            </div>
          </section>

          {/* Academic & Hostel Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <section className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}><BookOpen size={18} /> Academic Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Course</label>
                  <input type="text" className="form-input" name="course" value={profile.course} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input type="text" className="form-input" name="year" value={profile.year} onChange={handleChange} />
                </div>
              </div>
            </section>

            <section className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}><Home size={18} /> Hostel Information</h3>
              <div className="form-group">
                <label className="form-label">Hostel & Room</label>
                <input type="text" className="form-input" name="hostelRoom" value={profile.hostelRoom} onChange={handleChange} />
              </div>
            </section>

            <section className="card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}><Shield size={18} /> Emergency Contacts</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Parent Contact</label>
                  <input type="text" className="form-input" name="parentContact" value={profile.parentContact || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Emergency Number</label>
                  <input type="text" className="form-input" name="emergencyContact" value={profile.emergencyContact || ''} onChange={handleChange} />
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>

      {cropModal.isOpen && cropModal.imageSrc && (
        <ImageCropper
          imageSrc={cropModal.imageSrc}
          aspect={cropModal.aspect}
          onCropDone={handleCropDone}
          onCropCancel={handleCropCancel}
        />
      )}

      <style>{`
        .edit-cover-btn:hover { transform: scale(1.05); background: #fff !important; }
        
        .profile-avatar-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
          backdrop-filter: blur(2px);
        }
        
        .profile-avatar-container:hover .profile-avatar-overlay {
          opacity: 1;
        }

        .avatar-action-btn {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          color: #334155;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: transform 0.2s, background 0.2s, color 0.2s;
        }

        .avatar-action-btn:hover {
          transform: scale(1.1);
          background: #3b82f6;
          color: white;
        }
      `}</style>
    </div>
  );
}
