import { prompts } from "~/constants/prompts";

interface PromptListProps {
  onClick: (value: string) => void;
}

export default function PromptList({ onClick }: PromptListProps) {
  return (
    <>
      {prompts.map((prompt) => (
        <button
          key={prompt.url + prompt.views}
          className="flex gap-2 w-full block text-left rounded pl-2 pr-4 py-2 hover:text-slate-700 hover:bg-gradient-to-r from-cyan-500 to-blue-500 hover:drop-shadow-xl"
          onClick={() => onClick(prompt.text)}
        >
          <span role="img" aria-label="Fire">
            {prompt.views > 499 && "🔥"}
            {prompt.views < 500 && "✨"}
          </span>
          <span>{prompt.text}</span>
        </button>
      ))}
    </>
  );
}
