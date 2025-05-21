import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: sessionData } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    void signOut();
    router.push("/login");
  };

  return (
    <nav className="flex w-full items-center justify-between bg-gray-900 px-4 py-3 text-white shadow-lg">
      <div className="flex items-center space-x-3">
        <Link href={"/"}>
          <Image
            src="/images/easySLR_logo.svg"
            alt="Logo"
            width={100}
            height={100}
            color="#fff"
          />
        </Link>
        <span className="text-xl font-bold tracking-wide">
          Project Management
        </span>
      </div>

      <div className="relative" ref={dropdownRef}>
        {sessionData && (
          <button
            type="button"
            className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
            id="user-menu-button"
            aria-expanded="false"
            aria-haspopup="true"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="absolute -inset-1.5"></span>

            <img
              className="size-8 rounded-full"
              src={
                sessionData.user.image
                  ? sessionData.user.image
                  : "/images/profile_icon.svg"
              }
              alt="profile"
            />
          </button>
        )}

        {dropdownOpen && (
          <div className="animate-fade-in absolute right-0 z-50 mt-2 w-40 rounded-md border border-gray-700 bg-gray-800 shadow-md">
            <div className="border-b border-gray-700 px-4 py-3 text-sm text-white">
              Signed in as
              <div className="truncate font-semibold">
                {sessionData?.user?.name}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="block w-full px-4 py-2 text-left text-sm text-white transition hover:bg-gray-700"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
