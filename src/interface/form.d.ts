export type IFieldStatus = 'todo' | 'in progress' | 'blocker' | 'completed';
export type IFieldType = 'text' | 'email' | 'date' | 'datetime' | 'status';
export type IDynamicField = {
    id: string;
    label: string;
    type: IFieldType;
    required?: boolean;
};