export type Page = "home" | "tipos" | "tipo" | "portfolio" | "metodologia" | "contacto";

export type NavFn = (page: Page) => void;

export type OpenTypeFn = (index: number) => void;
