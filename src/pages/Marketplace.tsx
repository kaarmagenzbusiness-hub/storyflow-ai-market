import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Book, 
  Search, 
  Filter, 
  Star, 
  ShoppingCart,
  User,
  TrendingUp,
  Award
} from "lucide-react";

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  // Dummy marketplace data
  const books = [
    {
      id: 1,
      title: "The Art of Creative Writing",
      author: "Sarah Johnson",
      price: 19.99,
      rating: 4.8,
      reviewCount: 124,
      category: "Education",
      subcategory: "Writing & Literature",
      coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570",
      description: "Master the craft of creative writing with this comprehensive guide.",
      tags: ["writing", "creativity", "education"],
      bestseller: true
    },
    {
      id: 2,
      title: "Modern Web Development",
      author: "Alex Chen",
      price: 29.99,
      rating: 4.6,
      reviewCount: 89,
      category: "Technology",
      subcategory: "Programming",
      coverUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      description: "Learn modern web development with React, Node.js, and more.",
      tags: ["programming", "web development", "react"],
      bestseller: false
    },
    {
      id: 3,
      title: "Photography Fundamentals",
      author: "Mike Roberts",
      price: 24.99,
      rating: 4.7,
      reviewCount: 156,
      category: "Arts",
      subcategory: "Photography",
      coverUrl: "https://images.unsplash.com/photo-1471913743851-c4df8b6ee133",
      description: "Master the basics of photography with practical tips and techniques.",
      tags: ["photography", "art", "fundamentals"],
      bestseller: false
    },
    {
      id: 4,
      title: "Digital Marketing Mastery",
      author: "Emma Davis",
      price: 34.99,
      rating: 4.9,
      reviewCount: 203,
      category: "Business",
      subcategory: "Marketing",
      coverUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      description: "Complete guide to digital marketing strategies and tactics.",
      tags: ["marketing", "business", "digital"],
      bestseller: true
    },
    {
      id: 5,
      title: "Mindfulness & Meditation",
      author: "Dr. Lisa Park",
      price: 16.99,
      rating: 4.5,
      reviewCount: 78,
      category: "Health",
      subcategory: "Mental Health",
      coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      description: "Find peace and clarity through mindfulness practices.",
      tags: ["mindfulness", "meditation", "wellness"],
      bestseller: false
    },
    {
      id: 6,
      title: "Startup Success Stories",
      author: "James Wilson",
      price: 22.99,
      rating: 4.4,
      reviewCount: 67,
      category: "Business",
      subcategory: "Entrepreneurship",
      coverUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
      description: "Learn from successful entrepreneurs and their journeys.",
      tags: ["entrepreneurship", "startup", "business"],
      bestseller: false
    }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "education", label: "Education" },
    { value: "technology", label: "Technology" },
    { value: "business", label: "Business" },
    { value: "arts", label: "Arts" },
    { value: "health", label: "Health" }
  ];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || 
                           book.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Book className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">AI Book Marketplace</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate("/dashboard")}
                variant="outline"
              >
                <User className="h-4 w-4 mr-2" />
                My Books
              </Button>
              <Button 
                onClick={() => navigate("/new-book")}
                className="bg-gradient-primary hover:opacity-90"
              >
                Create Book
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Discover Amazing Books
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Explore thousands of books created by talented authors worldwide
          </p>
          
          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search books, authors, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Featured Books */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-semibold">Bestsellers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.filter(book => book.bestseller).map((book) => (
              <Card key={book.id} className="group hover:shadow-elegant transition-all duration-300 cursor-pointer">
                <div className="relative">
                  <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
                    <img 
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
                    <Award className="h-3 w-3 mr-1" />
                    Bestseller
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{book.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{book.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({book.reviewCount})</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">${book.price}</span>
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/book/${book.id}`)}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Books */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              All Books ({filteredBooks.length})
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="group hover:shadow-elegant transition-all duration-300 cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
                  <img 
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{book.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{book.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({book.reviewCount})</span>
                    <Badge variant="secondary" className="text-xs">
                      {book.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">${book.price}</span>
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/book/${book.id}`)}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Buy Now
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

export default Marketplace;