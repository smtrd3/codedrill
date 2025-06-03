import "@radix-ui/themes/styles.css";
import { StatsContent } from "./StatsContent";
import { IconKeyboard } from "./icons";
import { Button } from "@radix-ui/themes";

function App() {
  return (
    <div className="flex justify-center items-center flex-col mb-4">
      {IconKeyboard}
      <h1 className="text-2xl">Rev-DSA</h1>
      <Button onClick={undefined}>Start test</Button>
      <p className="italic text-white text-opacity-50">
        Recharge Your DSA Knowledge, One Template at a Time
      </p>
      <div className="mt-8 w-[800px] border border-solid border-gray-600 p-4 rounded">
        <StatsContent />
      </div>
    </div>
  );
}

export default App;
