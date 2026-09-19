import { describe, it, expect } from "vitest";
import { loadRestaurantConfig } from "./configLoader";

describe("loadRestaurantConfig — validation du slug", () => {
  it("charge correctement un restaurant existant avec un slug valide", () => {
    const config = loadRestaurantConfig("pizza-roma");
    expect(config.slug).toBe("pizza-roma");
    expect(config.identity.name).toBeTruthy();
  });

  it("rejette un slug tentant une traversée de répertoire", () => {
    expect(() => loadRestaurantConfig("../../../etc/passwd")).toThrow();
    expect(() => loadRestaurantConfig("..")).toThrow();
  });

  it("rejette un slug contenant un séparateur de chemin", () => {
    expect(() => loadRestaurantConfig("foo/bar")).toThrow();
    expect(() => loadRestaurantConfig("foo\\bar")).toThrow();
  });

  it("rejette un slug avec des majuscules ou caractères spéciaux", () => {
    expect(() => loadRestaurantConfig("Pizza-Roma")).toThrow();
    expect(() => loadRestaurantConfig("pizza roma")).toThrow();
    expect(() => loadRestaurantConfig("pizza_roma")).toThrow();
  });

  it("rejette un slug pour un restaurant qui n'existe pas", () => {
    expect(() => loadRestaurantConfig("restaurant-inexistant")).toThrow(
      /non trouvé/,
    );
  });

  it("détecte l'incohérence de test.json (déclare le slug pizza-roma en interne)", () => {
    expect(() => loadRestaurantConfig("test")).toThrow(
      /Incohérence de données/,
    );
  });

  it("accepte les slugs réels et cohérents du jeu de données", () => {
    expect(() => loadRestaurantConfig("pizza-roma")).not.toThrow();
    expect(() => loadRestaurantConfig("lebon")).not.toThrow();
  });

  // ⚠️ data/restaurants/sofitel.json est actuellement un fichier vide (0 octet).
  // Ce test documente ce problème de données réel plutôt que de le masquer —
  // voir le rapport d'audit : ce fichier doit être rempli avant mise en prod
  // pour ce restaurant, sans quoi /sofitel renvoie une erreur 500.
  it("échoue proprement (sans crasher le process) sur sofitel.json actuellement vide", () => {
    expect(() => loadRestaurantConfig("sofitel")).toThrow();
  });
});
