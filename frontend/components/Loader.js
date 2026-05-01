import { Loader2 } from "lucide-react";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <p className="text-gray-500 font-medium">{text}</p>
    </div>
  );
}
