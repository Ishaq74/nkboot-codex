import type { AstroConfig, Column, ColumnType, Table } from '../types';
import {
  AuthProvider,
  BetterAuthEmailProvider,
  ComponentLibrary,
  DbAdapter,
  DbProvider,
  PackageManager,
  StylingChoice,
  Template,
  ThemeMode,
  TypeScriptLevel,
} from '../types';

const columnTypes = new Set<ColumnType>(['id', 'string', 'text', 'number', 'boolean', 'date', 'json', 'relation']);

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const isEnumValue = <T extends Record<string, string>>(enumObject: T, value: unknown): value is T[keyof T] => {
  return typeof value === 'string' && Object.values(enumObject).includes(value);
};

const sanitizeIdentifier = (value: unknown, fallback: string): string => {
  if (typeof value !== 'string') return fallback;
  const sanitized = value.trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '');
  return sanitized || fallback;
};

const sanitizeString = (value: unknown, fallback: string): string => {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
};

const sanitizeBoolean = (value: unknown, fallback: boolean): boolean => {
  return typeof value === 'boolean' ? value : fallback;
};

const sanitizeBooleanRecord = (value: unknown): Record<string, boolean> => {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean'));
};

const sanitizeStringRecord = (value: unknown): Record<string, string> => {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
};

const sanitizeCssVariables = (value: unknown, fallback: AstroConfig['theme']['light']): AstroConfig['theme']['light'] => {
  if (!Array.isArray(value)) return fallback;
  const variables = value
    .filter(isRecord)
    .map((variable) => ({
      name: sanitizeString(variable.name, ''),
      value: sanitizeString(variable.value, ''),
    }))
    .filter((variable) => variable.name.startsWith('--') && variable.value.length > 0);

  return variables.length > 0 ? variables : fallback;
};

export const sanitizeSchema = (value: unknown, fallback: AstroConfig['schema'] = { tables: [] }): AstroConfig['schema'] => {
  if (!isRecord(value) || !Array.isArray(value.tables)) return fallback;

  const tables: Table[] = value.tables.filter(isRecord).map((table, tableIndex) => {
    const columns = Array.isArray(table.columns) ? table.columns : [];
    const sanitizedColumns: Column[] = columns.filter(isRecord).map((column, columnIndex) => {
      const type = columnTypes.has(column.type as ColumnType) ? column.type as ColumnType : 'string';
      const options = isRecord(column.options) ? column.options : {};

      return {
        id: sanitizeString(column.id, `column_${tableIndex}_${columnIndex}`),
        name: sanitizeIdentifier(column.name, `column_${columnIndex + 1}`),
        type,
        options: {
          primaryKey: typeof options.primaryKey === 'boolean' ? options.primaryKey : undefined,
          notNull: typeof options.notNull === 'boolean' ? options.notNull : undefined,
          unique: typeof options.unique === 'boolean' ? options.unique : undefined,
          default: ['string', 'number', 'boolean'].includes(typeof options.default) ? options.default as string | number | boolean : undefined,
          relatedTo: typeof options.relatedTo === 'string' ? sanitizeIdentifier(options.relatedTo, '') : undefined,
        },
      };
    });

    const hasPrimaryId = sanitizedColumns.some((column) => column.type === 'id' || column.options.primaryKey);
    const safeColumns = hasPrimaryId
      ? sanitizedColumns
      : [{ id: `id_${tableIndex}`, name: 'id', type: 'id' as ColumnType, options: { primaryKey: true } }, ...sanitizedColumns];

    return {
      id: sanitizeString(table.id, `table_${tableIndex}`),
      name: sanitizeIdentifier(table.name, `table_${tableIndex + 1}`),
      columns: safeColumns,
    };
  });

  return tables.length > 0 ? { tables } : fallback;
};

export const sanitizeAstroConfig = (value: unknown, initialConfig: AstroConfig): AstroConfig => {
  if (!isRecord(value)) return initialConfig;

  const theme = isRecord(value.theme) ? value.theme : {};
  const i18n = isRecord(value.i18n) ? value.i18n : {};
  const db = isRecord(value.db) ? value.db : {};
  const auth = isRecord(value.auth) ? value.auth : {};
  const betterAuth = isRecord(auth.betterAuth) ? auth.betterAuth : {};

  return {
    ...initialConfig,
    projectName: sanitizeString(value.projectName, initialConfig.projectName),
    template: isEnumValue(Template, value.template) ? value.template : initialConfig.template,
    typescript: isEnumValue(TypeScriptLevel, value.typescript) ? value.typescript : initialConfig.typescript,
    installDeps: sanitizeBoolean(value.installDeps, initialConfig.installDeps),
    initGit: sanitizeBoolean(value.initGit, initialConfig.initGit),
    packageManager: isEnumValue(PackageManager, value.packageManager) ? value.packageManager : initialConfig.packageManager,
    useAstroFont: sanitizeBoolean(value.useAstroFont, initialConfig.useAstroFont),
    useAstroIcon: sanitizeBoolean(value.useAstroIcon, initialConfig.useAstroIcon),
    iconLibraries: sanitizeBooleanRecord(value.iconLibraries),
    styling: isEnumValue(StylingChoice, value.styling) ? value.styling : initialConfig.styling,
    componentLibrary: isEnumValue(ComponentLibrary, value.componentLibrary) ? value.componentLibrary : initialConfig.componentLibrary,
    selectedComponents: sanitizeBooleanRecord(value.selectedComponents),
    theme: {
      ...initialConfig.theme,
      mode: isEnumValue(ThemeMode, theme.mode) ? theme.mode : initialConfig.theme.mode,
      light: sanitizeCssVariables(theme.light, initialConfig.theme.light),
      dark: sanitizeCssVariables(theme.dark, initialConfig.theme.dark),
      syncLocks: { ...initialConfig.theme.syncLocks, ...sanitizeBooleanRecord(theme.syncLocks) },
    },
    useI18n: sanitizeBoolean(value.useI18n, initialConfig.useI18n),
    i18n: {
      locales: Array.isArray(i18n.locales) ? i18n.locales.filter((locale): locale is string => typeof locale === 'string') : initialConfig.i18n.locales,
      defaultLocale: sanitizeString(i18n.defaultLocale, initialConfig.i18n.defaultLocale),
    },
    db: {
      sameForDevProd: sanitizeBoolean(db.sameForDevProd, initialConfig.db.sameForDevProd),
      dev: { provider: isRecord(db.dev) && isEnumValue(DbProvider, db.dev.provider) ? db.dev.provider : initialConfig.db.dev.provider },
      prod: { provider: isRecord(db.prod) && isEnumValue(DbProvider, db.prod.provider) ? db.prod.provider : initialConfig.db.prod.provider },
      adapter: isEnumValue(DbAdapter, db.adapter) ? db.adapter : initialConfig.db.adapter,
    },
    auth: {
      provider: isEnumValue(AuthProvider, auth.provider) ? auth.provider : initialConfig.auth.provider,
      betterAuth: {
        plugins: sanitizeBooleanRecord(betterAuth.plugins),
        emailProvider: isEnumValue(BetterAuthEmailProvider, betterAuth.emailProvider) ? betterAuth.emailProvider : initialConfig.auth.betterAuth.emailProvider,
      },
    },
    schema: sanitizeSchema(value.schema, initialConfig.schema),
    envVars: sanitizeStringRecord(value.envVars),
  };
};

export const extractStoredConfig = (value: unknown): unknown => {
  if (isRecord(value) && 'config' in value) return value.config;
  return value;
};
