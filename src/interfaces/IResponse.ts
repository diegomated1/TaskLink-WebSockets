export interface IResponse<T>{
    value: T | null
    errors: string[]
    success: boolean
}