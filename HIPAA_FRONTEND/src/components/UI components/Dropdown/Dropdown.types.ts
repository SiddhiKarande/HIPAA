import { Dispatch, SetStateAction } from "react";

export interface DropdownProps { 
    items: string[];
    showFilter: boolean;
    setFilter: Dispatch<SetStateAction<string>>; 
    onClick: Dispatch<SetStateAction<boolean>>;
} 
