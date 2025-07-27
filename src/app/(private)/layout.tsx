"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <Link href="/">RAID</Link>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="tabs tabs-border gap-4 border-b" role="tablist">
          <Link
            role="tab"
            href="/home"
            className={clsx("tab", {
              "tab-active": pathname === "/home",
            })}
          >
            Overview
          </Link>

          <Link
            role="tab"
            href="/cases"
            className={clsx("tab", {
              "tab-active": pathname.startsWith("/cases"),
            })}
          >
            Cases
          </Link>

          <Link role="tab" href="/" className="tab">
            AI Agents
          </Link>

          <Link role="tab" href="/" className="tab">
            Protections
          </Link>

          <Link role="tab" href="/" className="tab">
            Legal Partners
          </Link>
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
