
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"

const PaymentForm = () => {
  const handlePayment = () => {
    // Simulate payment processing
    toast.success("Your booking has been confirmed.");
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8">Payment Details</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="card-number">Card Number</Label>
          <Input id="card-number" placeholder="**** **** **** ****" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiry-date">Expiry Date</Label>
            <Input id="expiry-date" placeholder="MM/YY" />
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input id="cvv" placeholder="***" />
          </div>
        </div>
        <div>
          <Label htmlFor="card-holder">Card Holder Name</Label>
          <Input id="card-holder" placeholder="John Doe" />
        </div>
      </div>

      <Button className="w-full mt-8" onClick={handlePayment}>
        Pay Now
      </Button>
    </div>
  );
};

export default PaymentForm;
