import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Book, ArrowRight, Lightbulb, Save, ChevronLeft, Loader2, Globe } from "lucide-react";
import { generateBookContent } from "@/lib/gemini";
import { toast } from "sonner";

const NewBook = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bookData, setBookData] = useState({
    idea: "",
    topic: "",
    audience: "",
    genre: "",
    language: "",
    outline: [
      "Introduction to the Topic",
      "Chapter 1: Getting Started",
      "Chapter 2: Core Concepts",
      "Chapter 3: Advanced Techniques", 
      "Chapter 4: Real-World Applications",
      "Conclusion and Next Steps"
    ],
    chapters: []
  });

  // Language options categorized by regions
  const languageOptions = [
    { category: "English Speaking", languages: ["English (US)", "English (UK)", "English (Australia)"] },
    { category: "European", languages: ["Spanish", "French", "German", "Italian", "Portuguese", "Dutch", "Russian", "Polish", "Swedish", "Norwegian"] },
    { category: "Asian", languages: ["Chinese (Simplified)", "Chinese (Traditional)", "Japanese", "Korean", "Hindi", "Arabic", "Thai", "Vietnamese"] },
    { category: "Latin American", languages: ["Spanish (Mexico)", "Portuguese (Brazil)", "Spanish (Argentina)"] },
    { category: "African", languages: ["Swahili", "Amharic", "Hausa", "Yoruba"] },
    { category: "Other", languages: ["Hebrew", "Turkish", "Greek", "Czech", "Hungarian"] }
  ];

  const handleSaveAndContinue = async () => {
    if (step === 1) {
      setIsGenerating(true);
      try {
        const content = await generateBookContent(bookData.idea, bookData.audience, bookData.genre, bookData.language);
        setBookData(prev => ({
          ...prev,
          outline: content.outline,
          chapters: content.chapters
        }));
        toast.success("Book content generated successfully!");
        setStep(2);
      } catch (error) {
        toast.error("Failed to generate content. Please try again.");
        console.error(error);
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Save book data to localStorage and navigate to chapter editor
      localStorage.setItem('currentBook', JSON.stringify(bookData));
      navigate("/chapter-editor/new");
    }
  };

  const addChapter = () => {
    setBookData(prev => ({
      ...prev,
      outline: [...prev.outline, `Chapter ${prev.outline.length - 1}: New Chapter`]
    }));
  };

  const removeChapter = (index: number) => {
    if (bookData.outline.length > 3) { // Keep minimum 3 chapters
      setBookData(prev => ({
        ...prev,
        outline: prev.outline.filter((_, i) => i !== index)
      }));
    }
  };

  const updateChapter = (index: number, value: string) => {
    setBookData(prev => ({
      ...prev,
      outline: prev.outline.map((chapter, i) => i === index ? value : chapter)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => step === 1 ? navigate("/dashboard") : setStep(1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Book className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Create New Book</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Step {step} of 2
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {step === 1 && (
          <Card className="shadow-elegant">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Lightbulb className="h-6 w-6 text-accent" />
                Share Your Book Idea
              </CardTitle>
              <CardDescription>
                Tell us about your book concept and we'll help you structure it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="idea">Book Idea / Topic *</Label>
                <Textarea
                  id="idea"
                  placeholder="Describe your book idea in detail. What is it about? What problem does it solve? What makes it unique?"
                  value={bookData.idea}
                  onChange={(e) => setBookData(prev => ({ ...prev, idea: e.target.value }))}
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    placeholder="e.g., Young professionals, Students, Entrepreneurs"
                    value={bookData.audience}
                    onChange={(e) => setBookData(prev => ({ ...prev, audience: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    placeholder="e.g., Self-help, Fiction, Technical, Educational"
                    value={bookData.genre}
                    onChange={(e) => setBookData(prev => ({ ...prev, genre: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Language
                </Label>
                <Select value={bookData.language} onValueChange={(value) => setBookData(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language for your book" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((category) => (
                      <div key={category.category}>
                        <div className="px-2 py-1 text-sm font-medium text-muted-foreground">
                          {category.category}
                        </div>
                        {category.languages.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => console.log("Saved as draft")}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button 
                  onClick={handleSaveAndContinue}
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                  disabled={!bookData.idea.trim() || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Content
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="shadow-elegant">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Book className="h-6 w-6 text-primary" />
                Review & Edit Your Outline
              </CardTitle>
              <CardDescription>
                AI generated this outline based on your idea. Edit any chapter titles or add/remove chapters as needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  🤖 <strong>AI Generated Content</strong> - Based on: "{bookData.idea}"
                </p>
                <p className="text-xs text-muted-foreground">
                  Generated {bookData.chapters.length} chapters with full content ready for editing.
                </p>
              </div>

              <div className="space-y-4">
                {bookData.outline.map((chapter, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-8">
                      {index + 1}.
                    </span>
                    <Input
                      value={chapter}
                      onChange={(e) => updateChapter(index, e.target.value)}
                      className="flex-1"
                    />
                    {bookData.outline.length > 3 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeChapter(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={addChapter}
                className="w-full"
              >
                + Add Chapter
              </Button>

              <div className="flex gap-4 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => console.log("Saved outline")}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Outline
                </Button>
                <Button 
                  onClick={handleSaveAndContinue}
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                >
                  Start Writing
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            ✅ <strong>AI Integration Active:</strong> Using Gemini API for real content generation
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewBook;