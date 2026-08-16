/**
 * Busca tolerante de nomes.
 *
 * O convite é procurado pelo convidado, que digita o nome como ELE se chama —
 * não como foi cadastrado. "Beatriz Miron" pode ter entrado na lista como
 * "Bia Miron"; alguém digita "bea" e precisa encontrar assim mesmo.
 *
 * O casamento do nome é feito por token (cada pedaço do nome), combinando:
 *   1. igualdade após normalizar (sem acento, sem pontuação, minúsculas);
 *   2. apelido conhecido — beatriz ↔ bia ↔ bea (tabela abaixo);
 *   3. prefixo — "bea" encontra "beatriz", "rafa" encontra "rafael";
 *   4. erro de digitação — distância de edição pequena ("jose" ↔ "joze").
 */

/** Remove acentos, pontuação e caixa: "José D'Ávila" → "jose d avila". */
export const normalize = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Partículas de sobrenome não identificam ninguém — fora da comparação. */
const STOPWORDS = new Set(["de", "da", "do", "das", "dos", "e", "di", "del", "van", "von"]);

export const tokenize = (value: string): string[] =>
  normalize(value)
    .split(" ")
    .filter((t) => t.length > 0 && !STOPWORDS.has(t));

/**
 * Grupos de variações do mesmo nome. Todas as formas de um grupo apontam para
 * a mesma chave canônica, então qualquer uma encontra qualquer outra.
 * Uma forma pode aparecer em vários grupos ("lu", "fe") — por isso o índice
 * guarda um conjunto de canônicos e o casamento é por interseção.
 */
const NICKNAME_GROUPS: string[][] = [
  ["adriana", "adriano", "adri", "dri"],
  ["alessandra", "alessandro", "ale", "sandrinha"],
  ["alexandre", "alexandra", "alex", "xande", "xandi"],
  ["amanda", "manda", "mandinha"],
  ["ana", "aninha", "any"],
  ["andre", "andrea", "andreia", "dede", "deia"],
  ["antonio", "antonia", "toninho", "tonho", "toni", "tonia"],
  ["arthur", "artur", "tuca", "tutu"],
  ["beatriz", "bia", "bea", "biah", "beta", "biazinha", "trix"],
  ["bianca", "bibi", "bi"],
  ["bruno", "bruna", "bru", "bruninho", "bruninha"],
  ["camila", "camile", "camilla", "cami", "mila"],
  ["carlos", "carlinhos", "carlao", "carla", "cacau"],
  ["cesar", "cesinha"],
  ["claudio", "claudia", "claudinha", "cau", "clau"],
  ["cristina", "cristiane", "cristiano", "cris", "tina"],
  ["daniel", "daniela", "danilo", "dani", "dan"],
  ["diego", "die", "dieguinho"],
  ["eduardo", "eduarda", "edu", "dudu", "duda", "dado"],
  ["elaine", "lai", "lel"],
  ["emanuel", "emanuela", "manu", "manuzinha"],
  ["fabio", "fabiana", "fabiano", "fabi", "fabinho"],
  ["felipe", "filipe", "phelipe", "lipe", "fe"],
  ["fernando", "fernanda", "nando", "nanda", "fe", "fefe"],
  ["francisco", "francisca", "chico", "chica", "fran", "francis"],
  ["gabriel", "gabriela", "gabi", "biel", "gab"],
  ["giovana", "giovanna", "giovani", "gi", "giva"],
  ["guilherme", "gui", "guiga", "gil"],
  ["gustavo", "guto", "gu", "guga"],
  ["henrique", "rique", "riquinho", "kiko", "hen"],
  ["igor", "igorzinho"],
  ["isabel", "isabela", "isabella", "isabelle", "bela", "isa", "belinha"],
  ["jessica", "jess", "je"],
  ["joao", "joaozinho", "jao"],
  ["joana", "joaninha", "jo"],
  ["jose", "ze", "zezinho", "juca", "zeca"],
  ["juliana", "julia", "julio", "ju", "juju", "juli"],
  ["karina", "carina", "kari", "kaka"],
  ["larissa", "lari", "lala"],
  ["leonardo", "leo", "leozinho", "leandro"],
  ["leticia", "leti", "le", "lele"],
  ["lucas", "luquinhas", "luca", "lu"],
  ["luciana", "luciano", "luci", "lu", "lucia"],
  ["luana", "lua", "lu", "luh"],
  ["luiz", "luis", "luiza", "luisa", "lu", "luizinho"],
  ["manoel", "manuel", "mane", "nel"],
  ["marcelo", "marcela", "celo", "marcelinho", "cela"],
  ["marcos", "marco", "marquinhos", "marcio", "marcia"],
  ["margarida", "maga", "marga"],
  ["maria", "mari", "mary", "meri", "maricota"],
  ["mariana", "mari", "mary", "nana", "mariane"],
  ["matheus", "mateus", "matt", "teteu", "mat"],
  ["michele", "michelle", "mi", "mich", "mihh"],
  ["monica", "moni", "mo"],
  ["natalia", "natalie", "nat", "naty", "nati"],
  ["nicoly", "nicole", "nicolly", "nick", "nicky", "nico", "ni"],
  ["patricia", "paty", "pati", "patty", "pat"],
  ["paulo", "paula", "paulinho", "paulinha", "pau"],
  ["pedro", "pedrinho", "pepe", "pedrao"],
  ["rafael", "rafaela", "rafa", "rafinha"],
  ["raquel", "rachel", "kel", "quel"],
  ["renata", "renato", "re", "renatinha", "renatinho"],
  ["ricardo", "ricardinho", "ric", "rick", "cadu"],
  ["roberto", "roberta", "beto", "betinho", "bob", "betao"],
  ["rodrigo", "digo", "rod", "rodriguinho"],
  ["rosangela", "rosa", "rose", "rosinha"],
  ["samuel", "samuela", "samu", "sam"],
  ["sandra", "sandro", "sandrinha", "san"],
  ["sebastiao", "tiao", "bastiao"],
  ["silvia", "silvio", "sil", "silvinha"],
  ["simone", "si", "mone", "simo"],
  ["sofia", "sophia", "sofi", "so"],
  ["tatiane", "tatiana", "tati", "tata"],
  ["teresa", "tereza", "tere", "tetê"],
  ["tiago", "thiago", "ti", "tiaguinho"],
  ["vanessa", "vane", "va", "nessa"],
  ["viviane", "vivian", "vivi", "vi"],
  ["vitor", "victor", "vitoria", "victoria", "vi", "vitinho", "vic"],
  ["wagner", "waguinho", "wag"],
  ["william", "willian", "will", "wil"],
];

const NICKNAME_INDEX: Map<string, Set<string>> = (() => {
  const index = new Map<string, Set<string>>();
  for (const group of NICKNAME_GROUPS) {
    const canonical = normalize(group[0]);
    for (const form of group) {
      const key = normalize(form);
      const set = index.get(key) ?? new Set<string>();
      set.add(canonical);
      index.set(key, set);
    }
  }
  return index;
})();

/**
 * Diminutivos regulares ("carlinhos" → "carl", "mariazinha" → "maria") viram
 * o radical, cobrindo apelidos que não estão na tabela.
 */
const stripDiminutive = (token: string): string =>
  token.replace(/(zinho|zinha|inho|inha|ito|ita)$/, "");

const canonicalsOf = (token: string): Set<string> => {
  const direct = NICKNAME_INDEX.get(token);
  if (direct) return direct;
  const stem = stripDiminutive(token);
  return NICKNAME_INDEX.get(stem) ?? new Set([stem || token]);
};

const sharesCanonical = (a: string, b: string): boolean => {
  const setA = canonicalsOf(a);
  for (const value of canonicalsOf(b)) if (setA.has(value)) return true;
  return false;
};

/** Distância de Levenshtein com duas linhas (basta para nomes curtos). */
export const levenshtein = (a: string, b: string): number => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = curr;
  }
  return prev[b.length];
};

/** Quanto um token digitado casa com um token cadastrado (0 a 1). */
const tokenScore = (query: string, target: string): number => {
  if (query === target) return 1;
  if (sharesCanonical(query, target)) return 0.95;

  const [short, long] = query.length <= target.length ? [query, target] : [target, query];
  if (short.length >= 3 && long.startsWith(short)) return 0.88;
  // Abreviações de 2 letras ("bi", "ju") só valem como prefixo exato do começo.
  if (short.length === 2 && long.startsWith(short)) return 0.62;

  const distance = levenshtein(query, target);
  const ratio = 1 - distance / Math.max(query.length, target.length);
  // Um erro de digitação em nome de 5+ letras ainda casa; nomes curtos, não.
  if (distance <= 2 && ratio >= 0.7) return ratio * 0.8;

  if (long.includes(short) && short.length >= 4) return 0.6;
  return 0;
};

/**
 * Score de um nome inteiro contra o que foi digitado (0 a 1). Cada token da
 * busca precisa achar seu par no nome; o resultado é a média dos melhores
 * pares, com um bônus quando o casamento acontece no primeiro nome.
 */
export const nameScore = (query: string, target: string): number => {
  const queryTokens = tokenize(query);
  const targetTokens = tokenize(target);
  if (!queryTokens.length || !targetTokens.length) return 0;

  let sum = 0;
  for (const [i, qt] of queryTokens.entries()) {
    let best = 0;
    for (const [j, tt] of targetTokens.entries()) {
      let score = tokenScore(qt, tt);
      if (i === 0 && j === 0) score = Math.min(1, score * 1.05);
      best = Math.max(best, score);
    }
    sum += best;
  }
  return sum / queryTokens.length;
};

/** Acima disto o nome é considerado encontrado. */
export const MATCH_THRESHOLD = 0.6;

export const matchesName = (query: string, target: string): boolean =>
  nameScore(query, target) >= MATCH_THRESHOLD;

/**
 * Melhor score entre vários nomes (líder da família + cada convidado).
 * Uma família aparece na busca pelo membro que melhor casa com o termo.
 */
export const bestScore = (query: string, targets: string[]): number =>
  targets.reduce((best, t) => Math.max(best, nameScore(query, t)), 0);
