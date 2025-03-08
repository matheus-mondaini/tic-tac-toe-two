"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

const TicTacToeTwoGame = () => {
  const [boardSize, setBoardSize] = useState(15);
  const [gameMode, setGameMode] = useState("twoPlayers"); 
  const [showConfig, setShowConfig] = useState(true);

  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [gameStatus, setGameStatus] = useState(""); 

  useEffect(() => {
    if (!showConfig) {
      initializeBoard();
    }
  }, [showConfig, boardSize]);

  useEffect(() => {
    if (gameMode === "robot" && currentPlayer === "O" && !winner && !showConfig) {
      const timer = setTimeout(() => {
        makeRobotMove();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, winner, gameMode, showConfig]);

  const initializeBoard = () => {
    const newBoard = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
    setBoard(newBoard);
    setCurrentPlayer("X");
    setWinner(null);
    setWinningCells([]);
    setGameStatus("Jogador X começa");
  };

  const startGame = () => {
    setShowConfig(false);
  };

  const handleCellClick = (row, col) => {
    if (winner || board[row][col] || (gameMode === "robot" && currentPlayer === "O")) {
      return;
    }

    const newBoard = [...board];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard, row, col, currentPlayer);
    if (result.winner) {
      setWinner(currentPlayer);
      setWinningCells(result.winningCells);
      setGameStatus(`Jogador ${currentPlayer} venceu!`);
      setShowWinDialog(true);
      return;
    }

    if (isBoardFull(newBoard)) {
      setWinner("empate");
      setGameStatus("Empate!");
      setShowWinDialog(true);
      return;
    }

    const nextPlayer = currentPlayer === "X" ? "O" : "X";
    setCurrentPlayer(nextPlayer);
    setGameStatus(`Vez do jogador ${nextPlayer}`);
  };

  const makeRobotMove = () => {
    if (winner) return;

    const move = findBestMove();
    if (move) {
      handleCellClick(move.row, move.col);
    }
  };

  const findBestMove = () => {
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (!board[row][col]) {
          const newBoard = JSON.parse(JSON.stringify(board));
          newBoard[row][col] = "O";
          const result = checkWinner(newBoard, row, col, "O");
          if (result.winner) {
            return { row, col };
          }
        }
      }
    }

    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (!board[row][col]) {
          const newBoard = JSON.parse(JSON.stringify(board));
          newBoard[row][col] = "X";
          const result = checkWinner(newBoard, row, col, "X");
          if (result.winner) {
            return { row, col };
          }
        }
      }
    }

    const possibleMoves = [];
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (!board[row][col]) {
          let hasAdjacentMove = false;
          for (let r = Math.max(0, row - 1); r <= Math.min(boardSize - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(boardSize - 1, col + 1); c++) {
              if (board[r][c]) {
                hasAdjacentMove = true;
                break;
              }
            }
            if (hasAdjacentMove) break;
          }
          
          if (hasAdjacentMove) {
            possibleMoves.push({ row, col });
          }
        }
      }
    }

    if (possibleMoves.length > 0) {
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
      return possibleMoves[randomIndex];
    }

    const emptyPositions = [];
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (!board[row][col]) {
          emptyPositions.push({ row, col });
        }
      }
    }

    if (emptyPositions.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyPositions.length);
      return emptyPositions[randomIndex];
    }

    return null;
  };

  const checkWinner = (board, row, col, player) => {
    const winLength = 3; 
    const directions = [
      [0, 1], 
      [1, 0], 
      [1, 1], 
      [1, -1] 
    ];

    for (const [dr, dc] of directions) {
      const winningCells = [];
      winningCells.push([row, col]);

      let count = 1;
      let r = row + dr;
      let c = col + dc;
      while (
        r >= 0 && r < boardSize && 
        c >= 0 && c < boardSize && 
        board[r][c] === player &&
        count < winLength
      ) {
        winningCells.push([r, c]);
        count++;
        r += dr;
        c += dc;
      }

      r = row - dr;
      c = col - dc;
      while (
        r >= 0 && r < boardSize && 
        c >= 0 && c < boardSize && 
        board[r][c] === player &&
        count < winLength
      ) {
        winningCells.push([r, c]);
        count++;
        r -= dr;
        c -= dc;
      }

      if (count >= winLength) {
        return { winner: true, winningCells };
      }
    }

    return { winner: false, winningCells: [] };
  };

  const isBoardFull = (board) => {
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (!board[row][col]) {
          return false;
        }
      }
    }
    return true;
  };

  const resetGame = () => {
    setShowWinDialog(false);
    setShowConfig(true);
  };

  const continueGame = () => {
    setShowWinDialog(false);
    initializeBoard();
  };

  const renderCell = (row, col) => {
    const cellValue = board[row][col];
    const isWinningCell = winningCells.some(
      ([winRow, winCol]) => winRow === row && winCol === col
    );

    return (
      <div
        key={`${row}-${col}`}
        className={`
          w-8 h-8 border border-gray-300 flex items-center justify-center cursor-pointer
          ${cellValue ? 'cursor-not-allowed' : 'hover:bg-gray-100'}
          ${isWinningCell ? 'bg-green-200' : ''}
        `}
        onClick={() => handleCellClick(row, col)}
      >
        {cellValue === "X" && <span className="text-blue-600 font-bold">X</span>}
        {cellValue === "O" && <span className="text-red-600 font-bold">O</span>}
      </div>
    );
  };

  if (showConfig) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-center">Configurar Jogo da Velha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="board-size">Tamanho do Tabuleiro: {boardSize}x{boardSize}</Label>
            <Slider
              id="board-size"
              min={3}
              max={20}
              step={1}
              value={[boardSize]}
              onValueChange={(value) => setBoardSize(value[0])}
              className="my-4"
            />
          </div>

          <div className="space-y-2">
            <Label>Modo de Jogo</Label>
            <RadioGroup value={gameMode} onValueChange={setGameMode} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="twoPlayers" id="twoPlayers" />
                <Label htmlFor="twoPlayers">Dois Jogadores</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="robot" id="robot" />
                <Label htmlFor="robot">Contra o Robô</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={startGame} className="w-full">Iniciar Jogo</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="container mx-auto my-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Jogo da Velha {boardSize}x{boardSize}
          </CardTitle>
          <div className="text-center font-medium">
            {gameStatus}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div 
              className="grid gap-px bg-gray-300 p-px max-w-full overflow-auto" 
              style={{ 
                gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
              }}
            >
              {board.map((row, rowIndex) =>
                row.map((_, colIndex) => renderCell(rowIndex, colIndex))
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={resetGame} variant="outline" className="mr-2">
            Nova Partida
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showWinDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {winner === "empate" 
                ? "Empate!" 
                : `Jogador ${winner} venceu!`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {winner === "empate" 
                ? "O jogo terminou em empate."
                : `Parabéns ao jogador ${winner} pela vitória!`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={continueGame} className="mr-2">
              Jogar Novamente
            </AlertDialogAction>
            <AlertDialogAction onClick={resetGame}>
              Nova Configuração
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TicTacToeTwoGame;