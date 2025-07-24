import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Wand2
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

  const updateChapterTitle = (title: string) => {
    setChapters(prev => prev.map((chapter, index) => 
      index === currentChapter 
        ? { ...chapter, title }
        : chapter
    ));
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