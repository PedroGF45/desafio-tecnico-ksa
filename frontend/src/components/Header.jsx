import React from 'react';

export default function Header() {
  return (
    <header className="bg-slate-900 text-white px-6 py-3.5 flex justify-between items-center shadow-md border-b border-slate-800">

      <div className="flex items-center gap-3">
        <a 
          href="https://kilter.pt" 
          target="_blank" 
          rel="noopener noreferrer"
          className="transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-0.5"
        >
          <img
            src="/logo.jpg"
            alt="Kilter Logo"
            className="h-9 w-auto object-contain rounded drop-shadow"
          />
        </a>
      </div>

      <div className="flex-1 text-center px-4">
        <h1 className="text-lg md:text-xl font-semibold tracking-tight text-slate-100">
          Sistema Interno de Registo e Acompanhamento de Pedidos
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-300 hidden sm:inline-block">
          Pedro Brito
        </span>
        <a 
          href="https://www.linkedin.com/in/pedro-brito-272b2a192/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative group transition-transform duration-200 hover:scale-105 focus:outline-none"
        >
          <img
            src="/foto.jpg"
            alt="Pedro Brito"
            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/80 shadow-md transition-all group-hover:border-indigo-400 group-hover:shadow-indigo-500/20"
          />
        </a>
      </div>

    </header>
  );
}