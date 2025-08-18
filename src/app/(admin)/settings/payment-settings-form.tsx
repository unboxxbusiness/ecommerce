
'use client';

import { CardDescription, CardTitle } from "@/components/ui/card";

export function PaymentSettingsForm() {
  
  return (
    <div className="space-y-4">
      <div>
        <CardTitle className="text-lg">Razorpay Configuration</CardTitle>
        <CardDescription>
          To enable payments, you must configure your Razorpay API keys as environment variables. Please see the Setup tab for instructions.
        </CardDescription>
      </div>
    </div>
  );
}
