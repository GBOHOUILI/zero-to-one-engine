import { describe, it, expect } from "vitest";
import { hexToRgba } from "./charts";

describe("hexToRgba", () => {
  it("convertit une couleur hexadécimale en rgba avec l'alpha donné", () => {
    expect(hexToRgba("#2f81d3", 0.5)).toBe("rgba(47,129,211,0.5)");
  });

  it("gère le noir et le blanc", () => {
    expect(hexToRgba("#000000", 1)).toBe("rgba(0,0,0,1)");
    expect(hexToRgba("#ffffff", 1)).toBe("rgba(255,255,255,1)");
  });
});
