import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { 
  Book, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Eye,
  Download,
  Star,
  BarChart3,
  ChevronLeft
} from "lucide-react";

const AuthorDashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("30d");

  // Dummy sales data
  const salesData = {
    totalEarnings: 1247.50,
    totalSales: 156,
    thisMonth: 385.25,
    lastMonth: 298.75,
    books: [
      {
        id: 1,
        title: "The Art of Creative Writing",
        status: "published",
        totalSales: 89,
        totalEarnings: 445.00,
        monthlySales: 24,
        monthlyEarnings: 120.00,
        rating: 4.8,
        reviewCount: 124,
        coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570"
      },
      {
        id: 2,
        title: "Modern Web Development Guide",
        status: "published",
        totalSales: 45,
        totalEarnings: 675.00,
        monthlySales: 12,
        monthlyEarnings: 180.00,
        rating: 4.6,
        reviewCount: 89,
        coverUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
      },
      {
        id: 3,
        title: "Photography Fundamentals",
        status: "published",
        totalSales: 22,
        totalEarnings: 127.50,
        monthlySales: 8,
        monthlyEarnings: 85.25,
        rating: 4.7,
        reviewCount: 156,
        coverUrl: "https://images.unsplash.com/photo-1471913743851-c4df8b6ee133"
      }
    ],
    recentSales: [
      { date: "2024-01-20", book: "The Art of Creative Writing", amount: 19.99, buyer: "Alex M." },
      { date: "2024-01-20", book: "Modern Web Development Guide", amount: 29.99, buyer: "Jennifer L." },
      { date: "2024-01-19", book: "The Art of Creative Writing", amount: 19.99, buyer: "Mike R." },
      { date: "2024-01-19", book: "Photography Fundamentals", amount: 24.99, buyer: "Sarah K." },
      { date: "2024-01-18", book: "The Art of Creative Writing", amount: 19.99, buyer: "Tom W." }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-success text-success-foreground";
      case "review": return "bg-warning text-warning-foreground";
      case "draft": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/dashboard")}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Sales Dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-success" />
                <span className="text-sm font-medium text-muted-foreground">Total Earnings</span>
              </div>
              <div className="text-2xl font-bold">${salesData.totalEarnings.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">
                +${(salesData.thisMonth - salesData.lastMonth).toFixed(2)} from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Total Sales</span>
              </div>
              <div className="text-2xl font-bold">{salesData.totalSales}</div>
              <div className="text-xs text-muted-foreground">
                Books sold across all titles
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-muted-foreground">This Month</span>
              </div>
              <div className="text-2xl font-bold">${salesData.thisMonth.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">
                {Math.round(((salesData.thisMonth - salesData.lastMonth) / salesData.lastMonth) * 100)}% vs last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Book className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Published Books</span>
              </div>
              <div className="text-2xl font-bold">{salesData.books.length}</div>
              <div className="text-xs text-muted-foreground">
                Active in marketplace
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Book Performance */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Book Performance
                </CardTitle>
                <CardDescription>
                  Sales and revenue breakdown by book
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {salesData.books.map((book) => (
                  <div key={book.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-16 bg-gradient-primary rounded flex items-center justify-center flex-shrink-0">
                      <Book className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{book.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{book.totalSales} sales</span>
                        <span>${book.totalEarnings.toFixed(2)} earned</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{book.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">
                        ${book.monthlyEarnings.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {book.monthlySales} this month
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Sales */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Recent Sales
                </CardTitle>
                <CardDescription>
                  Latest purchases from your books
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {salesData.recentSales.map((sale, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{sale.book}</div>
                        <div className="text-xs text-muted-foreground">
                          {sale.date} • {sale.buyer}
                        </div>
                      </div>
                      <div className="font-medium text-success">
                        +${sale.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payout Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Payout Settings
                </CardTitle>
                <CardDescription>
                  Manage how you receive your earnings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Available Balance</span>
                    <span className="text-lg font-bold text-success">
                      ${salesData.totalEarnings.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-4">
                    Minimum payout: $50.00
                  </div>
                  <Button 
                    className="w-full"
                    disabled={salesData.totalEarnings < 50}
                  >
                    Request Payout
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Payment Method</div>
                  <div className="p-3 border rounded-lg bg-card">
                    <div className="text-sm">PayPal • john@example.com</div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Change Method
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            🔌 <strong>Note:</strong> Connect payout APIs (Stripe, PayPal) and analytics services here
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthorDashboard;