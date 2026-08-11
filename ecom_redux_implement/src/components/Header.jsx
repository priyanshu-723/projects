import React, { useState, useEffect, useRef } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "#", active: true },
  { label: "Features", href: "#" },
  { label: "Blog", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

// Custom hook to detect clicks outside of an element
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// Custom hook to trap focus within an active element (for dialogs/drawers a11y)
function useFocusTrap(isActive, ref) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;
    const focusableSelectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const getFocusableElements = () =>
      Array.from(element.querySelectorAll(focusableSelectors));

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener("keydown", handleKeyDown);
    return () => {
      element.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, ref]);
}

// Memoized Logo Component
const Logo = React.memo(({ label = "Your Company" }) => (
  <a
    href="#"
    className="inline-block min-w-9 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-shadow"
  >
    <span className="sr-only">{label}</span>
    <img
      src="https://readymadeui.com/logo-alt.svg"
      alt={`${label} logo`}
      className="h-9 w-auto"
      loading="lazy"
    />
  </a>
));
Logo.displayName = "Logo";

// Memoized NavLink Component
const NavLink = React.memo(({ label, href, active }) => (
  <a
    href={href}
    className={`hover:text-blue-700 dark:hover:text-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors duration-150 py-1 ${
      active ? "text-blue-700 dark:text-blue-400" : ""
    }`}
    aria-current={active ? "page" : undefined}
  >
    {label}
  </a>
));
NavLink.displayName = "NavLink";

// Memoized ActionButton Component (e.g. Wishlist, Cart)
const ActionButton = React.memo(
  ({
    label,
    iconPath,
    viewBox = "0 0 64 64",
    badgeCount,
    onClick,
    href = "#",
  }) => (
    <a
      href={href}
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 text-[13px] font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors duration-150"
      aria-label={label}
    >
      <div className="relative flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="cursor-pointer fill-current inline w-5 h-5 transition-transform hover:scale-105"
          viewBox={viewBox}
          aria-hidden="true"
        >
          <path d={iconPath} />
        </svg>
        {badgeCount !== undefined && badgeCount > 0 && (
          <span className="absolute -top-1.5 -right-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white font-bold leading-none min-w-4 text-center">
            {badgeCount}
          </span>
        )}
      </div>
      <span>{label}</span>
    </a>
  ),
);
ActionButton.displayName = "ActionButton";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const lastFocusedElementRef = useRef(null);

  const openMenu = () => {
    lastFocusedElementRef.current = document.activeElement;
    setIsMenuOpen(true);
    // Focus first focusable element inside the menu after DOM updates
    setTimeout(() => {
      menuRef.current?.focus();
    }, 50);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    // Restore focus to button that opened it
    setTimeout(() => {
      lastFocusedElementRef.current?.focus();
    }, 50);
  };

  // Close menu on ESC key press
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isMenuOpen]);

  // Close menu on click outside
  useClickOutside(menuRef, () => {
    if (isMenuOpen) closeMenu();
  });

  // Keep focus within drawer menu when open
  useFocusTrap(isMenuOpen, menuRef);

  return (
    <nav
      className="flex py-3 px-4 md:px-8 bg-white border-b border-slate-200 dark:border-neutral-800 dark:bg-neutral-900 min-h-[68px] z-20 shadow-sm sticky top-0"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 w-full">
        <Logo />

        {/* Navigation items / Mobile drawer menu */}
        <div
          id="collapseMenu"
          ref={menuRef}
          tabIndex={-1}
          className={`${
            isMenuOpen
              ? "translate-x-0 opacity-100"
              : "max-lg:translate-x-full max-lg:opacity-0"
          } lg:translate-x-0 lg:opacity-100 lg:block max-lg:fixed max-lg:top-0 max-lg:right-0 max-lg:h-full max-lg:w-1/2 max-sm:w-full max-lg:bg-white dark:max-lg:bg-neutral-900 max-lg:border-l max-lg:border-slate-200 dark:max-lg:border-neutral-800 max-lg:shadow-2xl overflow-y-auto transition-all duration-300 ease-in-out z-50 outline-none`}
        >
          {/* Mobile menu header */}
          <div className="py-3 px-4 flex justify-between items-center border-b border-slate-200 dark:border-neutral-800 sticky top-0 bg-white dark:bg-neutral-900 lg:hidden min-h-[68px]">
            <Logo />
            <button
              type="button"
              aria-controls="collapseMenu"
              onClick={closeMenu}
              className="p-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <span className="sr-only">Close main menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 fill-current"
                aria-hidden="true"
                viewBox="0 0 329.269 329"
              >
                <path d="M194.8 164.77 323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164zm0 0" />
              </svg>
            </button>
          </div>

          <ul className="flex flex-col gap-6 lg:gap-8 font-semibold text-sm text-slate-800 dark:text-slate-200 lg:flex-row max-lg:p-6 lg:ml-12">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <NavLink {...item} />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-5 pr-2">
            {/* Wishlist Button */}
            <ActionButton
              label="Wishlist"
              badgeCount={2}
              viewBox="0 0 64 64"
              iconPath="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
            />

            {/* Cart Button */}
            <ActionButton
              label="Cart"
              badgeCount={3}
              viewBox="0 0 489 489"
              iconPath="m440.1 422.7-28-315.3c-.6-7-6.5-12.3-13.4-12.3h-57.6C340.3 42.5 297.3 0 244.5 0s-95.8 42.5-96.6 95.1H90.3c-7 0-12.8 5.3-13.4 12.3l-28 315.3c0 .4-.1.8-.1 1.2 0 35.9 32.9 65.1 73.4 65.1h244.6c40.5 0 73.4-29.2 73.4-65.1 0-.4 0-.8-.1-1.2zM244.5 27c37.9 0 68.8 30.4 69.6 68.1H174.9c.8-37.7 31.7-68.1 69.6-68.1zm122.3 435H122.2c-25.4 0-46-16.8-46.4-37.5l26.8-302.3h45.2v41c0 7.5 6 13.5 13.5 13.5s13.5-6 13.5-13.5v-41h139.3v41c0 7.5 6 13.5 13.5 13.5s13.5-6 13.5-13.5v-41h45.2l26.9 302.3c-.4 20.7-21.1 37.5-46.4 37.5z"
            />
          </div>

          <a
            href="#"
            className="hidden sm:inline-block py-2 px-4 text-sm rounded-md font-semibold cursor-pointer text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Sign up
          </a>

          {/* Toggle Menu Button (Mobile) */}
          <button
            type="button"
            aria-controls="collapseMenu"
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
            onClick={isMenuOpen ? closeMenu : openMenu}
            className="p-1 cursor-pointer lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded text-slate-700 dark:text-slate-200"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-7 h-7 fill-current"
              aria-hidden="true"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
