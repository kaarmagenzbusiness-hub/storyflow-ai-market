import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Book, 
  ChevronLeft, 
  Upload, 
  Palette, 
  ArrowRight, 
  Save,
  Sparkles,
  Loader2,
  RefreshCw
} from "lucide-react";
import { generateCoverDesign } from "@/lib/gemini-cover";
import { toast } from "sonner";

const BookDesign = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [generatedCoverUrl, setGeneratedCoverUrl] = useState("");
  const [designRecommendations, setDesignRecommendations] = useState("");
  
  // Load book data from localStorage
  const [bookInfo, setBookInfo] = useState(() => {
    const savedBook = localStorage.getItem('currentBook');
    if (savedBook) {
      const bookData = JSON.parse(savedBook);
      return {
        title: bookData.title || "The Art of Creative Writing",
        author: "Your Name",
        subtitle: bookData.subtitle || "A Complete Guide to Mastering the Craft",
        idea: bookData.idea || "",
        genre: bookData.genre || ""
      };
    }
    return {
      title: "The Art of Creative Writing",
      author: "Your Name", 
      subtitle: "A Complete Guide to Mastering the Craft",
      idea: "",
      genre: ""
    };
  });

  // Dummy cover templates
  const templates = [
    {
      id: 0,
      name: "Modern Minimalist",
      preview: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570",
      description: "Clean, professional design with bold typography"
    },
    {
      id: 1,
      name: "Creative Abstract",
      preview: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      description: "Artistic background with modern layout"
    },
    {
      id: 2,
      name: "Classic Literature",
      preview: "https://images.unsplash.com/photo-1471913743851-c4df8b6ee133",
      description: "Traditional book design with elegant serif fonts"
    },
    {
      id: 3,
      name: "Tech & Innovation",
      preview: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      description: "Modern tech-inspired design with gradients"
    }
  ];

  const handleGenerateAICover = async () => {
    if (!bookInfo.title || !bookInfo.idea) {
      toast.error("Please ensure book title and idea are available.");
      return;
    }

    setIsGeneratingCover(true);
    try {
      const coverDesign = await generateCoverDesign(
        bookInfo.title,
        bookInfo.idea,
        bookInfo.genre,
        designRecommendations
      );
      
      // For demo purposes, we'll use a placeholder image URL
      // In a real implementation, you would use the imagePrompt with an image generation API
      const demoImageUrl = `https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&auto=format`;
      setGeneratedCoverUrl(demoImageUrl);
      
      toast.success("AI cover generated successfully!");
      
      // Save the cover design details
      localStorage.setItem('generatedCoverDesign', JSON.stringify(coverDesign));
    } catch (error) {
      toast.error("Failed to generate AI cover. Please try again.");
      console.error(error);
    } finally {
      setIsGeneratingCover(false);
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
                onClick={() => navigate("/chapter-editor")}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Editor
              </Button>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Palette className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Book Design</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate("/book-preview")}
                variant="outline"
              >
                Preview Book
              </Button>
              <Button 
                onClick={() => navigate("/book-preview")}
                className="bg-gradient-primary hover:opacity-90"
              >
                Continue to Preview
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Template Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Choose Cover Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedTemplate === template.id
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="aspect-[3/4]">
                        <img 
                          src={template.preview}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <div className="font-medium text-sm">{template.name}</div>
                        <div className="text-xs opacity-90">{template.description}</div>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                          <Book className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-4 bg-gradient-accent/10 rounded-lg border border-accent/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span className="font-medium text-sm">AI Cover Generator</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Generate a custom cover based on your book content and genre
                  </p>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="design-recommendations" className="text-xs">
                        Design Recommendations (Optional)
                      </Label>
                      <Textarea
                        id="design-recommendations"
                        placeholder="e.g., Minimalist design, blue color scheme, modern typography..."
                        value={designRecommendations}
                        onChange={(e) => setDesignRecommendations(e.target.value)}
                        className="min-h-[60px] text-sm"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={handleGenerateAICover}
                        disabled={isGeneratingCover}
                        className="bg-gradient-accent hover:opacity-90 flex-1"
                      >
                        {isGeneratingCover ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate AI Cover
                          </>
                        )}
                      </Button>
                      
                      {generatedCoverUrl && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={handleGenerateAICover}
                          disabled={isGeneratingCover}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Book Information */}
            <Card>
              <CardHeader>
                <CardTitle>Book Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={bookInfo.title}
                    onChange={(e) => setBookInfo(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter your book title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={bookInfo.subtitle}
                    onChange={(e) => setBookInfo(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Optional subtitle"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">Author Name *</Label>
                  <Input
                    id="author"
                    value={bookInfo.author}
                    onChange={(e) => setBookInfo(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Custom Cover Image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag & drop your image here, or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      Upload Image
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[3/4] relative bg-gradient-creative rounded-lg overflow-hidden shadow-elegant">
                  <img 
                    src={generatedCoverUrl || templates[selectedTemplate].preview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Book Title */}
                  <div className="absolute inset-x-0 top-1/3 px-6 text-center">
                    <h1 className="text-white font-bold text-2xl leading-tight mb-2">
                      {bookInfo.title}
                    </h1>
                    {bookInfo.subtitle && (
                      <p className="text-white/90 text-sm">
                        {bookInfo.subtitle}
                      </p>
                    )}
                  </div>
                  
                  {/* Author Name */}
                  <div className="absolute bottom-8 left-6 right-6 text-center">
                    <p className="text-white font-medium">
                      {bookInfo.author}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    {generatedCoverUrl ? "AI Generated Cover" : `Template: ${templates[selectedTemplate].name}`}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  const designData = {
                    ...bookInfo,
                    selectedTemplate,
                    generatedCoverUrl,
                    designRecommendations
                  };
                  localStorage.setItem('bookDesign', JSON.stringify(designData));
                  toast.success("Design saved successfully!");
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Design
              </Button>
              <Button 
                onClick={() => {
                  // Save the current design to localStorage
                  const designData = {
                    ...bookInfo,
                    selectedTemplate,
                    generatedCoverUrl,
                    designRecommendations
                  };
                  localStorage.setItem('bookDesign', JSON.stringify(designData));
                  navigate("/book-preview");
                }}
                className="flex-1 bg-gradient-primary hover:opacity-90"
              >
                Preview Book
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            🔌 <strong>Note:</strong> Connect AI cover generation API and file upload service here
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookDesign;