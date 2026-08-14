import React, { useState } from 'react';
import { 
    TICKET_CATEGORIES,
    TICKET_PRIORITIES,
    TICKET_LOCATIONS
} from '../constants/ticketConstants';

export default function TicketModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: TICKET_CATEGORIES[0].value,
        priority: TICKET_PRIORITIES[0].value,
        location: TICKET_LOCATIONS[0].value,
    });
  
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
        await onSubmit(formData);
        // Reset form after submit
        setFormData({
            title: '',
            description: '',
            category: TICKET_CATEGORIES[0].value,
            priority: TICKET_PRIORITIES[0].value,
            location: TICKET_LOCATIONS[0].value,
        });
        onClose();
        } catch (err) {
        console.error('Erro ao criar ticket:', err);
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
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
                ✕
            </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            
            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700" required>
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
                <label className="block text-sm font-medium text-gray-700" required>
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
                <label className="block text-sm font-medium text-gray-700" required>
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
                <label className="block text-sm font-medium text-gray-700" required>
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
                <label className="block text-sm font-medium text-gray-700" required>
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
                    onClick={onClose}
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