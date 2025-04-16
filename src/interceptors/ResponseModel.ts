interface SuccessResponseType{
    message:string;
    status:number;
    data:unknown
}
interface ErrorResponseType extends Omit<SuccessResponseType,"data">{
    error:unknown;
}
interface ResponseGenParams{
    status?:number;
    message?:string;
}

export class ResponseModel{
    private _data:unknown

    constructor(data:unknown){
        this._data = data;
    }

    public success({message="Success",status=200}:ResponseGenParams){
       const response:SuccessResponseType={
        data:this._data,
        status,
        message
       }
       return response;
    }

    public error({message="Error occurred",status=400}:ResponseGenParams){
        const response:ErrorResponseType={
            error:this._data,
            message,
            status
        }
        return response
    }
}