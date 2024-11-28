import React from 'react';
import "./App.css";
import ImageUpload from "../src/components/ImageUpload";
import GamePlay from "../src/components/GamePlay";
import { usePuzzleGame } from "../src/hooks/usePuzzleGame";

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
    <div className="game-container">
      <h1>퍼즐 게임</h1>
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
