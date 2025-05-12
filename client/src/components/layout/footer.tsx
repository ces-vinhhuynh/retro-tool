'use client';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="max-w-screen-3xl container mx-auto flex w-full items-center justify-between px-4 py-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Retro Tool. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
