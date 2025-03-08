import TicTacToeTwoGame from '../components/TicTacToeTwoGame';

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-center text-3xl font-bold mb-6">Jogo da Velha Personalizado</h1>
      <TicTacToeTwoGame />
    </main>
  );
}