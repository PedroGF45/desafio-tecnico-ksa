import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TicketModal from './components/TicketModal';
import { fetchTickets, createTicket, updateTicketStatus } from './services/api';

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: [],
    category: [],
    priority: [],
    location: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  const loadData = async () => {
    try {
      const data = await fetchTickets();
      setTickets(data);
      if (data.length > 0 && !selectedTicket) setSelectedTicket(data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTicket = async (newTicket) => {
    try {
      const created = await createTicket(newTicket);
      setTickets((prev) => [created, ...prev]);
      setSelectedTicket(created);
    } catch (err) {
      alert('Erro ao criar pedido na API.');
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedTicket) return;
    try {
      const updated = await updateTicketStatus(selectedTicket.id, newStatus);
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setSelectedTicket(updated);
    } catch (err) {
      alert('Erro ao atualizar status.');
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      t.id.toString().includes(filters.search);

    const matchesStatus =
      filters.status.length === 0 ||
      filters.status.includes(t.status) ||
      (filters.status.includes('NEW') && t.status === 'Novo') ||
      (filters.status.includes('IN_PROGRESS') && t.status === 'Em Curso') ||
      (filters.status.includes('CLOSED') && t.status === 'Resolvido');

    const matchesCategory =
      filters.category.length === 0 || filters.category.includes(t.category);

    const matchesPriority =
      filters.priority.length === 0 || filters.priority.includes(t.priority);

    const matchesLocation =
      filters.location.length === 0 || filters.location.includes(t.location);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory &&
      matchesPriority &&
      matchesLocation
    );
  });

  return (
    // h-screen e overflow-hidden garantem que a janela principal não faz scroll
    <div className="h-screen w-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-hidden">
      <Header />

      {/* Container principal flex com flex-1 min-h-0 para restringir altura dos filhos */}
      <div className="flex-1 min-h-0 flex overflow-hidden p-6 gap-6 max-w-7xl w-full mx-auto">
        <Sidebar
          filters={filters}
          setFilters={setFilters}
          tickets={tickets}
        />

        <main className="flex-1 min-h-0 flex flex-col gap-4 overflow-hidden">
          {/* Tabela com área de scroll contida */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <h2 className="font-semibold text-slate-800">
                Pedidos ({filteredTickets.length})
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                + Novo Pedido
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-8 text-center text-slate-400">A carregar pedidos...</div>
              ) : (
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 text-slate-500 font-medium z-10">
                    <tr>
                      <th className="p-3.5 pl-5">ID</th>
                      <th className="p-3.5">Título</th>
                      <th className="p-3.5">Estado</th>
                      <th className="p-3.5">Prioridade</th>
                      <th className="p-3.5">Categoria</th>
                      <th className="p-3.5">Localização</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`cursor-pointer transition-colors hover:bg-slate-50/80 ${
                          selectedTicket?.id === ticket.id ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        <td className="p-3.5 pl-5 font-mono text-xs font-semibold text-slate-500">#{ticket.id}</td>
                        <td className="p-3.5 font-medium text-slate-900">{ticket.title}</td>
                        <td className="p-3.5">{ticket.status}</td>
                        <td className="p-3.5">{ticket.priority}</td>
                        <td className="p-3.5">{ticket.category}</td>
                        <td className="p-3.5">{ticket.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {selectedTicket && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-3 shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-indigo-600 font-semibold">
                    Pedido #{selectedTicket.id}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 mt-0.5">{selectedTicket.title}</h3>
                </div>
              </div>

              <p className="text-slate-600 text-sm bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                {selectedTicket.description || 'Sem descrição.'}
              </p>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-500 font-medium">
                  Status atual: <strong className="text-slate-700">{selectedTicket.status}</strong>
                </span>

                <div className="flex gap-2">
                  {(selectedTicket.status === 'Novo') && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange('Em Curso')}
                      className="px-3 py-1.5 text-xs font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
                    >
                      Mudar para Em Curso
                    </button>
                  )}

                  {(selectedTicket.status === 'Em Curso') && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange('Resolvido')}
                      className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      Marcar como Resolvido
                    </button>
                  )}

                  {(selectedTicket.status === 'Resolvido') && (
                    <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      ✓ Pedido Concluído
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <TicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  );
}