export interface PaginationProps {
    pagenumber:number,
    setPageNumber :(pagenumber:number)=>void;
    totalPages:number
}