export interface ThoughtVariable {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  description: string;
}

export interface ThoughtOutcome {
  id: string;
  title: string;
  description: string;
  causalPath: string[]; // IDs of variables that led to this
  logicBasis: string;
}

export interface ThoughtScenario {
  id: string;
  conceptId: string;
  title: string;
  description: string;
  initialVariables: ThoughtVariable[];
  possibleOutcomes: ThoughtOutcome[];
  logicModel: (variables: ThoughtVariable[]) => ThoughtOutcome;
}

export interface ThoughtExperimentLog {
  id: string;
  scenarioId: string;
  timestamp: string;
  variableSettings: Record<string, number>;
  predictedOutcomeId?: string;
  actualOutcomeId: string;
  isCounterExample: boolean;
}

export interface MasteryProfile {
  score: number;
  consistency: number;
  applicationPower: number;
  responseTime: number;
  radarData: { subject: string; value: number }[];
  recommendedPath: string[];
}
