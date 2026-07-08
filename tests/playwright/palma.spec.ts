import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const routes = [
  "/",
  "/que-disenamos",
  "/que-disenamos/balcones-y-terrazas-verdes",
  "/proyectos",
  "/metodologia",
  "/contacto",
];

const largeImageDir = path.join(
  process.cwd(),
  "fotos pagina palma-20260708T124344Z-3-001",
  "fotos pagina palma",
);

async function expectImagesLoaded(page: Page) {
  await page.evaluate(async () => {
    const distance = Math.max(300, Math.floor(window.innerHeight * 0.75));
    for (let y = 0; y < document.documentElement.scrollHeight; y += distance) {
      window.scrollTo(0, y);
      await new Promise((resolve) => window.setTimeout(resolve, 120));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((resolve) => window.setTimeout(resolve, 300));
  });

  await page.locator("img").evaluateAll(async (images) => {
    await Promise.all(
      images.map((image) => {
        if (image.complete && image.naturalWidth > 0) return Promise.resolve();
        return image.decode().catch(() => undefined);
      }),
    );
  });

  const brokenImages = await page.locator("img").evaluateAll((images) =>
    images
      .filter((image) => !image.complete || image.naturalWidth === 0 || image.naturalHeight === 0)
      .map((image) => image.getAttribute("alt") || image.getAttribute("src") || "unknown"),
  );

  expect(brokenImages).toEqual([]);
}

async function expectNoHorizontalOverflow(page: Page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe("Palma public website", () => {
  for (const route of routes) {
    test(`desktop renders ${route} with loaded images`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(route);
      await expect(page.locator("body")).toBeVisible();
      await expectImagesLoaded(page);
      await expectNoHorizontalOverflow(page);
    });

    test(`mobile renders ${route} with loaded images`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route);
      await expect(page.locator("body")).toBeVisible();
      await expectImagesLoaded(page);
      await expectNoHorizontalOverflow(page);
    });
  }

  test("desktop navigation and project type links work", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    await page.getByRole("link", { name: /Qué diseñamos|Áreas de trabajo/ }).click();
    await expect(page).toHaveURL(/\/que-disenamos$/);
    await page.getByRole("link", { name: /Balcones y terrazas verdes/ }).first().click();
    await expect(page).toHaveURL(/\/que-disenamos\/balcones-y-terrazas-verdes$/);
    await expect(page.getByRole("heading", { name: "Balcones y terrazas verdes" })).toBeVisible();
  });

  test("mobile menu opens and navigates", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await expect(page.getByRole("link", { name: "Proyectos" })).toBeVisible();
    await page.getByRole("link", { name: "Proyectos" }).click();
    await expect(page).toHaveURL(/\/proyectos$/);
    await expect(page.getByRole("heading", { name: "Estamos preparando esta sección." })).toBeVisible();
  });

  test("contact form shows thank-you state", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/contacto");
    await page.getByLabel("Nombre").fill("Persona Test");
    await page.getByLabel("Email").fill("persona@example.com");
    await page.getByLabel("Tipo de proyecto").selectOption("patio");
    await page.getByLabel("Contanos sobre tu espacio").fill("Quiero revisar el jardín.");
    await page.getByRole("button", { name: "Enviar consulta" }).click();
    await expect(page.getByRole("heading", { name: "Gracias por escribirnos." })).toBeVisible();
  });

  test("admin route redirects to login and rejects invalid credentials", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.getByLabel("Contraseña").fill("wrong-password");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByRole("button", { name: "Ingresando..." })).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login\?error=/);
    await expect(page.locator("text=/Email o contraseña inválidos|La cuenta no tiene permisos/")).toBeVisible();
  });

  test("admin image controls show only when dirty and cancel restores preview", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill("admin@admin.com");
    await page.getByLabel("Contraseña").fill("admin123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/admin$/);

    const heroCard = page.locator("form").filter({ hasText: "hero" }).first();
    await expect(heroCard.getByRole("button", { name: "Guardar" })).toHaveCount(0);
    await expect(heroCard.getByRole("button", { name: "Cancelar" })).toHaveCount(0);

    await heroCard.locator('input[name="image"]').setInputFiles(path.join(process.cwd(), "public", "palma", "palma-03.jpg"));
    await expect(heroCard.getByRole("img", { name: /Patio|Jardín|Jardin|Imagen/ })).toBeVisible();
    await expect(heroCard.getByText("Vista previa")).toBeVisible();
    await expect(heroCard.getByRole("button", { name: "Guardar" })).toBeVisible();
    await expect(heroCard.getByRole("button", { name: "Cancelar" })).toBeVisible();

    await heroCard.getByRole("button", { name: "Cancelar" }).click();
    await expect(heroCard.getByText("Vista previa")).toHaveCount(0);
    await expect(heroCard.getByRole("button", { name: "Guardar" })).toHaveCount(0);
  });

  test("project type alt text is fixed and not editable", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill("admin@admin.com");
    await page.getByLabel("Contraseña").fill("admin123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/admin$/);

    const projectCard = page.locator("form").filter({ hasText: "balcones-y-terrazas-verdes" }).first();
    await expect(projectCard.getByText("image-1")).toBeVisible();
    await expect(projectCard.locator('input[name="alt"][type="text"]')).toHaveCount(0);
  });

  test("admin upload compresses a large image before saving", async ({ page }) => {
    test.skip(!fs.existsSync(largeImageDir), "Large Palma photo folder is not present.");

    const largeImage = fs
      .readdirSync(largeImageDir)
      .filter((fileName) => /\.(jpe?g|png|webp)$/i.test(fileName))
      .map((fileName) => {
        const filePath = path.join(largeImageDir, fileName);
        return { filePath, size: fs.statSync(filePath).size };
      })
      .sort((a, b) => b.size - a.size)[0];

    expect(largeImage.size).toBeGreaterThan(10 * 1024 * 1024);

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill("admin@admin.com");
    await page.getByLabel("Contraseña").fill("admin123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/admin$/);

    const heroCard = page.locator("form").filter({ hasText: "hero" }).first();
    await heroCard.locator('input[name="image"]').setInputFiles(largeImage.filePath);
    await heroCard.locator('input[name="alt"]').fill("Imagen comprimida desde Playwright");
    await heroCard.getByRole("button", { name: "Guardar" }).click();

    await expect(heroCard.locator("text=/Comprimida de/")).toBeVisible({ timeout: 30000 });
    await expect(heroCard.locator("[data-upload-status='success']")).toContainText("Imagen guardada", {
      timeout: 30000,
    });

    await page.goto("/");
    await expectImagesLoaded(page);
  });
});
