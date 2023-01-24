import { forwardRef, KeyboardEventHandler } from "react";

interface TextAreaProps {
  onCommit: (value: string) => void;
}

export default forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { onCommit },
  ref
) {
  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && e.metaKey) {
      onCommit((e.target as HTMLInputElement).value);
    }
  };
  return (
    <>
      <textarea
        ref={ref}
        rows={5}
        placeholder="Enter your prompt and press ⌘ ⏎ to create images✍️"
        className="textarea textarea-bordered w-full"
        onKeyDown={onKeyDown}
      />
      <label className="label">
        <span className="label-text-alt" />
        <span className="label-text-alt">
          {"Press "}
          <kbd className="kbd">⌘</kbd> <kbd className="kbd">⏎</kbd>
          {" to create images."}
        </span>
      </label>
    </>
  );
});
