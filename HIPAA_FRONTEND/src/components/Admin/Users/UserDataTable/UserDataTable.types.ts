export interface UserDataTableProps<T> { 
    columns: ColumnProps[];
    userData: T[];
    renderAction:any
} 

export interface ColumnProps {
    columnName: string; 
    id: string | string[]; 
}
