import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface PledgeDialogProps {
  item: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PledgeDialog({ item, open, onOpenChange }: PledgeDialogProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cellNumber, setCellNumber] = useState("");
  const [pledgeType, setPledgeType] = useState<"full" | "partial">("full");
  const [partialAmount, setPartialAmount] = useState("");
  const [popiConsent, setPopiConsent] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const utils = trpc.useUtils();
  const createPledge = trpc.pledges.create.useMutation({
    onSuccess: (data) => {
      setShowSuccess(true);
      toast.success("Thank you for your pledge!");
      utils.items.list.invalidate();
      
      // Reset form after 3 seconds and close dialog
      setTimeout(() => {
        resetForm();
        onOpenChange(false);
        setShowSuccess(false);
      }, 3000);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit pledge");
    },
  });

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setCellNumber("");
    setPledgeType("full");
    setPartialAmount("");
    setPopiConsent(false);
  };

  const formatCurrency = (cents: number) => {
    return `R${(cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const totalPrice = item.price * item.quantity;
  const remaining = totalPrice - item.totalPledged;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!popiConsent) {
      toast.error("You must consent to the POPI Act to continue");
      return;
    }

    const amount = pledgeType === "full" 
      ? remaining / 100 
      : parseFloat(partialAmount);

    if (pledgeType === "partial" && (!amount || amount <= 0)) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > remaining / 100) {
      toast.error(`Amount cannot exceed remaining balance of ${formatCurrency(remaining)}`);
      return;
    }

    createPledge.mutate({
      itemId: item.id,
      fullName,
      email,
      cellNumber,
      amount,
      isFull: pledgeType === "full",
      popiConsent: true,
    });
  };

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-600 mb-4">
              Your pledge has been received. You will receive a confirmation email shortly.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 w-full">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Item:</span> {item.name}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-semibold">Amount:</span>{" "}
                {pledgeType === "full" 
                  ? formatCurrency(remaining)
                  : formatCurrency(parseFloat(partialAmount) * 100)
                }
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Make Your Pledge</DialogTitle>
          <DialogDescription>{item.name}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Cost:</span>
              <span className="font-semibold">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Already Pledged:</span>
              <span className="font-semibold text-orange-600">
                {formatCurrency(item.totalPledged)}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-gray-600">Remaining:</span>
              <span className="font-bold text-gray-900">{formatCurrency(remaining)}</span>
            </div>
          </div>

          {/* Personal Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <Label htmlFor="cellNumber">Cell Number *</Label>
              <Input
                id="cellNumber"
                type="tel"
                value={cellNumber}
                onChange={(e) => setCellNumber(e.target.value)}
                required
                placeholder="0821234567"
              />
            </div>
          </div>

          {/* Pledge Amount */}
          <div className="space-y-3">
            <Label>Pledge Amount *</Label>
            <RadioGroup value={pledgeType} onValueChange={(v) => setPledgeType(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="full" />
                <Label htmlFor="full" className="font-normal cursor-pointer">
                  Full amount ({formatCurrency(remaining)})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partial" id="partial" />
                <Label htmlFor="partial" className="font-normal cursor-pointer">
                  Partial amount
                </Label>
              </div>
            </RadioGroup>

            {pledgeType === "partial" && (
              <div className="ml-6">
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={remaining / 100}
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  placeholder="Enter amount in Rands"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum: {formatCurrency(remaining)}
                </p>
              </div>
            )}
          </div>

          {/* POPI Consent */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="popi"
                checked={popiConsent}
                onCheckedChange={(checked) => setPopiConsent(checked as boolean)}
              />
              <Label htmlFor="popi" className="text-sm font-normal cursor-pointer leading-relaxed">
                I consent to the collection and processing of my personal information in accordance
                with the Protection of Personal Information Act (POPI Act) of South Africa. My
                details will only be used for the purpose of this Thanksgiving pledge.
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700"
            size="lg"
            disabled={createPledge.isPending}
          >
            {createPledge.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Pledge"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
