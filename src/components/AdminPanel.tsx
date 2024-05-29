import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminUserList from './AdminUserList';
import AdminMarca from './AdminMarcas';
import Scraper from './Scraper';

const AdminPanel: React.FC = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        id="admin-sidebar"
        className="hs-overlay [--auto-close:lg]
        hs-overlay-open:translate-x-0
        -translate-x-full transition-all duration-300 transform
        w-[260px]
        fixed inset-y-0 start-0
        bg-white border-e border-gray-200
        lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 pt-28"
      >
        <div className="px-8 pt-4">
          <a
            className="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-none focus:opacity-80"
            href="/home"
            aria-label="Preline"
          >
            <img src="/assets/images/und.png" alt="Undressed" className="h-10" />
          </a>
        </div>
        <nav
          className="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
          data-hs-accordion-always-open=""
        >
          <ul className="space-y-1.5">
            <li>
              <Link
                className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-neutral-700 rounded-lg hover:bg-gray-100"
                to="/admin-panel/dashboard"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-neutral-700 rounded-lg hover:bg-gray-100"
                to="/admin-panel/users"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx={9} cy={7} r={4} />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Users
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-neutral-700 rounded-lg hover:bg-gray-100"
                to="/admin-panel/marcas"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx={18} cy={15} r={3} />
                  <circle cx={9} cy={7} r={4} />
                  <path d="M10 15H6a4 4 0 0 0-4 4v2" />
                  <path d="m21.7 16.4-.9-.3" />
                  <path d="m15.2 13.9-.9-.3" />
                  <path d="m16.6 18.7.3-.9" />
                  <path d="m19.1 12.2.3-.9" />
                  <path d="m19.6 18.7-.4-1" />
                  <path d="m16.8 12.3-.4-1" />
                  <path d="m14.3 16.6 1-.4" />
                  <path d="m20.7 13.8 1-.4" />
                </svg>
                Marcas
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-neutral-700 rounded-lg hover:bg-gray-100"
                to="/admin-panel/scraper"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 3a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 1 2 2v4" />
                </svg>
                Scraper
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* Content */}
      <div className="flex-1 lg:ml-[260px]">
        <div className="px-4 sm:px-6 md:px-8">
          <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUserList />} />
            <Route path="marca" element={<AdminMarca />} />
            <Route path="scraper" element={<Scraper />} />
          </Routes>
        </div>
      </div>
      {/* End Content */}
    </div>
  );
};

export default AdminPanel;
