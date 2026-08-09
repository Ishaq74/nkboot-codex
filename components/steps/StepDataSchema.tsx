import React, { useState } from 'react';
import type { AstroConfig, Table, Column, ColumnType } from '../../types';
import { DbAdapter } from '../../types';
import { Bot, Plus, Trash2, X } from 'lucide-react';
import { generateSchemaViaProxy } from '../../lib/schemaAi';

interface StepProps {
    config: AstroConfig;
    updateConfig: (updater: (c: AstroConfig) => AstroConfig) => void;
}

export const StepDataSchema: React.FC<StepProps> = ({ config, updateConfig }) => {
    const [aiPrompt, setAiPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditorDisabled = config.db.adapter === DbAdapter.None;

    const handleGenerateWithAI = async () => {
        if (!aiPrompt.trim()) return;
        setIsLoading(true);
        setError(null);

        try {
            const newSchema = await generateSchemaViaProxy(config, aiPrompt.trim());
            updateConfig(c => ({ ...c, schema: newSchema }));
            setAiPrompt("");
        } catch (e) {
            console.error(e);
            setError("AI schema generation requires a configured backend proxy at /api/generate-schema. Manual schema editing remains available.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- Manual Table/Column management functions ---
    const addTable = () => {
        const newTable: Table = {
            id: crypto.randomUUID(),
            name: `new_table_${config.schema.tables.length + 1}`,
            columns: [
                { id: crypto.randomUUID(), name: 'id', type: 'id', options: { primaryKey: true } }
            ]
        };
        updateConfig(c => ({ ...c, schema: { tables: [...c.schema.tables, newTable] } }));
    };

    const deleteTable = (tableId: string) => {
        updateConfig(c => ({
            ...c,
            schema: { tables: c.schema.tables.filter(t => t.id !== tableId) }
        }));
    };
    
    const addColumn = (tableId: string) => {
        const newColumn: Column = {
            id: crypto.randomUUID(),
            name: 'new_column',
            type: 'string',
            options: {}
        };
        updateConfig(c => ({
            ...c,
            schema: {
                tables: c.schema.tables.map(t =>
                    t.id === tableId ? { ...t, columns: [...t.columns, newColumn] } : t
                )
            }
        }));
    };
    
    const deleteColumn = (tableId: string, columnId: string) => {
        updateConfig(c => ({
            ...c,
            schema: {
                tables: c.schema.tables.map(t =>
                    t.id === tableId ? { ...t, columns: t.columns.filter(col => col.id !== columnId) } : t
                )
            }
        }));
    };
    
     const updateColumn = (tableId: string, columnId: string, updates: Partial<Column>) => {
        updateConfig(c => ({
            ...c,
            schema: {
                tables: c.schema.tables.map(t =>
                    t.id === tableId
                        ? { ...t, columns: t.columns.map(col => col.id === columnId ? { ...col, ...updates } : col) }
                        : t
                )
            }
        }));
    };
    
     const updateTableName = (tableId: string, newName: string) => {
        updateConfig(c => ({
            ...c,
            schema: {
                tables: c.schema.tables.map(t => t.id === tableId ? { ...t, name: newName.toLowerCase().replace(/\s+/g, '_') } : t)
            }
        }));
    };


    if (isEditorDisabled) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-gunmetal/50 rounded-lg">
                <h3 className="text-lg font-bold text-cyber-yellow">Schema Editor Disabled</h3>
                <p className="text-gray-400 mt-2">Please select a Database Adapter (Drizzle or Prisma) in the "Database & Auth" step to design your data schema.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-light-gray flex items-center gap-2"><Bot size={20} className="text-sky-blue" /> AI Schema Generator</h3>
                <p className="text-sm text-gray-400 mb-2">Describe your app's data in plain English. For example, "a blog with posts, comments, and tags".</p>
                <div className="flex gap-2">
                    <input type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} disabled={isLoading} className="flex-grow bg-gunmetal border border-gray-600 rounded-md p-2 text-light-gray focus:ring-2 focus:ring-cyber-yellow focus:outline-none" placeholder="e.g., A project manager with tasks and users" />
                    <button onClick={handleGenerateWithAI} disabled={isLoading || !aiPrompt} className="bg-sky-blue hover:bg-sky-blue/80 text-raisin-black font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>
            
            <div className="space-y-4">
                 <h3 className="text-lg font-semibold text-light-gray border-t border-gunmetal pt-4">Database Tables</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {config.schema.tables.map(table => (
                        <div key={table.id} className="bg-gunmetal p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                                <input type="text" value={table.name} onChange={e => updateTableName(table.id, e.target.value)} className="text-md font-bold text-cyber-yellow bg-transparent border-b-2 border-transparent focus:border-cyber-yellow focus:outline-none" />
                                <button onClick={() => deleteTable(table.id)} className="text-gray-500 hover:text-coral-pink"><Trash2 size={16} /></button>
                            </div>
                            <div className="space-y-2">
                                {table.columns.map(col => (
                                    <div key={col.id} className="grid grid-cols-3 gap-2 items-center text-sm">
                                        <input value={col.name} onChange={e => updateColumn(table.id, col.id, {name: e.target.value.toLowerCase().replace(/\s+/g, '_')})} className="bg-jet p-1 rounded-md text-light-gray focus:outline-none focus:ring-1 focus:ring-sky-blue" />
                                        <select value={col.type} onChange={e => updateColumn(table.id, col.id, {type: e.target.value as ColumnType})} className="bg-jet p-1 rounded-md text-light-gray focus:outline-none focus:ring-1 focus:ring-sky-blue">
                                            {['id', 'string', 'text', 'number', 'boolean', 'date', 'json', 'relation'].map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <div className="flex items-center justify-end">
                                            <button onClick={() => deleteColumn(table.id, col.id)} className="text-gray-500 hover:text-coral-pink"><X size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => addColumn(table.id)} className="text-sky-blue text-sm mt-2 flex items-center gap-1 hover:underline"><Plus size={14} /> Add Column</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={addTable} className="w-full bg-gunmetal/70 hover:bg-gunmetal text-light-gray font-bold py-2 px-4 rounded flex items-center justify-center gap-2">
                    <Plus size={16} /> Add Table
                </button>
            </div>
        </div>
    );
};
