import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { 
  Book, 
  ChevronLeft, 
  Upload, 
  DollarSign, 
  Tag,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

const MarketplaceListing = () => {
  const navigate = useNavigate();
  const [listingData, setListingData] = useState({
    title: "The Art of Creative Writing",
    description: "A comprehensive guide to mastering the craft of creative writing. Learn essential techniques, develop your unique voice, and build confidence in your creative abilities.",
    price: "19.99",
    category: "Education",
    subcategory: "Writing & Literature",
    authorName: "Your Name",
    tags: "writing, creativity, education, guide"
  });

  const categories = [
    { value: "education", label: "Education", subcategories: ["Writing & Literature", "Business", "Technology", "Health & Wellness"] },
    { value: "fiction", label: "Fiction", subcategories: ["Romance", "Mystery", "Science Fiction", "Fantasy"] },
    { value: "non-fiction", label: "Non-Fiction", subcategories: ["Biography", "History", "Self-Help", "Science"] },
    { value: "business", label: "Business", subcategories: ["Entrepreneurship", "Marketing", "Finance", "Leadership"] }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save the book to marketplace listings in localStorage
    const marketplaceBooks = JSON.parse(localStorage.getItem('marketplaceBooks') || '[]');
    const newBook = {
      id: Date.now(), // Simple ID generation
      title: listingData.title,
      author: listingData.authorName,
      price: parseFloat(listingData.price),
      rating: 0, // New books start with no rating
      reviewCount: 0,
      category: listingData.category,
      subcategory: listingData.subcategory,
      coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570", // Placeholder
      description: listingData.description,
      tags: listingData.tags.split(',').map(tag => tag.trim()),
      bestseller: false,
      userCreated: true
    };
    
    marketplaceBooks.push(newBook);
    localStorage.setItem('marketplaceBooks', JSON.stringify(marketplaceBooks));
    
    toast.success("Book successfully submitted to marketplace!");
    navigate("/marketplace");
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
                onClick={() => navigate("/book-preview")}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Preview
              </Button>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Tag className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Marketplace Listing</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Listing Form */}
          <div className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Book Details
                </CardTitle>
                <CardDescription>
                  Set up your book listing for the marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={listingData.title}
                      onChange={(e) => setListingData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Your book title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={listingData.description}
                      onChange={(e) => setListingData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your book, what readers will learn, and what makes it unique..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={listingData.category} onValueChange={(value) => setListingData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.label}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Subcategory *</Label>
                      <Select value={listingData.subcategory} onValueChange={(value) => setListingData(prev => ({ ...prev, subcategory: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.find(cat => cat.label === listingData.category)?.subcategories.map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={listingData.price}
                        onChange={(e) => setListingData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="19.99"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Author/Brand Name *</Label>
                    <Input
                      id="author"
                      value={listingData.authorName}
                      onChange={(e) => setListingData(prev => ({ ...prev, authorName: e.target.value }))}
                      placeholder="Your name or brand"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={listingData.tags}
                      onChange={(e) => setListingData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="Separate tags with commas"
                    />
                    <p className="text-xs text-muted-foreground">
                      Help readers find your book with relevant keywords
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload final cover image (recommended: 1200x1800px)
                      </p>
                      <Button variant="outline" size="sm" type="button">
                        Choose File
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Marketplace Preview</CardTitle>
                <CardDescription>
                  How your book will appear to potential buyers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Book Card Preview */}
                  <div className="border rounded-lg p-4 bg-card">
                    <div className="flex gap-4">
                      <div className="w-24 h-32 bg-gradient-creative rounded flex-shrink-0 flex items-center justify-center">
                        <Book className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg">{listingData.title}</h3>
                        <p className="text-sm text-muted-foreground">by {listingData.authorName}</p>
                        <p className="text-sm line-clamp-3">{listingData.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">${listingData.price}</span>
                          <div className="text-xs text-muted-foreground">
                            {listingData.category} • {listingData.subcategory}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags Preview */}
                  {listingData.tags && (
                    <div className="space-y-2">
                      <Label className="text-sm">Tags:</Label>
                      <div className="flex flex-wrap gap-2">
                        {listingData.tags.split(',').map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleSubmit}
              className="w-full bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Submit for Publishing
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            🔌 <strong>Note:</strong> Connect marketplace API here for real book publishing and file uploads
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceListing;