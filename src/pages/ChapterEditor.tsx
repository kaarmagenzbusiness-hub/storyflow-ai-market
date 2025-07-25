import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Book, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Sparkles, 
  Eye,
  FileText,
  ArrowRight,
  Edit,
  Wand2,
  Search,
  Plus,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Palette,
  Image,
  Upload
} from "lucide-react";
import { toast } from "sonner";
import { generateBookContent } from "@/lib/gemini";

const ChapterEditor = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [currentChapter, setCurrentChapter] = useState(0);
  const [autoSaved, setAutoSaved] = useState(false);
  const [chapterIdeaDialog, setChapterIdeaDialog] = useState(false);
  const [chapterIdea, setChapterIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [polishDialog, setPolishDialog] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [referenceDialog, setReferenceDialog] = useState(false);
  const [referenceTopic, setReferenceTopic] = useState("");
  const [isGeneratingReference, setIsGeneratingReference] = useState(false);
  const [generatedReferences, setGeneratedReferences] = useState("");
  
  // Rich text editor states
  const [selectedFont, setSelectedFont] = useState("font-serif");
  const [selectedAlignment, setSelectedAlignment] = useState("left");
  const [selectedTextColor, setSelectedTextColor] = useState("text-foreground");
  const [selectedBgColor, setSelectedBgColor] = useState("bg-background");
  const [fontSize, setFontSize] = useState("text-base");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load chapters from localStorage or use dummy data
  const [chapters, setChapters] = useState(() => {
    const savedBook = localStorage.getItem('currentBook');
    if (savedBook) {
      const bookData = JSON.parse(savedBook);
      if (bookData.chapters && bookData.chapters.length > 0) {
        return bookData.chapters.map(chapter => ({
          title: chapter.title,
          content: chapter.content,
          wordCount: chapter.content.trim().split(/\s+/).length,
          status: chapter.content.trim() ? "completed" : "not_started"
        }));
      }
    }
    
    // Fallback dummy data
    return [
      {
        title: "Introduction to the Topic",
        content: "Welcome to this comprehensive guide on creative writing. In this book, we'll explore the fundamental principles that make writing compelling, engaging, and memorable.\n\nWriting is both an art and a craft. While creativity flows from inspiration, the techniques and structures we'll cover will help you channel that creativity into powerful, purposeful prose.\n\nThroughout this journey, you'll learn to:\n• Develop your unique voice as a writer\n• Create compelling characters and narratives\n• Master the mechanics of good writing\n• Build confidence in your creative abilities\n\nWhether you're a complete beginner or looking to refine your skills, this book will provide you with practical tools and insights to elevate your writing.",
        wordCount: 142,
        status: "completed"
      },
      {
        title: "Chapter 1: Getting Started",
        content: "Every writer's journey begins with a single word, then a sentence, then a paragraph. The key to successful writing is not waiting for the perfect moment or the perfect idea—it's about starting where you are with what you have.\n\n## Finding Your Writing Space\n\nCreating a dedicated writing environment can significantly impact your productivity and creativity. This doesn't need to be a fancy office—it could be a corner of your kitchen table, a favorite coffee shop, or even a park bench.\n\n## Establishing a Writing Routine\n\nConsistency beats perfection every time. Even writing for just 15 minutes daily can lead to substantial progress over time.\n\n## Overcoming the Blank Page\n\nThe blank page can be intimidating, but remember: you can't edit a blank page. Give yourself permission to write badly at first—you can always improve it later.",
        wordCount: 168,
        status: "in_progress"
      },
      {
        title: "Chapter 2: Core Concepts", 
        content: "This chapter explores the fundamental building blocks of effective writing...",
        wordCount: 15,
        status: "draft"
      },
      {
        title: "Chapter 3: Advanced Techniques",
        content: "",
        wordCount: 0,
        status: "not_started"
      }
    ];
  });

  const updateChapterContent = (content: string) => {
    const wordCount = content.trim().split(/\s+/).length;
    setChapters(prev => prev.map((chapter, index) => 
      index === currentChapter 
        ? { 
            ...chapter, 
            content, 
            wordCount,
            status: content.trim() ? "in_progress" : "not_started"
          }
        : chapter
    ));
    
    // Save to localStorage immediately for manual books
    const savedBook = localStorage.getItem('currentBook');
    if (savedBook) {
      const bookData = JSON.parse(savedBook);
      bookData.chapters = chapters.map((chapter, index) => 
        index === currentChapter 
          ? { 
              ...chapter, 
              content, 
              wordCount,
              status: content.trim() ? "in_progress" : "not_started"
            }
          : chapter
      );
      localStorage.setItem('currentBook', JSON.stringify(bookData));
    }
    
    // Simulate auto-save
    setAutoSaved(true);
    setTimeout(() => setAutoSaved(false), 2000);
  };

  const updateChapterTitle = (title: string) => {
    setChapters(prev => prev.map((chapter, index) => 
      index === currentChapter 
        ? { ...chapter, title }
        : chapter
    ));
    
    // Save to localStorage immediately for manual books
    const savedBook = localStorage.getItem('currentBook');
    if (savedBook) {
      const bookData = JSON.parse(savedBook);
      bookData.chapters = chapters.map((chapter, index) => 
        index === currentChapter 
          ? { ...chapter, title }
          : chapter
      );
      localStorage.setItem('currentBook', JSON.stringify(bookData));
    }
  };

  const generateAIChapter = async () => {
    if (!chapterIdea.trim()) {
      toast.error("Please enter a chapter idea");
      return;
    }

    setIsGenerating(true);
    try {
      const savedBook = localStorage.getItem('currentBook');
      const bookData = savedBook ? JSON.parse(savedBook) : {};
      
      const response = await generateBookContent(
        `Chapter idea: ${chapterIdea}. This is Chapter ${currentChapter + 1} of a book titled "${bookData.title || 'Untitled Book'}".`,
        bookData.targetAudience || "General audience",
        bookData.genre || "Non-fiction",
        bookData.language || "English"
      );

      if (response.chapters && response.chapters.length > 0) {
        const generatedChapter = response.chapters[0];
        updateChapterContent(generatedChapter.content);
        updateChapterTitle(generatedChapter.title);
        toast.success("AI content generated successfully!");
      }
    } catch (error) {
      toast.error("Failed to generate AI content");
    } finally {
      setIsGenerating(false);
      setChapterIdeaDialog(false);
      setChapterIdea("");
    }
  };

  const polishWithAI = async () => {
    const currentContent = chapters[currentChapter].content;
    if (!currentContent.trim()) {
      toast.error("No content to polish");
      return;
    }

    setIsPolishing(true);
    try {
      const savedBook = localStorage.getItem('currentBook');
      const bookData = savedBook ? JSON.parse(savedBook) : {};
      
      const response = await generateBookContent(
        `Polish and improve this chapter content while maintaining the author's voice and style: ${currentContent}`,
        bookData.targetAudience || "General audience",
        bookData.genre || "Non-fiction",
        bookData.language || "English"
      );

      if (response.chapters && response.chapters.length > 0) {
        updateChapterContent(response.chapters[0].content);
        toast.success("Content polished successfully!");
      }
    } catch (error) {
      toast.error("Failed to polish content");
    } finally {
      setIsPolishing(false);
      setPolishDialog(false);
    }
  };

  const generateReferences = async () => {
    if (!referenceTopic.trim()) {
      toast.error("Please enter a topic for references");
      return;
    }

    setIsGeneratingReference(true);
    try {
      const response = await generateBookContent(
        `Provide comprehensive references, sources, and research materials for the topic: "${referenceTopic}". Include academic sources, books, articles, websites, and other credible resources that would be helpful for someone writing about this topic. Format as a well-organized reference list with brief descriptions of each source.`,
        "General audience",
        "Reference material",
        "English"
      );

      if (response.chapters && response.chapters.length > 0) {
        setGeneratedReferences(response.chapters[0].content);
        toast.success("References generated successfully!");
      }
    } catch (error) {
      toast.error("Failed to generate references");
    } finally {
      setIsGeneratingReference(false);
    }
  };

  const addNewChapter = () => {
    const newChapter = {
      title: `Chapter ${chapters.length + 1}: New Chapter`,
      content: "",
      wordCount: 0,
      status: "not_started"
    };
    
    setChapters(prev => [...prev, newChapter]);
    
    // Save to localStorage
    const savedBook = localStorage.getItem('currentBook');
    if (savedBook) {
      const bookData = JSON.parse(savedBook);
      bookData.chapters = [...chapters, newChapter];
      localStorage.setItem('currentBook', JSON.stringify(bookData));
    }
    
    // Navigate to the new chapter
    setCurrentChapter(chapters.length);
    toast.success("New chapter added!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success text-success-foreground";
      case "in_progress": return "bg-warning text-warning-foreground";
      case "draft": return "bg-muted text-muted-foreground";
      case "not_started": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const canGoNext = () => currentChapter < chapters.length - 1;
  const canGoPrev = () => currentChapter > 0;

  const insertImage = (imageSrc: string, altText: string = "Image") => {
    const imageMarkdown = `\n![${altText}](${imageSrc})\n`;
    const currentContent = chapters[currentChapter].content;
    updateChapterContent(currentContent + imageMarkdown);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create object URL for local preview
      const imageUrl = URL.createObjectURL(file);
      insertImage(imageUrl, file.name);
      toast.success("Image inserted successfully!");
    }
  };

  const insertPlaceholderImage = (type: string) => {
    const placeholderImages = {
      infographic: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
      character: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
      nature: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop",
      tech: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop"
    };
    
    const imageUrl = placeholderImages[type as keyof typeof placeholderImages];
    if (imageUrl) {
      insertImage(imageUrl, `${type} image`);
      toast.success(`${type} image inserted!`);
    }
  };

  const applyFormatting = () => {
    let classes = [selectedFont, selectedAlignment, selectedTextColor, selectedBgColor, fontSize];
    
    if (isBold) classes.push("font-bold");
    if (isItalic) classes.push("italic");
    if (isUnderline) classes.push("underline");
    
    return classes.join(" ");
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
                Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Book className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Chapter Editor</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {autoSaved && (
                <div className="text-sm text-success flex items-center gap-1">
                  <Save className="h-4 w-4" />
                  Auto-saved
                </div>
              )}
              <Button 
                onClick={() => navigate("/book-design")}
                variant="outline"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Book
              </Button>
              <Button 
                onClick={() => navigate("/book-design")}
                className="bg-gradient-primary hover:opacity-90"
              >
                Continue to Design
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chapter Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Chapters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      currentChapter === index 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setCurrentChapter(index)}
                  >
                    <div className="font-medium text-sm mb-1">{chapter.title}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs opacity-75">
                        {chapter.wordCount} words
                      </span>
                      <Badge 
                        className={`text-xs ${getStatusColor(chapter.status)}`}
                        variant="secondary"
                      >
                        {chapter.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addNewChapter}
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Chapter
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-3">
            <Card className="shadow-elegant">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {editingTitle ? (
                      <Input
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        onBlur={() => {
                          updateChapterTitle(tempTitle);
                          setEditingTitle(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateChapterTitle(tempTitle);
                            setEditingTitle(false);
                          }
                          if (e.key === 'Escape') {
                            setTempTitle(chapters[currentChapter].title);
                            setEditingTitle(false);
                          }
                        }}
                        className="text-2xl font-bold border-none p-0 h-auto"
                        autoFocus
                      />
                    ) : (
                      <CardTitle 
                        className="text-2xl cursor-pointer hover:text-primary transition-colors"
                        onClick={() => {
                          setTempTitle(chapters[currentChapter].title);
                          setEditingTitle(true);
                        }}
                      >
                        {chapters[currentChapter].title}
                      </CardTitle>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setTempTitle(chapters[currentChapter].title);
                        setEditingTitle(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentChapter(currentChapter - 1)}
                      disabled={!canGoPrev()}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentChapter(currentChapter + 1)}
                      disabled={!canGoNext()}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Chapter {currentChapter + 1} of {chapters.length}</span>
                  <span>•</span>
                  <span>{chapters[currentChapter].wordCount} words</span>
                  <Badge className={getStatusColor(chapters[currentChapter].status)}>
                    {chapters[currentChapter].status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Rich Text Formatting Toolbar */}
                  <Card className="border-accent/20">
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-center gap-4">
                        {/* Font Selection */}
                        <div className="flex items-center gap-2">
                          <Type className="h-4 w-4" />
                          <Select value={selectedFont} onValueChange={setSelectedFont}>
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="font-serif">Serif</SelectItem>
                              <SelectItem value="font-sans">Sans Serif</SelectItem>
                              <SelectItem value="font-mono">Monospace</SelectItem>
                              <SelectItem value="font-playfair">Playfair Display</SelectItem>
                              <SelectItem value="font-inter">Inter</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator orientation="vertical" className="h-6" />

                        {/* Font Size */}
                        <Select value={fontSize} onValueChange={setFontSize}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text-xs">XS</SelectItem>
                            <SelectItem value="text-sm">SM</SelectItem>
                            <SelectItem value="text-base">MD</SelectItem>
                            <SelectItem value="text-lg">LG</SelectItem>
                            <SelectItem value="text-xl">XL</SelectItem>
                            <SelectItem value="text-2xl">2XL</SelectItem>
                          </SelectContent>
                        </Select>

                        <Separator orientation="vertical" className="h-6" />

                        {/* Text Formatting */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant={isBold ? "default" : "outline"}
                            size="sm"
                            onClick={() => setIsBold(!isBold)}
                          >
                            <Bold className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={isItalic ? "default" : "outline"}
                            size="sm"
                            onClick={() => setIsItalic(!isItalic)}
                          >
                            <Italic className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={isUnderline ? "default" : "outline"}
                            size="sm"
                            onClick={() => setIsUnderline(!isUnderline)}
                          >
                            <Underline className="h-4 w-4" />
                          </Button>
                        </div>

                        <Separator orientation="vertical" className="h-6" />

                        {/* Text Alignment */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant={selectedAlignment === "text-left" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedAlignment("text-left")}
                          >
                            <AlignLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={selectedAlignment === "text-center" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedAlignment("text-center")}
                          >
                            <AlignCenter className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={selectedAlignment === "text-right" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedAlignment("text-right")}
                          >
                            <AlignRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={selectedAlignment === "text-justify" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedAlignment("text-justify")}
                          >
                            <AlignJustify className="h-4 w-4" />
                          </Button>
                        </div>

                        <Separator orientation="vertical" className="h-6" />

                        {/* Colors */}
                        <div className="flex items-center gap-2">
                          <Palette className="h-4 w-4" />
                          <Select value={selectedTextColor} onValueChange={setSelectedTextColor}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text-foreground">Default</SelectItem>
                              <SelectItem value="text-primary">Primary</SelectItem>
                              <SelectItem value="text-secondary">Secondary</SelectItem>
                              <SelectItem value="text-accent">Accent</SelectItem>
                              <SelectItem value="text-muted-foreground">Muted</SelectItem>
                              <SelectItem value="text-destructive">Red</SelectItem>
                              <SelectItem value="text-success">Green</SelectItem>
                              <SelectItem value="text-warning">Yellow</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Background Color */}
                        <Select value={selectedBgColor} onValueChange={setSelectedBgColor}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bg-background">Default</SelectItem>
                            <SelectItem value="bg-muted">Muted</SelectItem>
                            <SelectItem value="bg-accent/10">Light Accent</SelectItem>
                            <SelectItem value="bg-primary/10">Light Primary</SelectItem>
                            <SelectItem value="bg-gradient-subtle">Gradient</SelectItem>
                          </SelectContent>
                        </Select>

                        <Separator orientation="vertical" className="h-6" />

                        {/* Image Upload */}
                        <div className="flex items-center gap-1">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Image className="h-4 w-4 mr-1" />
                                Stock Images
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Insert Stock Images</DialogTitle>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4">
                                <Button
                                  variant="outline"
                                  className="h-24 flex flex-col"
                                  onClick={() => insertPlaceholderImage("infographic")}
                                >
                                  <div className="text-2xl mb-2">📊</div>
                                  <span className="text-sm">Infographic</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="h-24 flex flex-col"
                                  onClick={() => insertPlaceholderImage("character")}
                                >
                                  <div className="text-2xl mb-2">🤖</div>
                                  <span className="text-sm">Character</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="h-24 flex flex-col"
                                  onClick={() => insertPlaceholderImage("nature")}
                                >
                                  <div className="text-2xl mb-2">🦌</div>
                                  <span className="text-sm">Nature</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="h-24 flex flex-col"
                                  onClick={() => insertPlaceholderImage("tech")}
                                >
                                  <div className="text-2xl mb-2">💻</div>
                                  <span className="text-sm">Technology</span>
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {chapters[currentChapter].content === "" && (
                    <div className="p-6 bg-gradient-accent/10 rounded-lg border-2 border-dashed border-accent/20">
                      <div className="text-center">
                        <Sparkles className="h-8 w-8 text-accent mx-auto mb-3" />
                        <h3 className="font-semibold mb-2">AI Content Generation</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Let AI help you get started with this chapter. Click below to generate initial content based on your chapter idea.
                        </p>
                        <Dialog open={chapterIdeaDialog} onOpenChange={setChapterIdeaDialog}>
                          <DialogTrigger asChild>
                            <Button className="bg-gradient-accent hover:opacity-90">
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate AI Content
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Generate AI Content</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Chapter Idea</label>
                                <Textarea
                                  placeholder="Describe what you want this chapter to cover..."
                                  value={chapterIdea}
                                  onChange={(e) => setChapterIdea(e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setChapterIdeaDialog(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={generateAIChapter} disabled={isGenerating}>
                                  {isGenerating ? "Generating..." : "Generate Content"}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}
                  
                  {/* Rich Text Editor with Live Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Editor */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Markdown Editor</label>
                      <Textarea
                        value={chapters[currentChapter].content}
                        onChange={(e) => updateChapterContent(e.target.value)}
                        placeholder="Start writing your chapter here... 

💡 **Formatting Tips:**
- Use **bold** or *italic* text
- Add images: ![alt text](image-url)
- Create headers: # Title or ## Subtitle
- Lists: - Item 1 or 1. Numbered item

You can edit any generated content to match your voice and style."
                        className={`min-h-[600px] resize-none ${applyFormatting()}`}
                      />
                    </div>
                    
                    {/* Live Preview */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Live Preview</label>
                      <div className={`min-h-[600px] p-4 border rounded-lg overflow-auto ${selectedBgColor}`}>
                        <div 
                          className={`prose prose-sm max-w-none ${applyFormatting()}`}
                          dangerouslySetInnerHTML={{
                            __html: chapters[currentChapter].content
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em>$1</em>')
                              .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
                              .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
                              .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
                              .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
                              .replace(/\n/g, '<br />')
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      💡 <strong>Tip:</strong> Focus on getting your ideas down first. You can always refine and polish later.
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={referenceDialog} onOpenChange={setReferenceDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Search className="h-4 w-4 mr-2" />
                            Find References
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Find References</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Topic for References</label>
                              <Textarea
                                placeholder="Enter the topic you want to find references for..."
                                value={referenceTopic}
                                onChange={(e) => setReferenceTopic(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            {generatedReferences && (
                              <div>
                                <label className="text-sm font-medium">Generated References</label>
                                <div className="mt-1 p-3 bg-muted rounded-lg max-h-60 overflow-y-auto">
                                  <pre className="text-sm whitespace-pre-wrap">{generatedReferences}</pre>
                                </div>
                              </div>
                            )}
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setReferenceDialog(false)}>
                                Close
                              </Button>
                              <Button onClick={generateReferences} disabled={isGeneratingReference}>
                                {isGeneratingReference ? "Generating..." : "Generate References"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog open={polishDialog} onOpenChange={setPolishDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" disabled={!chapters[currentChapter].content.trim()}>
                            <Wand2 className="h-4 w-4 mr-2" />
                            Smart Polish (AI + Human)
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Smart Polish Content</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              AI will polish and improve your content while maintaining your voice and style.
                            </p>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setPolishDialog(false)}>
                                Cancel
                              </Button>
                              <Button onClick={polishWithAI} disabled={isPolishing}>
                                {isPolishing ? "Polishing..." : "Polish Content"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          const updatedChapters = chapters.map((chapter, index) => 
                            index === currentChapter 
                              ? { ...chapter, status: "draft" }
                              : chapter
                          );
                          setChapters(updatedChapters);
                          
                          // Save to localStorage
                          const savedBook = localStorage.getItem('currentBook');
                          if (savedBook) {
                            const bookData = JSON.parse(savedBook);
                            bookData.chapters = updatedChapters;
                            localStorage.setItem('currentBook', JSON.stringify(bookData));
                          }
                          
                          toast.success("Chapter saved as draft!");
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save as Draft
                      </Button>
                      <Button 
                        onClick={() => {
                          const updatedChapters = chapters.map((chapter, index) => 
                            index === currentChapter 
                              ? { ...chapter, status: "completed" }
                              : chapter
                          );
                          setChapters(updatedChapters);
                          
                          // Save to localStorage
                          const savedBook = localStorage.getItem('currentBook');
                          if (savedBook) {
                            const bookData = JSON.parse(savedBook);
                            bookData.chapters = updatedChapters;
                            localStorage.setItem('currentBook', JSON.stringify(bookData));
                          }
                          
                          toast.success("Chapter marked as completed!");
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save as Completed
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            🔌 <strong>Note:</strong> Connect AI API here for real content generation and auto-save functionality
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChapterEditor;