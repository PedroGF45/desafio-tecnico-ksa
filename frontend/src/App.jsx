/**
 * Main application component for KSA Ticket Management System.
 *
 * Manages global state including:
 * - List of all tickets fetched from backend
 * - Selected ticket for detailed view
 * - Filter state (search, status, category, priority, location)
 * - Modal state for creating new tickets
 *
 * Handles all API interactions: fetching tickets, creating new tickets,
 * updating ticket status. Includes error handling with user-friendly alerts
 * and structured logging.
 *
 * @component
 * @returns {JSX.Element} The complete ticket management interface
 */

import React, { useState, useEffect } from 'react';
import { getLogger } from './utils/logger';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TicketModal from './components/TicketModal';
import { fetchTickets, createTicket, updateTicketStatus } from './services/api';

const logger = getLogger('App');

export default function App() {
  // State management
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: [],
    category: [],
    priority: [],
    location: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch all tickets from the backend API on component mount.
   *
   * Sets loading state while fetching, then updates state with retrieved tickets.
   * If tickets are successfully loaded, selects the first ticket for display.
   * Errors are logged and shown to the user via alert.
   *
   * @async
   * @returns {void}
   */
  const loadData = async () => {
    try {
      logger.info('Loading tickets from backend');
      const data = await fetchTickets();
      setTickets(data);
      if (data.length > 0 && !selectedTicket) {
        setSelectedTicket(data[0]);
        logger.info(`Loaded ${data.length} tickets, selected first ticket`);
      }
    } catch (err) {
      logger.error('Failed to load tickets', err);
      alert('Erro ao carregar pedidos. Por favor, atualize a página.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tickets on component mount
  useEffect(() => {
    logger.debug('App component mounted, fetching initial data');
    loadData();
  }, []);

  /**
   * Handle creation of a new ticket via the modal.
   *
   * Calls the backend API to create the ticket, then updates local state
   * to include the new ticket and selects it for display. If creation fails,
   * logs the error and shows a user-friendly alert.
   *
   * @async
   * @param {Object} newTicket - Ticket data from TicketModal form
   * @returns {void}
   */
  const handleCreateTicket = async (newTicket) => {
    try {
      logger.info(`Creating new ticket: ${newTicket.title}`);
      const created = await createTicket(newTicket);
      setTickets((prev) => [created, ...prev]);
      setSelectedTicket(created);
      logger.info(`Ticket created and added to list, ID: ${created.id}`);
    } catch (err) {
      logger.error('Failed to create ticket', err);
      alert('Erro ao criar pedido. Por favor, tente novamente.');
    }
  };

  /**
   * Handle status update for the currently selected ticket.
   *
   * Updates the backend, then reflects the change in local state.
   * The updated_at timestamp is automatically refreshed on the backend.
   * Errors are logged and shown via alert.
   *
   * @async
   * @param {string} newStatus - New status value (Novo/Em Curso/Resolvido)
   * @returns {void}
   */
  const handleStatusChange = async (newStatus) => {
    if (!selectedTicket) {
      logger.warn('handleStatusChange called with no selected ticket');
      return;
    }
    try {
      logger.info(`Updating ticket ${selectedTicket.id} status to ${newStatus}`);
      const updated = await updateTicketStatus(selectedTicket.id, newStatus);
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setSelectedTicket(updated);
      logger.info(`Ticket ${selectedTicket.id} status updated successfully`);
    } catch (err) {
      logger.error(`Failed to update ticket ${selectedTicket.id} status`, err);
      alert('Erro ao atualizar status. Por favor, tente novamente.');
    }
  };

  /**
   * Apply all active filters to the tickets list.
   *
   * Filters by search term (title or ID), status, category, priority, and location.
   * Multiple filter types are combined with AND logic (ticket must match all active filters).
   *
   * @returns {Array} Filtered array of tickets matching all criteria
   */
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
      <Header onNewTicket={() => setIsModalOpen(true)} />

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
                        onClick={() => {
                          logger.debug(`Selected ticket ${ticket.id}`);
                          setSelectedTicket(ticket);
                        }}
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