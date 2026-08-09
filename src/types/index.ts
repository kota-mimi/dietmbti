export interface Question {
  id: number;
  axis: string;
  text: string;
  direction: 'positive' | 'negative';
}

export interface DiagramType {
  name: string;
  emoji: string;
  catchcopy: string;
  basicEcology: string;
  detailedEcology: string;
  fatCause: string;
  solution: string;
  causeTitle: string;
  solutionTitle: string;
  relatable: string[];
  strengths: string;
  compatibility: {
    good: {
      type: string;
      reason: string;
    };
    bad: {
      type: string;
      reason: string;
    };
  };
}

export interface DiagramTypes {
  [key: string]: DiagramType;
}

export interface Answer {
  questionId: number;
  score: number;
}

export interface Score {
  SG: number;
  RE: number;
  FC: number;
  QL: number;
}