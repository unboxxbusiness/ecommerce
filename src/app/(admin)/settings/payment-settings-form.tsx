
'use client';

import { CardDescription, CardTitle } from "@/components/ui/card";

export function PaymentSettingsForm() {
  
  return (
    <div className="space-y-4">
      <div>
        <CardTitle className="text-lg">Razorpay Configuration</CardTitle>
        <CardDescription>
          To enable payments, you must configure your Razorpay API keys as environment variables.
        </CardDescription>
      </div>

      <div className="p-4 border rounded-lg bg-muted/50">
        <p className="font-semibold">Follow these steps:</p>
        <ol className="list-decimal list-inside space-y-2 mt-2 text-sm">
          <li>Create a file named <code>.env.local</code> in the root directory of your project (if it doesn't already exist).</li>
          <li>Add the following lines to the file, replacing the placeholder values with your actual keys from the Razorpay dashboard:</li>
        </ol>
        <pre className="mt-4 p-3 bg-background rounded-md text-sm whitespace-pre-wrap">
          <code>
            {`NEXT_PUBLIC_RAZORPAY_KEY_ID=YOUR_KEY_ID\n`}
            {`RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET\n`}
            {`RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET`}
          </code>
        </pre>
         <p className="text-sm mt-4 text-muted-foreground">
          <strong>Important:</strong> After saving the <code>.env.local</code> file, you must restart your development server for the changes to take effect.
        </p>
      </div>
    </div>
  );
}
