// src/components/mini_components/ImageUpload.tsx
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
    <div className="max-w-[500px] mx-auto bg-white p-[2vw] rounded-lg shadow-md">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full mb-[1.5vw]"
      />
      {preview && (
        <img 
          src={preview} 
          alt="Preview" 
          className="w-full h-auto mb-[1.5vw] rounded"
        />
      )}
      <button
        onClick={onStartGame}
        disabled={disabled}
        className="w-full p-[1vw] bg-green-500 text-white border-none rounded cursor-pointer text-[calc(0.8rem+0.5vw)] hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        게임 시작
      </button>
    </div>
  );
};

export default ImageUpload;