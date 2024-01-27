export interface IAssignment {
  _id?: string;
  actives: string[];
  details?: string;
  dateOfStart: Date;
  dateOfEnd: Date;
  responsible: string;
  condition: AssignmentConditionType;
}

type AssignmentConditionType = 'finish' | 'in_progress';
