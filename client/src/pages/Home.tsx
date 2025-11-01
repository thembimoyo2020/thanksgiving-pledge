import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2 } from "lucide-react";
import PledgeDialog from "@/components/PledgeDialog";
import { APP_TITLE } from "@/const";

export default function Home() {
  const { data: items, isLoading } = trpc.items.list.useQuery();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSelectItem = (item: any) => {
    if (item.isLocked === 1) return;
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const formatCurrency = (cents: number) => {
    return `R${(cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const calculateProgress = (item: any) => {
    const total = item.price * item.quantity;
    const percentage = (item.totalPledged / total) * 100;
    return Math.min(percentage, 100);
  };

  const getRemainingAmount = (item: any) => {
    const total = item.price * item.quantity;
    return total - item.totalPledged;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container py-6">
          <div className="flex items-center gap-3">
            <img src="/adventist-logo.png" alt="Adventist Logo" className="h-12 w-12" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tshwane East Adventist Church - Thanksgiving Day Pledges</h1>
              <p className="text-sm text-gray-600 italic">"What shall I render to the Lord?" - Psalm 116:12</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        {/* Stats Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-gray-700">Total Contributions So Far</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">
                  {formatCurrency(items?.reduce((sum, item) => sum + item.totalPledged, 0) || 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-gray-700">Balance to Go</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-slate-600">
                  {formatCurrency(
                    items?.reduce((sum, item) => {
                      const totalPrice = item.price * item.quantity;
                      const remaining = totalPrice - item.totalPledged;
                      return sum + remaining;
                    }, 0) || 0
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Choose an Item to give towards as your Thanksgiving Offering</h2>
          <p className="text-gray-700">
            Select an item below to make your pledge. You can contribute the full amount or a partial amount towards any item.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
          {items?.map((item) => {
            const progress = calculateProgress(item);
            const remaining = getRemainingAmount(item);
            const isFullyPledged = item.isLocked === 1;
            const totalPrice = item.price * item.quantity;

            return (
              <Card
                key={item.id}
                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                  isFullyPledged ? "opacity-75" : "cursor-pointer hover:scale-[1.02]"
                }`}
                onClick={() => handleSelectItem(item)}
              >
                {isFullyPledged && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-green-600 text-white">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Fully Pledged
                    </Badge>
                  </div>
                )}

                {item.imageUrl && (
                  <div className="w-full h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  {item.description && (
                    <CardDescription className="text-sm">{item.description}</CardDescription>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Cost:</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>

                  {item.quantity > 1 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">{item.quantity}</span>
                    </div>
                  )}

                  {item.shop && item.shop !== "N/A" && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Shop:</span>
                      <span className="font-medium">{item.shop}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pledged:</span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(item.totalPledged)}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(remaining)}
                      </span>
                    </div>
                  </div>

                  {!isFullyPledged && (
                    <Button className="w-full bg-[#456380] hover:bg-[#2563eb]" size="lg">
                      Make a Pledge
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Pledge Dialog */}
      {selectedItem && (
        <PledgeDialog
          item={selectedItem}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
}
