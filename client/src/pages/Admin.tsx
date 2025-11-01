import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Download, LogOut, ArrowLeft } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Admin() {
  const { user, loading: authLoading, logout } = useAuth();
  const { data: pledges, isLoading } = trpc.pledges.list.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });
  const { data: items } = trpc.items.list.useQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const formatCurrency = (cents: number) => {
    return `R${(cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getItemName = (itemId: number) => {
    return items?.find((i) => i.id === itemId)?.name || "Unknown Item";
  };

  const filteredPledges = pledges?.filter((pledge) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      pledge.fullName.toLowerCase().includes(searchLower) ||
      pledge.email.toLowerCase().includes(searchLower) ||
      pledge.cellNumber.includes(searchLower) ||
      getItemName(pledge.itemId).toLowerCase().includes(searchLower)
    );
  });

  const totalPledged = pledges?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const totalPledgeCount = pledges?.length || 0;

  const exportToCSV = () => {
    if (!pledges || pledges.length === 0) return;

    const headers = ["Date", "Full Name", "Email", "Cell Number", "Item", "Amount", "Type"];
    const rows = pledges.map((p) => [
      formatDate(p.createdAt),
      p.fullName,
      p.email,
      p.cellNumber,
      getItemName(p.itemId),
      (p.amount / 100).toFixed(2),
      p.isFull === 1 ? "Full" : "Partial",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pledges-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">You must be logged in as an administrator to view this page.</p>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Login</a>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">You do not have permission to access the admin dashboard.</p>
            <Button asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage Thanksgiving pledges</p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Public View
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Pledges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalPledgeCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{formatCurrency(totalPledged)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{items?.length || 0}</div>
              <p className="text-sm text-gray-600 mt-1">
                {items?.filter((i) => i.isLocked === 1).length || 0} fully pledged
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pledges Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Pledges</CardTitle>
              <Button onClick={exportToCSV} size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, phone, or item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredPledges && filteredPledges.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cell Number</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPledges.map((pledge) => (
                      <TableRow key={pledge.id}>
                        <TableCell className="text-sm">{formatDate(pledge.createdAt)}</TableCell>
                        <TableCell className="font-medium">{pledge.fullName}</TableCell>
                        <TableCell className="text-sm">{pledge.email}</TableCell>
                        <TableCell className="text-sm">{pledge.cellNumber}</TableCell>
                        <TableCell className="text-sm">{getItemName(pledge.itemId)}</TableCell>
                        <TableCell className="font-semibold text-orange-600">
                          {formatCurrency(pledge.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={pledge.isFull === 1 ? "default" : "secondary"}>
                            {pledge.isFull === 1 ? "Full" : "Partial"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "No pledges found matching your search." : "No pledges yet."}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
