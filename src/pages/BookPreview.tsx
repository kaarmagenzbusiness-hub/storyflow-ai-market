import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Book, 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  CheckCircle,
  ArrowRight,
  FileText,
  Palette
} from "lucide-react";

const BookPreview = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  // Dummy book data
  const bookData = {
    title: "The Art of Creative Writing",
    author: "Your Name",
    subtitle: "A Complete Guide to Mastering the Craft",
    coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570",
    chapters: [
      {
        title: "Introduction to the Topic",
        content: "Welcome to this comprehensive guide on creative writing. In this book, we'll explore the fundamental principles that make writing compelling, engaging, and memorable.\n\nWriting is both an art and a craft. While creativity flows from inspiration, the techniques and structures we'll cover will help you channel that creativity into powerful, purposeful prose.\n\nThroughout this journey, you'll learn to:\n• Develop your unique voice as a writer\n• Create compelling characters and narratives\n• Master the mechanics of good writing\n• Build confidence in your creative abilities\n\nWhether you're a complete beginner or looking to refine your skills, this book will provide you with practical tools and insights to elevate your writing."
      },
      {
        title: "Chapter 1: Getting Started",
        content: "Every writer's journey begins with a single word, then a sentence, then a paragraph. The key to successful writing is not waiting for the perfect moment or the perfect idea—it's about starting where you are with what you have.\n\n## Finding Your Writing Space\n\nCreating a dedicated writing environment can significantly impact your productivity and creativity. This doesn't need to be a fancy office—it could be a corner of your kitchen table, a favorite coffee shop, or even a park bench.\n\n## Establishing a Writing Routine\n\nConsistency beats perfection every time. Even writing for just 15 minutes daily can lead to substantial progress over time.\n\n## Overcoming the Blank Page\n\nThe blank page can be intimidating, but remember: you can't edit a blank page. Give yourself permission to write badly at first—you can always improve it later."
      },
      {
        title: "Chapter 2: Core Concepts",
        content: "This chapter explores the fundamental building blocks of effective writing. Understanding these core concepts will provide you with a solid foundation for all your future writing endeavors.\n\n## The Elements of Style\n\nStyle is what makes your writing uniquely yours. It encompasses your choice of words, sentence structure, tone, and the overall voice that emerges from your work.\n\n## Narrative Structure\n\nWhether you're writing fiction or non-fiction, understanding how to structure your narrative is crucial for keeping readers engaged from beginning to end."
      }
    ]
  };

  const totalPages = bookData.chapters.length + 1; // +1 for cover
  const isOnCover = currentPage === 0;
  const currentChapter = isOnCover ? null : bookData.chapters[currentPage - 1];

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
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
                onClick={() => navigate("/book-design")}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Design
              </Button>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Book className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Book Preview</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </div>
              <Button 
                onClick={() => navigate("/marketplace-listing")}
                className="bg-gradient-primary hover:opacity-90"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve for Publishing
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Book Contents</h3>
                <div className="space-y-2">
                  <div
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      isOnCover ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    onClick={() => setCurrentPage(0)}
                  >
                    <div className="font-medium text-sm">Cover</div>
                  </div>
                  {bookData.chapters.map((chapter, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded cursor-pointer transition-colors ${
                        currentPage === index + 1 ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      <div className="font-medium text-sm">{chapter.title}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate("/chapter-editor")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Edit Content
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate("/book-design")}
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Edit Design
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Preview */}
          <div className="lg:col-span-3">
            <Card className="shadow-elegant">
              <CardContent className="p-0">
                <div className="relative">
                  {/* Book Page */}
                  <div className="min-h-[800px] bg-white">
                    {isOnCover ? (
                      // Cover Page
                      <div className="relative h-[800px] bg-gradient-creative rounded-t-lg overflow-hidden">
                        <img 
                          src={bookData.coverUrl}
                          alt="Book cover"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        
                        <div className="absolute inset-x-0 top-1/3 px-12 text-center">
                          <h1 className="text-white font-bold text-4xl leading-tight mb-4">
                            {bookData.title}
                          </h1>
                          {bookData.subtitle && (
                            <p className="text-white/90 text-lg mb-8">
                              {bookData.subtitle}
                            </p>
                          )}
                        </div>
                        
                        <div className="absolute bottom-16 left-12 right-12 text-center">
                          <p className="text-white font-medium text-xl">
                            {bookData.author}
                          </p>
                        </div>
                      </div>
                    ) : (
                      // Chapter Page
                      <div className="p-12">
                        <h1 className="text-3xl font-bold mb-8 text-foreground">
                          {currentChapter?.title}
                        </h1>
                        <div className="prose prose-lg max-w-none">
                          {currentChapter?.content.split('\n').map((paragraph, index) => {
                            if (paragraph.startsWith('## ')) {
                              return (
                                <h2 key={index} className="text-xl font-semibold mt-8 mb-4">
                                  {paragraph.replace('## ', '')}
                                </h2>
                              );
                            } else if (paragraph.startsWith('• ')) {
                              return (
                                <li key={index} className="ml-6">
                                  {paragraph.replace('• ', '')}
                                </li>
                              );
                            } else if (paragraph.trim()) {
                              return (
                                <p key={index} className="mb-4 leading-relaxed">
                                  {paragraph}
                                </p>
                              );
                            }
                            return <br key={index} />;
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Page Navigation */}
                  <div className="flex items-center justify-between p-4 border-t bg-muted/50">
                    <Button
                      variant="outline"
                      onClick={goToPrevPage}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    
                    <div className="text-sm text-muted-foreground">
                      {isOnCover ? "Cover" : `Chapter ${currentPage}`} • Page {currentPage + 1} of {totalPages}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages - 1}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate("/chapter-editor")}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                Make Changes
              </Button>
              <Button 
                onClick={() => navigate("/marketplace-listing")}
                className="flex-1 bg-gradient-primary hover:opacity-90"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Ready to Publish
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPreview;