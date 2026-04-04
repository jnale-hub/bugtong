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

  definition: ClueComponent;
  indicator?: ClueComponent;
  fodder?: ClueComponent;
};
