import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Book, Sparkles, Users, TrendingUp, ArrowRight, Star } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <Book className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Book Builder
            </span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 max-w-4xl mx-auto">
            Create, Design, and Sell Books with{" "}
            <span className="bg-gradient-creative bg-clip-text text-transparent">
              AI Power
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your ideas into published books. AI helps you write, design covers, 
            and reach readers worldwide in our marketplace.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={() => navigate("/login")}
              size="lg" 
              className="bg-gradient-primary hover:opacity-90"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Start Creating
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              onClick={() => navigate("/marketplace")}
              variant="outline" 
              size="lg"
            >
              Browse Marketplace
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-sm text-muted-foreground">Books Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Active Authors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">4.9★</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Publish</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-6 hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <Sparkles className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Writing</h3>
              <p className="text-muted-foreground">Get help with outlines, content generation, and editing assistance.</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <Book className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Professional Design</h3>
              <p className="text-muted-foreground">Beautiful cover templates and layout tools for stunning books.</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <TrendingUp className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Marketplace</h3>
              <p className="text-muted-foreground">Sell your books to readers worldwide and track your earnings.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
