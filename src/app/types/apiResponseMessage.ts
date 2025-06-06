
export interface ApiResponseMessage {
  message: string;
  success: boolean;
  statusCode: number;
  data?: any; // optional if needed
};


export default function ApiResponseMessage({message , success  , statusCode , data} : ApiResponseMessage){
    return Response.json(
        {
            success,
            statusCode,
            message,
            data : data || null
        },
        {
            status : statusCode
        }
    )
}