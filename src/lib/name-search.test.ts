import { describe, it, expect } from "vitest";
import {
  matchesName,
  nameScore,
  normalize,
  tokenize,
  bestScore,
  normalizePhone,
  phoneScore,
} from "./name-search";

describe("normalize / tokenize", () => {
  it("remove acentos, pontuação e caixa", () => {
    expect(normalize("José D'Ávila")).toBe("jose d avila");
  });

  it("descarta partículas de sobrenome", () => {
    expect(tokenize("Maria da Silva dos Santos")).toEqual(["maria", "silva", "santos"]);
  });
});

describe("matchesName", () => {
  it("encontra quem foi cadastrado pelo apelido", () => {
    expect(matchesName("beatriz", "Bia Miron")).toBe(true);
    expect(matchesName("bea", "Bia Miron")).toBe(true);
    expect(matchesName("beatriz miron", "Bia Miron")).toBe(true);
  });

  it("encontra quem foi cadastrado pelo nome completo mas é chamado pelo apelido", () => {
    expect(matchesName("bia", "Beatriz Miron")).toBe(true);
    expect(matchesName("ze", "José Carlos")).toBe(true);
    expect(matchesName("duda", "Eduarda Lima")).toBe(true);
  });

  it("ignora acentos e caixa", () => {
    expect(matchesName("jose", "José Carlos")).toBe(true);
    expect(matchesName("ANDREA", "andréa souza")).toBe(true);
  });

  it("aceita prefixo do nome", () => {
    expect(matchesName("rafa", "Rafael Souza")).toBe(true);
    expect(matchesName("gui", "Guilherme Alves")).toBe(true);
  });

  it("tolera erro de digitação", () => {
    expect(matchesName("joze", "José Carlos")).toBe(true);
    expect(matchesName("beatris", "Beatriz Miron")).toBe(true);
    expect(matchesName("guilerme", "Guilherme Alves")).toBe(true);
  });

  it("encontra pelo sobrenome", () => {
    expect(matchesName("miron", "Bia Miron")).toBe(true);
  });

  it("não casa nomes diferentes", () => {
    expect(matchesName("beatriz", "Carlos Silva")).toBe(false);
    expect(matchesName("joao", "Maria Souza")).toBe(false);
    expect(matchesName("pedro alves", "Paulo Nunes")).toBe(false);
  });

  it("exige que todos os termos digitados casem", () => {
    expect(matchesName("bia carvalho", "Bia Miron")).toBe(false);
  });
});

describe("ranking", () => {
  it("prioriza o nome exato sobre o apelido", () => {
    expect(nameScore("beatriz", "Beatriz Miron")).toBeGreaterThan(
      nameScore("beatriz", "Bia Miron"),
    );
  });

  it("bestScore usa o melhor membro da família", () => {
    const familia = ["Carlos Miron", "Bia Miron", "Pedro Miron"];
    expect(bestScore("beatriz", familia)).toBeGreaterThanOrEqual(0.6);
    expect(bestScore("mariana", familia)).toBeLessThan(0.6);
  });
});

describe("normalizePhone / phoneScore", () => {
  it("mantém só os dígitos", () => {
    expect(normalizePhone("(11) 98888-7777")).toBe("11988887777");
  });

  it("casa o número exato", () => {
    expect(phoneScore("11988887777", "11988887777")).toBe(1);
  });

  it("casa mesmo com formatação diferente", () => {
    expect(phoneScore("(11) 98888-7777", "11988887777")).toBe(1);
  });

  it("casa sem o DDI quando o cadastro tem +55", () => {
    expect(phoneScore("11988887777", "+55 11 98888-7777")).toBeGreaterThan(0);
  });

  it("casa sem o nono dígito", () => {
    expect(phoneScore("1188887777", "11988887777")).toBeGreaterThan(0);
  });

  it("não casa números diferentes", () => {
    expect(phoneScore("11988887777", "11977776666")).toBe(0);
  });

  it("ignora termos curtos demais para serem telefone", () => {
    expect(phoneScore("123", "11988887777")).toBe(0);
  });
});
