export type TextRange = {
  start: number;
  end: number;
};

export type ClueComponent = {
  ranges: TextRange[];
  explanation: string;
};

export type ClueData = {
  id: string;
  clueText: string;
  answer: string;
  enumeration: string;
  
  definition: ClueComponent;
  indicator?: ClueComponent;
  fodder?: ClueComponent;
};

export const CLUES: ClueData[] = [
  {
    id: "mc-001",
    clueText: "Aligagang ina, hindi pwede ang madilim!",
    answer: "Anino",
    enumeration: "5",
    definition: {
      ranges: [{ start: 31, end: 38 }],
      explanation: "The definition is 'madilim' (dark/shadow)."
    },
    indicator: {
      ranges: [{ start: 0, end: 9 }],
      explanation: "'Aligaga' is the anagram indicator."
    },
    fodder: {
      ranges: [
        { start: 10, end: 13 },
        { start: 15, end: 27 }
      ],
      explanation: "Anagram of 'INA' (ANI) + 'HINDI PWEDE' (NO)."
    },
  },
  {
    id: "mc-002",
    clueText: "Paboritong panghimagas ng yelong cream?",
    answer: "ICE CREAM",
    enumeration: "3, 5",
    definition: {
      ranges: [{ start: 0, end: 20 }],
      explanation: "Definition is 'Favorite dessert'."
    },
    fodder: {
      ranges: [{ start: 24, end: 36 }],
      explanation: "Literal translation of the answer parts."
    }
  },
];
