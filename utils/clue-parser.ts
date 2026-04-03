import { ClueData } from "@/data/clues";

type SegmentType = 'definition' | 'indicator' | 'fodder' | 'text';

export interface TextSegment {
  text: string;
  type: SegmentType;
}

type ClueIndices = {
  definitionIndices?: [number, number];
  indicatorIndices?: [number, number];
  fodderIndices?: [number, number];
};

export function parseClueSegments(clue: ClueData & ClueIndices, activeLayers: { def: boolean, ind: boolean, fod: boolean }): TextSegment[] {
  const segments: TextSegment[] = [];
  const fullText = clue.clueText;
  
  // Map each character to a segment type. Ranges may touch or be adjacent.
  const charMap: SegmentType[] = new Array(fullText.length).fill('text') as SegmentType[];

  if (activeLayers.def && clue.definitionIndices) {
    for (let i = clue.definitionIndices[0]; i < clue.definitionIndices[1]; i++) charMap[i] = 'definition';
  }
  if (activeLayers.ind && clue.indicatorIndices) {
    for (let i = clue.indicatorIndices[0]; i < clue.indicatorIndices[1]; i++) charMap[i] = 'indicator';
  }
  if (activeLayers.fod && clue.fodderIndices) {
    for (let i = clue.fodderIndices[0]; i < clue.fodderIndices[1]; i++) charMap[i] = 'fodder';
  }

  // Handle empty clue text
  if (fullText.length === 0) return segments;

  // Group consecutive characters with the same type into text segments
  let currentType: SegmentType = charMap[0];
  let currentText = "";

  for (let i = 0; i < fullText.length; i++) {
    if (charMap[i] === currentType) {
      currentText += fullText[i];
    } else {
      segments.push({ text: currentText, type: currentType });
      currentType = charMap[i];
      currentText = fullText[i];
    }
  }
  segments.push({ text: currentText, type: currentType });

  return segments;
}
