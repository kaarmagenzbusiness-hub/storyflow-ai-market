import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Users, 
  Book,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  Calendar,
  DollarSign
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dummy admin data
  const adminData = {
    stats: {
      totalUsers: 1247,
      totalBooks: 589,
      pendingReviews: 23,
      totalRevenue: 45678.90,
      thisMonth: {
        newUsers: 89,
        newBooks: 34,
        revenue: 12456.78
      }
    },
    pendingBooks: [
      {
        id: 1,
        title: "Advanced Machine Learning",
        author: "Dr. Emily Chen",
        category: "Technology",
        submittedDate: "2024-01-20",
        status: "pending",
        price: 39.99,
        coverUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
      },
      {
        id: 2,
        title: "Digital Marketing Strategies",
        author: "Mark Thompson",
        category: "Business",
        submittedDate: "2024-01-19",
        status: "pending",
        price: 24.99,
        coverUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
      },
      {
        id: 3,
        title: "Creative Writing Workshop",
        author: "Lisa Martinez",
        category: "Education",
        submittedDate: "2024-01-18",
        status: "pending",
        price: 19.99,
        coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570"
      }
    ],
    allBooks: [
      {
        id: 4,
        title: "The Art of Creative Writing",
        author: "Sarah Johnson",
        category: "Education",
        status: "approved",
        sales: 89,
        revenue: 1780.11,
        approvedDate: "2024-01-15"
      },
      {
        id: 5,
        title: "Photography Fundamentals",
        author: "Mike Roberts",
        category: "Arts",
        status: "approved",
        sales: 156,
        revenue: 3899.44,
        approvedDate: "2024-01-10"
      },
      {
        id: 6,
        title: "Beginner's Guide to Cooking",
        author: "Chef Amanda",
        category: "Lifestyle",
        status: "rejected",
        reason: "Content quality issues",
        rejectedDate: "2024-01-12"
      }
    ],
    users: [
      {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah@example.com",
        joinDate: "2024-01-01",
        booksPublished: 3,
        totalEarnings: 1247.50,
        status: "active"
      },
      {
        id: 2,
        name: "Mike Roberts",
        email: "mike@example.com",
        joinDate: "2024-01-05",
        booksPublished: 1,
        totalEarnings: 3899.44,
        status: "active"
      },
      {
        id: 3,
        name: "Emily Chen",
        email: "emily@example.com",
        joinDate: "2024-01-15",
        booksPublished: 0,
        totalEarnings: 0,
        status: "pending"
      }
    ]
  };

  const handleBookAction = (bookId: number, action: 'approve' | 'reject') => {
    console.log(`${action} book ${bookId}`);
    // In real app, this would make an API call
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-success text-success-foreground";
      case "pending": return "bg-warning text-warning-foreground";
      case "rejected": return "bg-destructive text-destructive-foreground";
      case "active": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                {adminData.stats.pendingReviews} Pending Reviews
              </Badge>
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
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Total Users</span>
              </div>
              <div className="text-2xl font-bold">{adminData.stats.totalUsers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                +{adminData.stats.thisMonth.newUsers} this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Book className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-muted-foreground">Total Books</span>
              </div>
              <div className="text-2xl font-bold">{adminData.stats.totalBooks.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                +{adminData.stats.thisMonth.newBooks} this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span className="text-sm font-medium text-muted-foreground">Pending Reviews</span>
              </div>
              <div className="text-2xl font-bold">{adminData.stats.pendingReviews}</div>
              <div className="text-xs text-muted-foreground">
                Require immediate attention
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-success" />
                <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
              </div>
              <div className="text-2xl font-bold">${adminData.stats.totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                +${adminData.stats.thisMonth.revenue.toLocaleString()} this month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
            <TabsTrigger value="books">All Books</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Pending Reviews Tab */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Books Pending Review
                </CardTitle>
                <CardDescription>
                  Review and approve or reject book submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.pendingBooks.map((book) => (
                    <div key={book.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-16 h-20 bg-gradient-primary rounded flex items-center justify-center flex-shrink-0">
                        <Book className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-lg">{book.title}</h4>
                        <p className="text-sm text-muted-foreground">by {book.author}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Category: {book.category}</span>
                          <span>Price: ${book.price}</span>
                          <span>Submitted: {book.submittedDate}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => console.log(`Preview book ${book.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-success hover:bg-success/90 text-success-foreground"
                          onClick={() => handleBookAction(book.id, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleBookAction(book.id, 'reject')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Books Tab */}
          <TabsContent value="books">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  All Books
                </CardTitle>
                <CardDescription>
                  Manage all books in the marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search books..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {adminData.allBooks.map((book) => (
                    <div key={book.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{book.title}</h4>
                          <Badge className={getStatusColor(book.status)}>
                            {book.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
                        <div className="text-sm text-muted-foreground">
                          Category: {book.category}
                          {book.status === 'approved' && (
                            <>
                              {" • "}Sales: {book.sales}
                              {" • "}Revenue: ${book.revenue?.toFixed(2)}
                            </>
                          )}
                          {book.status === 'rejected' && book.reason && (
                            <>
                              {" • "}Reason: {book.reason}
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {book.status === 'approved' && (
                          <Button variant="outline" size="sm">
                            Suspend
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.users.map((user) => (
                    <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{user.name}</h4>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                        <div className="text-sm text-muted-foreground">
                          Joined: {user.joinDate}
                          {" • "}Books: {user.booksPublished}
                          {" • "}Earnings: ${user.totalEarnings.toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Profile
                        </Button>
                        {user.status === 'active' ? (
                          <Button variant="outline" size="sm">
                            Suspend
                          </Button>
                        ) : (
                          <Button size="sm" className="bg-success hover:bg-success/90">
                            Activate
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            🔌 <strong>Note:</strong> Connect admin APIs for real user and content management
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;