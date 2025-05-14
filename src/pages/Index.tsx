
import ChessGame from "@/components/ChessGame";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-chess-background p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Chess Game</h1>
      <ChessGame />
    </div>
  );
};

export default Index;
