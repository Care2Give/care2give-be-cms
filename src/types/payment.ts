// # TODO: Confirm the request attributes.
export interface PaymentIntentRequest{
    amount: number;
    currency: string;
    payment_method_type: string;
}

export interface PaymentIntentResponse {
    client_secret: string;
}

export interface GetConfigResponse{
    publishable_key: string;
}
