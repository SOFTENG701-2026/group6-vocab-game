import type { Ingredient } from "@/lib/game/types";

export const ingredientBank: Ingredient[] = [
  { id: "apple", name: "Apple", emoji: "🍎", color: "Red", colorValue: "#f34141", category: "fruit", trait: "red and sweet", spell: "A-P-P-L-E" },
  { id: "banana", name: "Banana", emoji: "🍌", color: "Yellow", colorValue: "#ffd83f", category: "fruit", trait: "yellow and sweet", spell: "B-A-N-A-N-A" },
  { id: "carrot", name: "Carrot", emoji: "🥕", color: "Orange", colorValue: "#ff7b22", category: "vegetable", trait: "orange and crunchy", spell: "C-A-R-R-O-T" },
  { id: "grape", name: "Grape", emoji: "🍇", color: "Purple", colorValue: "#8653d8", category: "fruit", trait: "purple and juicy", spell: "G-R-A-P-E" },
  { id: "pear", name: "Pear", emoji: "🍐", color: "Green", colorValue: "#65c84c", category: "fruit", trait: "green and sweet", spell: "P-E-A-R" },
  { id: "corn", name: "Corn", emoji: "🌽", color: "Yellow", colorValue: "#f5c833", category: "vegetable", trait: "yellow and tasty", spell: "C-O-R-N" },
  { id: "orange", name: "Orange", emoji: "🍊", color: "Orange", colorValue: "#ff8a24", category: "fruit", trait: "orange and juicy", spell: "O-R-A-N-G-E" },
  { id: "tomato", name: "Tomato", emoji: "🍅", color: "Red", colorValue: "#ef3d36", category: "vegetable", trait: "red and soft", spell: "T-O-M-A-T-O" },
  { id: "broccoli", name: "Broccoli", emoji: "🥦", color: "Green", colorValue: "#38b949", category: "vegetable", trait: "green and crunchy", spell: "B-R-O-C-C-O-L-I" },
  { id: "watermelon", name: "Watermelon", emoji: "🍉", color: "Green", colorValue: "#52bf55", category: "fruit", trait: "green and sweet", spell: "W-A-T-E-R-M-E-L-O-N" },
  { id: "pineapple", name: "Pineapple", emoji: "🍍", color: "Yellow", colorValue: "#f5c833", category: "fruit", trait: "yellow and sweet", spell: "P-I-N-E-A-P-P-L-E" },
  { id: "blueberry", name: "Blueberry", emoji: "🫐", color: "Blue", colorValue: "#4974df", category: "fruit", trait: "blue and juicy", spell: "B-L-U-E-B-E-R-R-Y" }
];

export const distractorColors: [string, string][] = [
  ["Red", "#f34141"],
  ["Yellow", "#ffd83f"],
  ["Orange", "#ff7b22"],
  ["Purple", "#8653d8"],
  ["Green", "#65c84c"],
  ["Blue", "#37a9f4"]
];

export const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
