import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Book, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Sparkles, 
  Eye,
  FileText,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

const ChapterEditor = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [currentChapter, setCurrentChapter] = useState(0);
  const [autoSaved, setAutoSaved] = useState(false);

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
    
    // Simulate auto-save
    setAutoSaved(true);
    setTimeout(() => setAutoSaved(false), 2000);
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
              </CardContent>
            </Card>
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-3">
            <Card className="shadow-elegant">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    {chapters[currentChapter].title}
                  </CardTitle>
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
                  {chapters[currentChapter].content === "" && (
                    <div className="p-6 bg-gradient-accent/10 rounded-lg border-2 border-dashed border-accent/20">
                      <div className="text-center">
                        <Sparkles className="h-8 w-8 text-accent mx-auto mb-3" />
                        <h3 className="font-semibold mb-2">AI Content Generation</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Let AI help you get started with this chapter. Click below to generate initial content based on your outline.
                        </p>
                        <Button 
                          className="bg-gradient-accent hover:opacity-90"
                          onClick={() => updateChapterContent(`This chapter will cover the core concepts of the topic. Here's where we dive deep into the fundamental principles that form the foundation of everything we'll explore.\n\n## Key Topics\n\n1. **Foundation Principles** - Understanding the basics\n2. **Core Methodologies** - How to apply these concepts\n3. **Common Patterns** - Recognizing recurring themes\n4. **Best Practices** - Industry-standard approaches\n\nLet's begin by examining the first principle...`)}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate AI Content
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <Textarea
                    value={chapters[currentChapter].content}
                    onChange={(e) => updateChapterContent(e.target.value)}
                    placeholder="Start writing your chapter here... You can edit any generated content to match your voice and style."
                    className="min-h-[600px] resize-none"
                  />
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      💡 <strong>Tip:</strong> Focus on getting your ideas down first. You can always refine and polish later.
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setChapters(prev => prev.map((chapter, index) => 
                            index === currentChapter 
                              ? { ...chapter, status: "draft" }
                              : chapter
                          ));
                          toast.success("Chapter saved as draft!");
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save as Draft
                      </Button>
                      <Button 
                        onClick={() => {
                          setChapters(prev => prev.map((chapter, index) => 
                            index === currentChapter 
                              ? { ...chapter, status: "completed" }
                              : chapter
                          ));
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