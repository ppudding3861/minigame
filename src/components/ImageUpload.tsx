// src/components/ImageUpload.tsx
import React from 'react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  preview: string;
  onStartGame: () => void;
  disabled: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  preview,
  onStartGame,
  disabled
}) => {
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="upload-section">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="file-input"
      />
      {preview && (
        <img src={preview} alt="Preview" className="preview-image" />
      )}
      <button
        onClick={onStartGame}
        disabled={disabled}
        className="start-button"
      >
        게임 시작
      </button>
    </div>
  );
};

export default ImageUpload;