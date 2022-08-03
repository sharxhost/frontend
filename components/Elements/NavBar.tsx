import Image from "next/image";
import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import UserPill from "./UserPill";

function NavBar(): JSX.Element {
  return (
    <nav className='w-screen grid grid-flow-col bg-gray-500 mb-4 px-3 py-1'>
      <div className="flex items-center">
        <div className="mx-1">
          <Image
            src="/favicon.svg"
            alt="Logo"
            width={45}
            height={45}
          />
        </div>

        <hr className="vertical-spacer" />

        <LinkNavBarItem href="/" text="Home" />
        <LinkNavBarItem href="/dashboard" text="Dashboard" />
      </div>

      <div className="flex justify-self-end items-center">
        <hr className="vertical-spacer" />
        <UserPill decorations={false} goToDashboard={false} />
      </div>
    </nav>
  );
}

type ContainerNavBarItemProps = {
  children: ReactNode;
}

function ContainerNavBarItem({ children }: ContainerNavBarItemProps) {
  return (
    <div className="navbar-item">
      {children}
    </div>
  )
}

type CallbackNavBarItemProps = {
  cb: MouseEventHandler<HTMLButtonElement>;
  text: string;
}

function CallbackNavBarItem({ cb, text }: CallbackNavBarItemProps) {
  return (
    <button type="button" className="navbar-item cursor-pointer" onClick={cb}>
      {text}
    </button>
  )
}

type LinkNavBarItemProps = {
  href: string;
  text: string;
}

function LinkNavBarItem({ href, text }: LinkNavBarItemProps) {
  return (
    <Link href={href}>
      <a className="navbar-item">
        {text}
      </a>
    </Link>
  )
}

export default NavBar
