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
    <div className="game-container" role="main" aria-label="퍼즐 게임 컨테이너">
      <h1>{isGameStarted ? "퍼즐 게임 시작!" : "이미지 업로드"}</h1>
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
          setBoard={setBoard} // 그대로 전달
          checkCompletion={checkCompletion}
        />
      )}
    </div>
  );
};

export default App;
