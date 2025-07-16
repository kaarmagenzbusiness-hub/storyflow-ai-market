import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Book, Plus, Eye, Edit, TrendingUp, Users, DollarSign } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  // Dummy data for user's books
  const userBooks = [
    {
      id: 1,
      title: "The Art of Creative Writing",
      status: "published",
      progress: 100,
      sales: 45,
      earnings: 225.50,
      coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570"
    },
    {
      id: 2,
      title: "Modern Web Development Guide",
      status: "draft",
      progress: 75,
      sales: 0,
      earnings: 0,
      coverUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
    },
    {
      id: 3,
      title: "Photography Fundamentals",
      status: "review",
      progress: 100,
      sales: 0,
      earnings: 0,
      coverUrl: "https://images.unsplash.com/photo-1471913743851-c4df8b6ee133"
    }
  ];

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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Book className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">AI Book Builder</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate("/marketplace")} 
              variant="outline"
            >
              Browse Marketplace
            </Button>
            <Button 
              onClick={() => navigate("/author-dashboard")}
              variant="outline"
            >
              Sales Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Author! 👋</h1>
          <p className="text-muted-foreground">
            Continue your book creation journey or start a new masterpiece
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Total Books</span>
              </div>
              <div className="text-2xl font-bold mt-2">{userBooks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-muted-foreground">Total Sales</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {userBooks.reduce((acc, book) => acc + book.sales, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-success" />
                <span className="text-sm font-medium text-muted-foreground">Total Earnings</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                ${userBooks.reduce((acc, book) => acc + book.earnings, 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button 
            onClick={() => navigate("/new-book")}
            className="bg-gradient-primary hover:opacity-90"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Start New Book
          </Button>
        </div>

        {/* Books Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Your Books</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userBooks.map((book) => (
              <Card key={book.id} className="group hover:shadow-elegant transition-all duration-300">
                <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
                  <img 
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg leading-tight">{book.title}</h3>
                    <Badge className={getStatusColor(book.status)}>
                      {book.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div>Progress: {book.progress}%</div>
                    <div>Sales: {book.sales}</div>
                    <div>Earnings: ${book.earnings.toFixed(2)}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/book-preview/${book.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/chapter-editor/${book.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;