import ApiResponseMessage from "@/app/types/apiResponseMessage";

export default function handleMongooseValidationError(error:any){
     if (error instanceof Error && (error as any).name === 'ValidationError') {
            const messages = Object.values((error as any).errors).map((err: any) => err.message);
            return ApiResponseMessage({
                success: false,
                statusCode: 400,
                message: messages.join(', ')
            });
        }

        return null;
}