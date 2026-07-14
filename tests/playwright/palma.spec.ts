import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const routes = [
  "/",
  "/que-disenamos",
  "/que-disenamos/balcones-y-terrazas-verdes",
  "/proyectos",
  "/nuestra-mirada",
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

async function expectNoRevealScrollOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.body.scrollHeight - document.documentElement.scrollHeight);
  expect(overflow).toBe(0);
}

async function expectFullLogosKeepRatio(page: Page) {
  const logos = await page.locator('img[alt="Palma - Diseño de Paisajes con Sentido"]').evaluateAll((images) =>
    images.map((image) => {
      const rect = image.getBoundingClientRect();
      return {
        width: rect.width,
        ratio: rect.width / rect.height,
        naturalRatio: image.naturalWidth / image.naturalHeight,
      };
    }),
  );

  expect(logos.length).toBeGreaterThan(0);

  for (const logo of logos) {
    expect(Math.abs(logo.ratio - logo.naturalRatio)).toBeLessThan(0.2);
    expect(logo.width).toBeLessThanOrEqual(350);
  }
}

async function expectReturnLinkBeforeHeading(page: Page, label: string, href: string) {
  const returnLink = page.locator("[data-return-link]").first();
  await expect(returnLink).toContainText(label);
  await expect(returnLink).toHaveAttribute("href", href);

  const [returnBox, headingBox] = await Promise.all([
    returnLink.boundingBox(),
    page.locator("h1").first().boundingBox(),
  ]);

  expect(returnBox).not.toBeNull();
  expect(headingBox).not.toBeNull();
  expect(returnBox!.y).toBeLessThan(headingBox!.y);
}

async function loginAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("admin@admin.com");
  await page.getByLabel("Contraseña").fill("admin123");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test.describe("Palma public website", () => {
  for (const route of routes) {
    test(`desktop renders ${route} with loaded images`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(route);
      await expect(page.locator("body")).toBeVisible();
      await expectImagesLoaded(page);
      await expectNoHorizontalOverflow(page);
      await expectNoRevealScrollOverflow(page);
    });

    test(`mobile renders ${route} with loaded images`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route);
      await expect(page.locator("body")).toBeVisible();
      await expectImagesLoaded(page);
      await expectNoHorizontalOverflow(page);
      await expectNoRevealScrollOverflow(page);
      await expectFullLogosKeepRatio(page);
    });
  }

  test("desktop navigation and project type links work", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    await page.getByRole("link", { name: "Qué diseñamos" }).first().click();
    await expect(page).toHaveURL(/\/que-disenamos$/);
    await page.getByRole("link", { name: /Balcones y terrazas verdes/ }).first().click();
    await expect(page).toHaveURL(/\/que-disenamos\/balcones-y-terrazas-verdes$/);
    await expect(page.getByRole("heading", { name: "Balcones y terrazas verdes" })).toBeVisible();
  });

  test("mobile menu opens with animation and navigates", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const menu = page.locator("[data-mobile-menu]");
    await expect(menu).toHaveAttribute("aria-hidden", "true");
    await expect(menu).toHaveClass(/max-h-0/);

    await page.getByRole("button", { name: "Abrir menú" }).click();
    await expect(menu).toHaveAttribute("aria-hidden", "false");
    await expect(menu).toHaveClass(/duration-300/);
    await expect(menu).toHaveClass(/max-h-96/);
    await expect(page.getByRole("link", { name: "Proyectos" })).toBeVisible();

    await page.getByRole("link", { name: "Proyectos" }).click();
    await expect(page).toHaveURL(/\/proyectos$/);
    await expect(page.getByRole("heading", { name: "Estamos preparando esta sección" })).toBeVisible();
  });

  test("contact form shows thank-you state", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/contacto");
    await page.getByLabel("Nombre").fill("Persona Test");
    await page.getByLabel("Email").fill("persona@example.com");
    await page.getByLabel("Tipo de proyecto").selectOption("patio");
    await page.getByLabel("Contanos sobre tu espacio").fill("Quiero revisar el jardín.");
    await page.getByRole("button", { name: "Enviar consulta" }).click();
    await expect(page.getByRole("heading", { name: "Gracias por escribirnos" })).toBeVisible();
  });

  test("section pages place the return link before page content", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });

    const cases = [
      { route: "/que-disenamos", label: "Inicio", href: "/" },
      { route: "/que-disenamos/balcones-y-terrazas-verdes", label: "Qué diseñamos", href: "/que-disenamos" },
      { route: "/proyectos", label: "Inicio", href: "/" },
      { route: "/nuestra-mirada", label: "Inicio", href: "/" },
      { route: "/contacto", label: "Inicio", href: "/" },
    ];

    for (const item of cases) {
      await page.goto(item.route);
      await expectReturnLinkBeforeHeading(page, item.label, item.href);
    }
  });

  test("homepage reveal animations activate on scroll", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");

    const reveals = page.locator("[data-reveal]");
    await expect.poll(() => reveals.count()).toBeGreaterThan(4);

    const firstHiddenIndex = await reveals.evaluateAll((elements) =>
      elements.findIndex((element) => element.getAttribute("data-visible") === "false"),
    );
    expect(firstHiddenIndex).toBeGreaterThanOrEqual(0);

    const target = reveals.nth(firstHiddenIndex);
    await target.scrollIntoViewIfNeeded();
    await expect(target).toHaveAttribute("data-visible", "true", { timeout: 3000 });

    const transitionDuration = await target.evaluate((element) => {
      const animatedElement = element.firstElementChild ?? element;
      return getComputedStyle(animatedElement).transitionDuration;
    });
    expect(transitionDuration).not.toBe("0s");
  });

  test("scroll reveals use slower mobile timing", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const reveals = page.locator("[data-reveal]");
    const target = reveals.first();
    await target.scrollIntoViewIfNeeded();
    await expect(target).toHaveAttribute("data-visible", "true", { timeout: 3000 });

    const duration = await target.evaluate((element) => {
      const animatedElement = element.firstElementChild ?? element;
      return Number.parseFloat(getComputedStyle(animatedElement).transitionDuration);
    });
    expect(duration).toBeGreaterThanOrEqual(1.2);
  });

  test("nuestra mirada and project heroes use image-scale and title fade animations", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });

    for (const route of ["/nuestra-mirada", "/proyectos"]) {
      await page.goto(route);
      const animations = await page.locator("section").first().evaluate((section) =>
        Array.from(section.querySelectorAll("div"))
          .map((element) => getComputedStyle(element).animationName)
          .filter((name) => name !== "none"),
      );

      expect(animations).toContain("scaleReveal");
      expect(animations).toContain("fadeUp");
    }
  });

  test("que disenamos top header fades in without a hero photo", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/que-disenamos");

    const headerCopy = page.locator("[data-page-header-copy]");
    await expect(headerCopy).toBeVisible();
    const animationName = await headerCopy.evaluate((element) => getComputedStyle(element).animationName);
    expect(animationName).toBe("fadeUp");
    await expect(page.locator("header img")).toHaveCount(0);
  });

  test("prominent public headings do not end with periods", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });

    for (const route of routes) {
      await page.goto(route);
      const headings = await page.locator("h1, h2, h3").evaluateAll((elements) =>
        elements.map((element) => element.textContent?.trim()).filter(Boolean),
      );

      for (const heading of headings) {
        expect(heading!.endsWith(".")).toBe(false);
      }
    }
  });

  test("contact founder name images are readable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/contacto");

    const nameImages = page.locator('img[alt="Isabella de Sousa"], img[alt="Heidi Ignatov"]');
    await expect(nameImages).toHaveCount(2);

    const heights = await nameImages.evaluateAll((images) => images.map((image) => image.getBoundingClientRect().height));
    for (const height of heights) {
      expect(height).toBeGreaterThanOrEqual(31);
    }
  });

  test("contact founder labels sit above the name images", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/contacto");

    const blocks = page.locator("[data-founder-name]");
    await expect(blocks).toHaveCount(2);

    const positions = await blocks.evaluateAll((elements) =>
      elements.map((element) => {
        const label = element.querySelector("span")!.getBoundingClientRect();
        const image = element.querySelector("img")!.getBoundingClientRect();
        return { labelTop: label.top, imageTop: image.top };
      }),
    );

    for (const position of positions) {
      expect(position.labelTop).toBeLessThan(position.imageTop);
    }
  });

  test("contact desktop form starts below the title area", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/contacto");

    const [titleBox, formBox] = await Promise.all([
      page.locator("h1").first().boundingBox(),
      page.locator("[data-contact-form]").boundingBox(),
    ]);

    expect(titleBox).not.toBeNull();
    expect(formBox).not.toBeNull();
    expect(formBox!.y).toBeGreaterThan(titleBox!.y + titleBox!.height - 1);
  });

  test("root opts into Next scroll behavior override for route changes", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-scroll-behavior", "smooth");

    const iconHrefs = await page.locator('link[rel*="icon"]').evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")),
    );
    expect(iconHrefs).toContain("/palma/palma-19.png");
    expect(iconHrefs).not.toContain("/favicon.ico");

    await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(800);
    await page.getByRole("link", { name: "Proyectos" }).first().click();
    await expect(page).toHaveURL(/\/proyectos$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(140);
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

  test("admin dashboard uses page tabs and wide card grids", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await loginAdmin(page);

    await expect(page.getByRole("tab", { name: /Home/ })).toBeVisible();
    await expect(page.getByRole("tab", { name: /diseñamos/ })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Nuestra mirada/ })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Contacto/ })).toBeVisible();

    await page.getByRole("tab", { name: /diseñamos/ }).click();
    await expect(page.getByRole("heading", { name: /diseñamos/ })).toBeVisible();
    await expect(page.locator("[data-admin-card-grid] form")).toHaveCount(8);

    const gridColumns = await page.locator("[data-admin-card-grid]").evaluate((element) =>
      getComputedStyle(element).gridTemplateColumns.split(" ").length,
    );
    expect(gridColumns).toBeGreaterThanOrEqual(2);
  });

  test("admin dashboard is responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAdmin(page);
    await expectNoHorizontalOverflow(page);
    await expect(page.getByRole("tab", { name: /Home/ })).toBeVisible();
    await expect(page.locator("[data-admin-card-grid] form")).toHaveCount(2);

    const gridColumns = await page.locator("[data-admin-card-grid]").evaluate((element) =>
      getComputedStyle(element).gridTemplateColumns.split(" ").length,
    );
    expect(gridColumns).toBe(1);

    const firstCard = page.locator("[data-admin-card-grid] form").first();
    await firstCard.getByRole("button", { name: "Editar" }).click();
    await expect(firstCard).toHaveAttribute("data-editing", "true");
    await expect(firstCard.locator('input[name="image"]')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("admin image controls are hidden until edit mode and cancel restores preview", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await loginAdmin(page);

    const heroCard = page.locator("form").filter({ hasText: "hero" }).first();
    await expect(heroCard).toHaveAttribute("data-editing", "false");
    await expect(heroCard.locator('input[name="image"]')).toHaveCount(0);
    await expect(heroCard.getByRole("button", { name: "Editar" })).toBeVisible();
    await expect(heroCard.getByRole("button", { name: "Guardar" })).toHaveCount(0);
    await expect(heroCard.getByRole("button", { name: "Cancelar" })).toHaveCount(0);

    await heroCard.getByRole("button", { name: "Editar" }).click();
    await expect(heroCard).toHaveAttribute("data-editing", "true");
    await expect(heroCard.locator('input[name="image"]')).toBeVisible();
    await expect(heroCard.getByRole("button", { name: "Cancelar" })).toBeVisible();
    await expect(heroCard.getByRole("button", { name: "Guardar" })).toHaveCount(0);

    await heroCard.locator('input[name="image"]').setInputFiles(path.join(process.cwd(), "public", "palma", "palma-03.jpg"));
    await expect(heroCard.getByRole("img", { name: /Patio|Jardín|Jardin|Imagen/ })).toBeVisible();
    await expect(heroCard.getByText("Vista previa")).toBeVisible();
    await expect(heroCard.getByRole("button", { name: "Guardar" })).toBeVisible();

    await heroCard.getByRole("button", { name: "Cancelar" }).click();
    await expect(heroCard).toHaveAttribute("data-editing", "false");
    await expect(heroCard.getByText("Vista previa")).toHaveCount(0);
    await expect(heroCard.getByRole("button", { name: "Guardar" })).toHaveCount(0);
    await expect(heroCard.locator('input[name="image"]')).toHaveCount(0);
  });

  test("project type alt text stays hidden from the editing UI", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await loginAdmin(page);
    await page.getByRole("tab", { name: /diseñamos/ }).click();

    const projectCard = page.locator("form").filter({ hasText: "balcones-y-terrazas-verdes" }).first();
    await expect(projectCard.getByText("image-1")).toHaveCount(0);
    await expect(projectCard.locator('input[name="alt"]')).toHaveCount(0);

    await projectCard.getByRole("button", { name: "Editar" }).click();
    await expect(projectCard.locator('input[name="alt"][type="text"]')).toHaveCount(0);
    await expect(projectCard.locator('input[name="alt"][type="hidden"]')).toHaveValue("image-1");
    await expect(projectCard.getByText("image-1")).toHaveCount(0);
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
    await loginAdmin(page);

    const heroCard = page.locator("form").filter({ hasText: "hero" }).first();
    await heroCard.getByRole("button", { name: "Editar" }).click();
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
