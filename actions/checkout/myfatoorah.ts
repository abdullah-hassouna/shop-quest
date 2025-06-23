// actions/myfatoorah.ts
"use server";

export async function createMyFatoorahPayment({
  invoiceValue,
  customerName,
  customerEmail,
  paymentMethodId,
}: {
  invoiceValue: number;
  customerName: string;
  customerEmail: string;
  paymentMethodId: number;
}) {
  const res = await fetch(`${process.env.MYFATOORAH_BASE_URL}/v2/ExecutePayment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MYFATOORAH_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      PaymentMethodId: paymentMethodId,
      CustomerName: customerName,
      DisplayCurrencyIso: "KWD", // Or SAR, USD
      CustomerEmail: customerEmail,
      InvoiceValue: invoiceValue,
      CallBackUrl: "https://yourdomain.com/payment-success",
      ErrorUrl: "https://yourdomain.com/payment-failed",
      Language: "en",
      CustomerReference: "ORDER_1234",
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.IsSuccess) {
    throw new Error(data?.Message || "Failed to initiate payment");
  }

  return data.Data.PaymentURL;
}
