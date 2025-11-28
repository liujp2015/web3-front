'use client'

import { useState } from "react";
import Link from "next/link";
import { ConnectButton } from './ConnectButton'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Mint', href: '/mint' },
    { name: 'Swap', href: '/swap' },
    { name: 'Pool', href: '/pool' },
    { name: 'Farms', href: '/farm' },
    { name: 'LaunchPad', href: '/launchpad' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Bridge', href: '/bridge' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div>
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl lg:text-2xl text-blue-600 font-bold">
              Web3 DAPP AI
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center gap-6 flex-1 mx-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium px-2 py-1 rounded-md hover:bg-gray-50"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Connect Button */}
          <div className="hidden lg:block">
            <ConnectButton />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Connect Button - smaller version */}
            <div className="mr-2">
              <ConnectButton />
            </div>
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                /* Close icon */
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out relative z-50 ${
            isMobileMenuOpen
              ? 'max-h-96 opacity-100 visible'
              : 'max-h-0 opacity-0 invisible overflow-hidden'
          }`}
        >
          <div className="pb-4 pt-2 space-y-1 bg-white/80 backdrop-blur-md border-t border-gray-200/50 shadow-lg">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-white/60 transition-colors font-medium rounded-md mx-2"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200"></div>

      {/* Mobile menu overlay - for closing menu when clicking outside */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/10"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </div>
  );
}