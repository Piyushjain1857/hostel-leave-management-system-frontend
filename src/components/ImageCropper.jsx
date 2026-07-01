import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { X, Check } from 'lucide-react';

export default function ImageCropper({ imageSrc, onCropDone, onCropCancel, aspect = 1 }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      onCropDone(croppedImage);
    } catch (e) {
      console.error(e);
      onCropCancel();
    }
  };

  return (
    <div className="cropper-modal-overlay" style={overlayStyle}>
      <div className="cropper-modal" style={modalStyle}>
        <div className="cropper-header" style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>Crop Image</h3>
          <button onClick={onCropCancel} style={closeBtnStyle}><X size={20} /></button>
        </div>

        <div className="cropper-container" style={containerStyle}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="cropper-controls" style={controlsStyle}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              style={{ flex: 1, accentColor: '#3b82f6' }}
            />
          </div>
          <button onClick={handleDone} className="btn-primary" style={{ padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Check size={16} /> Confirm Crop
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.75)',
  backdropFilter: 'blur(4px)',
  zIndex: 9999,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalStyle = {
  backgroundColor: '#fff',
  borderRadius: '16px',
  width: '90%',
  maxWidth: '600px',
  height: '80vh',
  maxHeight: '600px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  overflow: 'hidden'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.2rem 1.5rem',
  borderBottom: '1px solid #e2e8f0',
};

const closeBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: '#64748b',
  cursor: 'pointer',
  padding: '0.4rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s',
};

const containerStyle = {
  position: 'relative',
  flex: 1,
  backgroundColor: '#f8fafc',
};

const controlsStyle = {
  padding: '1.2rem 1.5rem',
  borderTop: '1px solid #e2e8f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2rem',
};
