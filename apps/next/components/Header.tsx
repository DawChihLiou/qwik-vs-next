import { NextLogo } from "./icons/next";

export default function Header() {
  return (
    <header className="container mx-auto px-4 py-8">
      <div className="flex gap-2">
        <a href="/" title="demo">
          <NextLogo />
        </a>
      </div>
      <ul></ul>
    </header>
  );
}
