import type { ColorOption, ShapeOption } from "@/domain/ingredients-match-type";

export const colorOptions: ColorOption[] = [
  { id: "red", label: "Red", value: "#EF4444" },
  { id: "yellow", label: "Yellow", value: "#FACC15" },
  { id: "orange", label: "Orange", value: "#FB923C" }
];

export const shapeOptions: ShapeOption[] = [
  { id: "circle", label: "Circle", imageSrc: "/ingredients/apple-outline.png" },
  { id: "crescent", label: "Crescent", imageSrc: "/ingredients/banana-outline.png" },
  { id: "triangle", label: "Triangle", imageSrc: "/ingredients/watermelon-outline.png" },
  { id: "heart", label: "Heart", imageSrc: "/ingredients/strawberry-outline.png" },
  { id: "cone", label: "Cone", imageSrc: "/ingredients/carrot-outline.png" }
];
