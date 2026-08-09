export enum PackageManager {
  NPM = "npm",
  Yarn = "yarn",
  PNPM = "pnpm",
}

export enum Template {
  Minimal = "Minimal",
  Basics = "Basics",
  Blog = "Blog",
  Portfolio = "Portfolio",
  React = "React",
  Vue = "Vue",
  Svelte = "Svelte",
}

export enum TypeScriptLevel {
  Strict = "Strict",
  Strictest = "Strictest",
  Relaxed = "Relaxed",
  None = "None",
}

export enum StylingChoice {
    Tailwind = "Tailwind CSS",
    Custom = "Custom CSS",
}

export enum ComponentLibrary {
    Shadcn = "Shadcn/UI",
    Starwind = "Starwind UI",
    Daisy = "DaisyUI",
    Custom = "Custom Components",
    None = "None",
}

export enum ThemeMode {
    System = "System (auto)",
    Light = "Light only",
    Dark = "Dark only",
}

export enum DbProvider {
    None = "None (Astro Content Collections)",
    SQLite = "SQLite (local file)",
    Postgres = "PostgreSQL (self-hosted)",
    Neon = "PostgreSQL (Neon)",
    MySQL = "MySQL (self-hosted)",
    PlanetScale = "MySQL (PlanetScale)",
    Supabase = "Supabase (Postgres + tools)",
}

export enum DbAdapter {
    None = "None",
    Drizzle = "Drizzle",
    Prisma = "Prisma",
}

export enum AuthProvider {
    None = "None",
    Supabase = "Supabase Auth",
    BetterAuth = "Better Auth",
}

export enum BetterAuthEmailProvider {
    Nodemailer = "Nodemailer (SMTP)",
    Resend = "Resend",
    None = "None (later)",
}

export interface CssVariable {
    name: string;
    value: string;
}

export type ColumnType = 'id' | 'string' | 'text' | 'number' | 'boolean' | 'date' | 'json' | 'relation';

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
  options: {
    primaryKey?: boolean;
    notNull?: boolean;
    unique?: boolean;
    default?: string | number | boolean;
    relatedTo?: string;
  };
}

export interface Table {
  id: string;
  name: string;
  columns: Column[];
}

export interface AstroConfig {
  projectName: string;
  template: Template;
  typescript: TypeScriptLevel;
  installDeps: boolean;
  initGit: boolean;
  packageManager: PackageManager;
  useAstroFont: boolean;
  useAstroIcon: boolean;
  iconLibraries: Record<string, boolean>;
  styling: StylingChoice;
  componentLibrary: ComponentLibrary;
  selectedComponents: Record<string, boolean>;
  theme: {
    mode: ThemeMode;
    light: CssVariable[];
    dark: CssVariable[];
    syncLocks: Record<string, boolean>;
  };
  useI18n: boolean;
  i18n: {
    locales: string[];
    defaultLocale: string;
  };
  db: {
    sameForDevProd: boolean;
    dev: {
        provider: DbProvider;
    };
    prod: {
        provider: DbProvider;
    };
    adapter: DbAdapter;
  };
  auth: {
    provider: AuthProvider;
    betterAuth: {
        plugins: Record<string, boolean>;
        emailProvider: BetterAuthEmailProvider;
    }
  };
  schema: {
      tables: Table[];
  };
  envVars: Record<string, string>;
}

export enum FileTab {
    PackageJson = "package.json",
    AstroConfig = "astro.config.mjs",
    TailwindConfig = "tailwind.config.mjs",
    ThemeCss = "src/styles/theme.css",
    DrizzleSchema = "src/db/schema.ts",
    PrismaSchema = "prisma/schema.prisma",
    AuthTs = "src/auth.ts",
    MiddlewareTs = "src/middleware.ts",
    ApiAuthRoute = "src/pages/api/auth/[...all].ts",
    AuthClient = "src/lib/auth-client.ts",
    EmailUtil = "src/lib/email.ts",
    EnvDTs = "src/env.d.ts",
    Env = ".env",
}