export interface PaymentIntentRequest{
    amount: number;
    currency: string;
}

export interface PaymentIntentResponse {
    clientSecret: string | null;
    paymentIntentId: string;
}

export interface GetConfigResponse{
    publishable_key: string;
}

export enum PaymentStatus {
    CREATED = "created",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    CANCELLED = "cancelled",
    PENDING = "pending",
    UNKNOWN = "unknown",
}

export interface HandleWebhookEventResponse {
    paymentStatus: PaymentStatus;
    paymentIntentId: string | undefined;
}