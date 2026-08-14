/**
 * Centralized constants for the KSA Ticket Management System frontend.
 *
 * Defines enum values for ticket categories, priorities, locations, and statuses.
 * Used to populate dropdowns, render UI elements, and validate user input.
 *
 * These values must match the backend enums defined in ticket_model.py.
 * If the backend enums change, update these constants to maintain consistency.
 *
 * @module constants/ticketConstants
 */

/**
 * Available ticket categories.
 *
 * Each category represents a department or type of support request.
 * Used to classify and filter tickets by department.
 *
 * @type {Array<Object>}
 * @property {string} label - Display label in Portuguese
 * @property {string} value - Internal value matching backend enum
 * @property {string} icon - Emoji icon for UI display
 */
export const TICKET_CATEGORIES = [
    { label: 'TI', value: 'TI', icon: '💻' },
    { label: 'Manutenção', value: 'Manutenção', icon: '🛠️' },
    { label: 'Compras', value: 'Compras', icon: '🛒' },
    { label: 'Financeiro', value: 'Financeiro', icon: '💰' },
    { label: 'Customer Service', value: 'Customer_Service', icon: '📞' },
    { label: 'Produção', value: 'Produção', icon: '🏭' }
];

/**
 * Available priority levels for tickets.
 *
 * Indicates urgency: Baixa (low) to Urgente (critical).
 * Higher priority tickets should be addressed first.
 *
 * @type {Array<Object>}
 * @property {string} label - Display label in Portuguese
 * @property {string} value - Internal value matching backend enum
 * @property {string} color - Tailwind CSS color classes for styling
 */
export const TICKET_PRIORITIES = [
    { label: 'Baixa', value: 'Baixa', color: 'bg-green-100 text-green-800' },
    { label: 'Média', value: 'Média', color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Alta', value: 'Alta', color: 'bg-red-100 text-red-800' },
    { label: 'Urgente', value: 'Urgente', color: 'bg-red-600 text-white' }
];

/**
 * KSA company locations.
 *
 * Represents the three operational sites where tickets can originate.
 * Ermesinde (Portugal Continental), Madeira (Portugal), Tânger (Morocco).
 *
 * @type {Array<Object>}
 * @property {string} label - Display label
 * @property {string} value - Internal value matching backend enum
 */
export const TICKET_LOCATIONS = [
    { label: 'Ermesinde', value: 'Ermesinde' },
    { label: 'Madeira', value: 'Madeira' },
    { label: 'Tânger', value: 'Tânger' }
];

/**
 * Ticket lifecycle statuses.
 *
 * Tracks ticket progression: Novo (new) → Em Curso (in progress) → Resolvido (resolved).
 * Status can only move forward in this workflow.
 *
 * @type {Array<Object>}
 * @property {string} label - Display label in Portuguese
 * @property {string} value - Internal value matching backend enum
 * @property {string} color - Tailwind CSS color classes for styling
 */
export const TICKET_STATUSES = [
    { label: 'Novo', value: 'Novo', color: 'bg-blue-100 text-blue-800' },
    { label: 'Em Curso', value: 'Em Curso', color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Resolvido', value: 'Resolvido', color: 'bg-green-100 text-green-800' }
];