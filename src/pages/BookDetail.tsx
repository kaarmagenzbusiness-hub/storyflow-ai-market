import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Book, 
  ChevronLeft, 
  Star, 
  ShoppingCart,
  User,
  Calendar,
  Tag,
  Share2,
  Heart,
  Eye
} from "lucide-react";

const BookDetail = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [activeTab, setActiveTab] = useState("description");
  const [newReview, setNewReview] = useState("");
  const [userRating, setUserRating] = useState(0);

  // Dummy book data
  const book = {
    id: 1,
    title: "The Art of Creative Writing",
    author: "Sarah Johnson",
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.8,
    reviewCount: 124,
    category: "Education",
    subcategory: "Writing & Literature",
    coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570",
    description: "Master the craft of creative writing with this comprehensive guide. Whether you're a complete beginner or looking to refine your skills, this book provides practical tools and insights to elevate your writing.\n\nYou'll learn essential techniques for developing your unique voice, creating compelling characters and narratives, and building confidence in your creative abilities. Each chapter includes exercises and real-world examples to help you apply what you've learned.",
    tags: ["writing", "creativity", "education", "guide"],
    publishDate: "2024-01-15",
    pages: 156,
    language: "English",
    format: "Digital PDF",
    tableOfContents: [
      "Introduction to Creative Writing",
      "Chapter 1: Getting Started",
      "Chapter 2: Core Concepts", 
      "Chapter 3: Advanced Techniques",
      "Chapter 4: Real-World Applications",
      "Conclusion and Next Steps"
    ],
    authorBio: "Sarah Johnson is a professional writer and creative writing instructor with over 10 years of experience. She has published numerous articles and guides on writing techniques and has helped hundreds of aspiring writers develop their craft.",
    reviews: [
      {
        id: 1,
        author: "Alex M.",
        rating: 5,
        date: "2024-01-20",
        comment: "Excellent guide! Really helped me understand the fundamentals of creative writing. The exercises are practical and easy to follow."
      },
      {
        id: 2,
        author: "Jennifer L.",
        rating: 4,
        date: "2024-01-18",
        comment: "Great resource for beginners. Some advanced topics could be covered in more depth, but overall very helpful."
      },
      {
        id: 3,
        author: "Mike R.",
        rating: 5,
        date: "2024-01-16",
        comment: "This book transformed my writing! The author's approach is clear and encouraging. Highly recommended."
      }
    ]
  };

  const handlePurchase = () => {
    navigate("/purchase-complete");
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={interactive ? () => setUserRating(star) : undefined}
          />
        ))}
      </div>
    );
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
                onClick={() => navigate("/marketplace")}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Marketplace
              </Button>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Book className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Book Details</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover and Purchase */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-elegant">
              <CardContent className="p-6">
                <div className="aspect-[3/4] mb-6 overflow-hidden rounded-lg">
                  <img 
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-primary">${book.price}</span>
                    {book.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${book.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    onClick={handlePurchase}
                    className="w-full bg-gradient-primary hover:opacity-90"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Buy Now
                  </Button>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Published: {new Date(book.publishDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      {book.pages} pages • {book.format}
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Language: {book.language}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Author */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg text-muted-foreground">by {book.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(book.rating)}
                  <span className="text-sm text-muted-foreground">
                    ({book.reviewCount} reviews)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{book.category}</Badge>
                <Badge variant="outline">{book.subcategory}</Badge>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <nav className="flex space-x-8">
                {[
                  { id: "description", label: "Description" },
                  { id: "contents", label: "Table of Contents" },
                  { id: "author", label: "About Author" },
                  { id: "reviews", label: "Reviews" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="py-4">
              {activeTab === "description" && (
                <div className="prose prose-lg max-w-none">
                  {book.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {activeTab === "contents" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Table of Contents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2">
                      {book.tableOfContents.map((chapter, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-muted-foreground min-w-[2ch]">
                            {index + 1}.
                          </span>
                          <span>{chapter}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )}

              {activeTab === "author" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      About {book.author}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed">{book.authorBio}</p>
                  </CardContent>
                </Card>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Review Summary */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-primary">{book.rating}</div>
                          <div className="flex items-center justify-center gap-1 mb-2">
                            {renderStars(book.rating)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {book.reviewCount} reviews
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Write Review */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Write a Review</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Rating</label>
                        {renderStars(userRating, true)}
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Review</label>
                        <Textarea
                          value={newReview}
                          onChange={(e) => setNewReview(e.target.value)}
                          placeholder="Share your thoughts about this book..."
                          className="min-h-[100px]"
                        />
                      </div>
                      <Button>Submit Review</Button>
                    </CardContent>
                  </Card>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {book.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-medium">{review.author}</div>
                              <div className="flex items-center gap-2">
                                {renderStars(review.rating)}
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            🔌 <strong>Note:</strong> Connect payment API here for real purchases and review system
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;