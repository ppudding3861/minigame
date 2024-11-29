// src/user_pages/Minigame.tsx

import React from 'react';
import "./App.css";
import ImageUpload from "./components/ImageUpload";
import GamePlay from "./components/GamePlay";
import { usePuzzleGame } from "./hooks/usePuzzleGame";

const App: React.FC = () => {
  const {
    image,
    pieces,
    preview,
    isGameStarted,
    board,
    handleImageUpload,
    startGame,
    setPieces,
    setBoard,
    checkCompletion,
  } = usePuzzleGame();

  return (
    <div 
      className="w-[90vw] max-w-[900px] mx-auto p-[1vw] min-w-[320px] h-[95vh] flex flex-col" 
      role="main" 
      aria-label="퍼즐 게임 컨테이너"
    >
      <h1 className="text-center text-[#333] mb-[1vw] text-[calc(1.2rem+0.5vw)]">
        {isGameStarted ? "퍼즐 게임 시작!" : "이미지 업로드"}
      </h1>
      {!isGameStarted ? (
        <ImageUpload
          onImageUpload={handleImageUpload}
          preview={preview}
          onStartGame={startGame}
          disabled={!image}
        />
      ) : (
        <GamePlay
          pieces={pieces}
          preview={preview}
          board={board}
          setPieces={setPieces}
          setBoard={setBoard}
          checkCompletion={checkCompletion}
        />
      )}
    </div>
  );
};

export default App;