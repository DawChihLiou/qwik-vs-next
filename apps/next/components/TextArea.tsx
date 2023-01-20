import { ChangeEventHandler, useState } from "react";

type NaiveTextAreaProps = {
  value: string;
  onChange: (value: string) => void;
  onCommit: (value: string) => void;
};

function NaiveTextArea({ value, onChange, onCommit }: NaiveTextAreaProps) {
  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    onChange(e.target.value);
  };
  return (
    <textarea
      rows={5}
      value={value}
      placeholder="Enter your prompt and press ⌘ ⏎ to create images✍️"
      className="mx-auto mt-1 block w-full px-3 py-2 rounded-md shadow-lg bg-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.metaKey) {
          onCommit((e.target as HTMLTextAreaElement).value);
        }
      }}
      onChange={handleChange}
    />
  );
}

type TextAreaProps = {
  defaultValue: string;
  onChange: (value: string) => void;
  onCommit: () => void;
};

export default function TextArea({
  defaultValue,
  onChange,
  onCommit,
}: TextAreaProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (value: string) => {
    setValue(value);
    onChange(value);
  };
  return (
    <NaiveTextArea value={value} onChange={handleChange} onCommit={onCommit} />
  );
}
