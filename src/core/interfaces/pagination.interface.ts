export interface pagination {
    page: number
    limit: number
    sort: string
    sortBy: ['decs', 'asc']
    [index: string]: any
}