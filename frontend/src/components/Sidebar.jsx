/**
 * Sidebar component for ticket filtering and summary statistics.
 *
 * Provides multi-select filters for status, category, priority, and location.
 * Includes a search input and ticket summary counters (New / In Progress / Resolved).
 * Filter selections are persisted in parent component state.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter state {search, status, category, priority, location}
 * @param {Function} props.setFilters - State setter for filters
 * @param {Array} props.tickets - All tickets (used for calculating summary counters)
 * @returns {JSX.Element} Sidebar with filters and summary
 *
 * @example
 *   <Sidebar
 *     filters={filters}
 *     setFilters={setFilters}
 *     tickets={tickets}
 *   />
 */

import React from 'react';
import { getLogger } from '../utils/logger';
import { 
  TICKET_CATEGORIES, 
  TICKET_PRIORITIES, 
  TICKET_LOCATIONS 
} from '../constants/ticketConstants';

const logger = getLogger('Sidebar');

export default function Sidebar({ filters, setFilters, tickets }) {
  // Calculate summary counters
  const totalNovos = tickets.filter(
    (t) => t.status === 'NEW' || t.status === 'Novo'
  ).length;
  const totalEmCurso = tickets.filter(
    (t) => t.status === 'IN_PROGRESS' || t.status === 'Em Curso'
  ).length;
  const totalResolvidos = tickets.filter(
    (t) => t.status === 'CLOSED' || t.status === 'Resolvido'
  ).length;

  const statusOptions = [
    { value: 'NEW', label: 'Novo' },
    { value: 'IN_PROGRESS', label: 'Em Curso' },
    { value: 'CLOSED', label: 'Resolvido' },
  ];

  /**
   * Toggle a value in a multi-select filter array.
   *
   * If the value is already selected, removes it. Otherwise, adds it.
   * Updates parent component state via setFilters.
   *
   * @param {string} field - Filter field name (status, category, priority, location)
   * @param {string} value - Value to toggle
   * @returns {void}
   */
  const toggleMultiSelect = (field, value) => {
    try {
      setFilters((prev) => {
        const currentSelections = prev[field];
        const exists = currentSelections.includes(value);

        const newFilters = {
          ...prev,
          [field]: exists
            ? currentSelections.filter((item) => item !== value) // Remove if already selected
            : [...currentSelections, value], // Add if not selected
        };

        logger.debug(`Filter toggled: ${field}=${value}, active count: ${newFilters[field].length}`);
        return newFilters;
      });
    } catch (error) {
      logger.error('Error toggling filter', error);
    }
  };

  /**
   * Handle search input changes.
   *
   * Updates the search filter field with the input value.
   *
   * @param {string} value - New search query
   * @returns {void}
   */
  const handleSearchChange = (value) => {
    try {
      setFilters((prev) => ({ ...prev, search: value }));
      logger.debug(`Search updated: "${value}"`);
    } catch (error) {
      logger.error('Error updating search filter', error);
    }
  };

  /**
   * Reset all filters to their default (empty) state.
   *
   * Clears search, status, category, priority, and location filters.
   *
   * @returns {void}
   */
  const resetFilters = () => {
    try {
      setFilters({
        search: '',
        status: [],
        category: [],
        priority: [],
        location: [],
      });
      logger.info('All filters cleared');
    } catch (error) {
      logger.error('Error resetting filters', error);
    }
  };

  // Check if any filters are actively applied
  const hasActiveFilters =
    filters.search !== '' ||
    filters.status.length > 0 ||
    filters.category.length > 0 ||
    filters.priority.length > 0 ||
    filters.location.length > 0;

  return (
    <aside className="w-80 bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-5 shrink-0 overflow-y-auto">

      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Filtros
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Limpar Filtros
          </button>
        )}
      </div>

      <div>
        <label className="text-xs font-medium text-slate-600 block mb-1">
          Pesquisa
        </label>
        <input
          type="text"
          placeholder="Buscar por ID ou título..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 block mb-2">
          Estado {filters.status.length > 0 && `(${filters.status.length})`}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {statusOptions.map((st) => {
            const isSelected = filters.status.includes(st.value);
            return (
              <button
                key={st.value}
                type="button"
                onClick={() => toggleMultiSelect('status', st.value)}
                className={`px-2.5 py-1 text-xs rounded-md border font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 block mb-2">
          Categoria {filters.category.length > 0 && `(${filters.category.length})`}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TICKET_CATEGORIES.map((cat) => {
            const isSelected = filters.category.includes(cat.value);
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => toggleMultiSelect('category', cat.value)}
                className={`px-2.5 py-1 text-xs rounded-md border font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 block mb-2">
          Prioridade {filters.priority.length > 0 && `(${filters.priority.length})`}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TICKET_PRIORITIES.map((prio) => {
            const isSelected = filters.priority.includes(prio.value);
            return (
              <button
                key={prio.value}
                type="button"
                onClick={() => toggleMultiSelect('priority', prio.value)}
                className={`px-2.5 py-1 text-xs rounded-md border font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {prio.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 block mb-2">
          Localização {filters.location.length > 0 && `(${filters.location.length})`}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TICKET_LOCATIONS.map((loc) => {
            const isSelected = filters.location.includes(loc.value);
            return (
              <button
                key={loc.value}
                type="button"
                onClick={() => toggleMultiSelect('location', loc.value)}
                className={`px-2.5 py-1 text-xs rounded-md border font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {loc.label}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100" />

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Resumo
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-red-50 rounded-lg border border-red-100">
            <div className="text-xs text-red-600 font-medium">Novos</div>
            <div className="text-lg font-bold text-red-700">{totalNovos}</div>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100">
            <div className="text-xs text-amber-600 font-medium">Em Curso</div>
            <div className="text-lg font-bold text-amber-700">{totalEmCurso}</div>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 col-span-2 flex justify-between items-center">
            <div className="text-xs text-emerald-600 font-medium">Resolvidos</div>
            <div className="text-lg font-bold text-emerald-700">{totalResolvidos}</div>
          </div>
        </div>
      </div>

    </aside>
  );
}