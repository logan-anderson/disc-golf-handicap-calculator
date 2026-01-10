export interface Course {
  name: string;
  parRating: number;
  holes: number;
}

export const courses: Course[] = [
  {
    name: "Montgomery Park Aceplace (9 hole layout)",
    parRating: 130,
    holes: 9,
  },
  {
    name: "Haute Goat - Fling's Aceplace 25 ( 18 hole layout)",
    parRating: 144,
    holes: 18,
  },
  {
    name: "Bolender Aceplace (9 hole layout)",
    parRating: 116,
    holes: 9,
  },
  {
    name: "Dartmouth Commons Disc Golf Course (9 hole layout)",
    holes: 9,
    parRating: 144,
  }
];
