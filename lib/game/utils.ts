export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function shuffle<T>(items: T[], round: number): T[] {
  return items
    .map((item, index) => ({ item, sort: (index * 37 + round * 17) % 5 }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}
