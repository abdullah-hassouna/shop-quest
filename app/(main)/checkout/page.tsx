"use client";

import { useTransition } from "react";
import { createMyFatoorahPayment } from "@/actions/checkout/myfatoorah";

export default function CheckoutPage() {
    const [isPending, startTransition] = useTransition();

    const handlePay = () => {
        startTransition(async () => {
            try {
                const paymentURL = await createMyFatoorahPayment({
                    invoiceValue: 10.0,
                    customerName: "Abdullah Hassouna",
                    customerEmail: "abdullah@example.com",
                    paymentMethodId: 2, // 2 = card, 6 = KNET, 11 = STC, 21 = Apple Pay
                });

                window.location.href = paymentURL;
            } catch (err) {
                console.error(err);
                alert("Failed to start payment.");
            }
        });
    };

    return (
        <div className="p-4">
            <h1 className="text-xl mb-4">Checkout</h1>
            <button
                onClick={handlePay}
                className="bg-black text-white px-6 py-2 rounded"
                disabled={isPending}
            >
                {isPending ? "Redirecting..." : "Pay with MyFatoorah"}
            </button>
        </div>
    );
}
