import type { AstroConfig, Table } from '../types';
import { AuthProvider } from '../types';

const betterAuthTables: Table[] = [
    {
        id: 'tbl_users',
        name: 'users',
        columns: [
            { id: 'col_users_id', name: 'id', type: 'id', options: { primaryKey: true } },
            { id: 'col_users_email', name: 'email', type: 'string', options: { unique: true } },
            { id: 'col_users_name', name: 'name', type: 'string', options: { notNull: false } },
            { id: 'col_users_created_at', name: 'created_at', type: 'date', options: { notNull: true, default: 'now()' } },
        ]
    },
    {
        id: 'tbl_sessions',
        name: 'sessions',
        columns: [
            { id: 'col_sessions_id', name: 'id', type: 'string', options: { primaryKey: true, unique: true } },
            { id: 'col_sessions_user_id', name: 'user_id', type: 'relation', options: { notNull: true, relatedTo: 'users' } },
            { id: 'col_sessions_expires_at', name: 'expires_at', type: 'date', options: { notNull: true } },
        ]
    },
    {
        id: 'tbl_authenticators',
        name: 'authenticators',
        columns: [
            { id: 'col_auth_id', name: 'id', type: 'id', options: { primaryKey: true } },
            { id: 'col_auth_user_id', name: 'user_id', type: 'relation', options: { notNull: true, relatedTo: 'users' } },
            { id: 'col_auth_provider', name: 'provider', type: 'string', options: { notNull: true } },
            { id: 'col_auth_provider_id', name: 'provider_id', type: 'string', options: { notNull: true } },
            { id: 'col_auth_data', name: 'data', type: 'json', options: {} },
        ]
    }
];


export const getInitialSchema = (config: Omit<AstroConfig, 'schema'>): { tables: Table[] } => {
    const tables: Table[] = [];

    if (config.auth.provider === AuthProvider.BetterAuth) {
        tables.push(...betterAuthTables);
    }
    
    return { tables };
};