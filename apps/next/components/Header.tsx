import { NextLogo } from "./icons/next";

export default function Header() {
  return (
    <header className="navbar bg-base-100 py-8 px-0">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost normal-case text-xl">
          <NextLogo />
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a
              href="https://github.com/DawChihLiou/qwik-vs-next"
              target="_blank"
              rel="noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/github.svg" alt="Link to repository" className="w-8" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
