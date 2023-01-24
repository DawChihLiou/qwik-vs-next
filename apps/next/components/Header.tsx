import Link from "next/link";
import { NextLogo } from "./icons/next";

export default function Header() {
  return (
    <header className="navbar bg-base-100 py-8 px-0">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          <NextLogo />
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link
              href="https://github.com/DawChihLiou/qwik-vs-next"
              target="_blank"
              rel="noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/github.svg" alt="Link to repository" className="w-8" />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
