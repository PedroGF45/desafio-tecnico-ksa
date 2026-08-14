/**
 * TicketModal component for creating new tickets.
 *
 * Displays a modal dialog with a form for creating new support tickets.
 * Form includes fields for title, description, category, priority, and location.
 * Validates required fields and submits to backend API via onSubmit callback.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Function} props.onSubmit - Callback when form is submitted with ticket data
 * @returns {JSX.Element|null} Modal dialog or null if not open
 *
 * @example
 *   const [isOpen, setIsOpen] = useState(false);
 *   <TicketModal
 *     isOpen={isOpen}
 *     onClose={() => setIsOpen(false)}
 *     onSubmit={async (data) => {
 *       await createTicket(data);
 *       setIsOpen(false);
 *     }}
 *   />
 */

import React, { useState } from 'react';
import { getLogger } from '../utils/logger';
import { 
    TICKET_CATEGORIES,
    TICKET_PRIORITIES,
    TICKET_LOCATIONS
} from '../constants/ticketConstants';

const logger = getLogger('TicketModal');

export default function TicketModal({ isOpen, onClose, onSubmit }) {
    // Form state management
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: TICKET_CATEGORIES[0].value,
        priority: TICKET_PRIORITIES[0].value,
        location: TICKET_LOCATIONS[0].value,
    });
  
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');

    if (!isOpen) return null;

    /**
     * Handle form input changes.
     *
     * Updates the formData state when user types in any form field.
     *
     * @param {Event} e - React change event from input/select/textarea
     * @returns {void}
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        try {
            setFormData((prev) => ({ ...prev, [name]: value }));
            // Clear validation error when user modifies form
            if (validationError) {
                setValidationError('');
            }
        } catch (error) {
            logger.error('Error handling form change', error);
        }
    };

    /**
     * Validate form data before submission.
     *
     * Checks that required fields are filled and meet length requirements.
     *
     * @returns {boolean} True if form is valid, false otherwise
     */
    const validateForm = () => {
        if (!formData.title.trim()) {
            setValidationError('Título é obrigatório');
            return false;
        }
        if (formData.title.trim().length < 5) {
            setValidationError('Título deve ter pelo menos 5 caracteres');
            return false;
        }
        if (!formData.description.trim()) {
            setValidationError('Descrição é obrigatória');
            return false;
        }
        if (formData.description.trim().length < 10) {
            setValidationError('Descrição deve ter pelo menos 10 caracteres');
            return false;
        }
        return true;
    };

    /**
     * Handle form submission.
     *
     * Validates form data, calls the onSubmit callback, resets form on success,
     * and closes the modal. Handles errors with user-friendly messages.
     *
     * @async
     * @param {Event} e - Form submit event
     * @returns {void}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            logger.warn('Form validation failed', formData);
            return;
        }

        setIsSubmitting(true);
        try {
            logger.info(`Submitting new ticket: "${formData.title}"`);
            await onSubmit(formData);
            
            // Reset form after successful submission
            setFormData({
                title: '',
                description: '',
                category: TICKET_CATEGORIES[0].value,
                priority: TICKET_PRIORITIES[0].value,
                location: TICKET_LOCATIONS[0].value,
            });
            setValidationError('');
            logger.info('Ticket submitted successfully');
            onClose();
        } catch (err) {
            logger.error('Error submitting ticket form', err);
            setValidationError('Erro ao criar ticket. Por favor, tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl transition-all">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800">Criar Novo Ticket</h2>
            <button 
                type="button"
                onClick={() => {
                    logger.debug('Closing ticket modal');
                    onClose();
                }}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Fechar modal"
            >
                ✕
            </button>
            </div>

            {/* Validation Error Alert */}
            {validationError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {validationError}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            
            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Título <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Monitor não liga"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>

            {/* Category and Priority (Grid) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                <label className="block text-sm font-medium text-gray-700">
                    Categoria <span className="text-red-500">*</span>
                </label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    {TICKET_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                        {cat.label}
                    </option>
                    ))}
                </select>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700">
                    Prioridade <span className="text-red-500">*</span>
                </label>
                <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    {TICKET_PRIORITIES.map((prio) => (
                    <option key={prio.value} value={prio.value}>
                        {prio.label}
                    </option>
                    ))}
                </select>
                </div>
            </div>

            {/* Location */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Localização <span className="text-red-500">*</span>
                </label>
                <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                {TICKET_LOCATIONS.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                    {loc.label}
                    </option>
                ))}
                </select>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Descrição <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descreva o problema em detalhe..."
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>

            {/* Footer / Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={() => {
                        logger.debug('Cancelled ticket creation');
                        onClose();
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                    {isSubmitting ? 'A criar...' : 'Criar Ticket'}
                </button>
            </div>

            </form>
        </div>
        </div>
    );
}