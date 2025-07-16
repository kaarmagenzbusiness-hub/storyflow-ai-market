import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Book,
  Star,
  ArrowRight
} from "lucide-react";

const PurchaseComplete = () => {
  const navigate = useNavigate();

  // Dummy purchase data
  const purchase = {
    bookTitle: "The Art of Creative Writing",
    author: "Sarah Johnson",
    price: 19.99,
    transactionId: "TXN-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    purchaseDate: new Date().toLocaleDateString(),
    downloadUrl: "#", // This would be a real download link
    receiptEmail: "user@example.com"
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Success Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Purchase Successful! 🎉</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase. Your book is ready to download.
          </p>
        </div>

        {/* Purchase Details */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Purchase Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="w-16 h-20 bg-gradient-primary rounded flex items-center justify-center flex-shrink-0">
                <Book className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{purchase.bookTitle}</h3>
                <p className="text-muted-foreground">by {purchase.author}</p>
                <p className="text-xl font-bold text-primary">${purchase.price}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Transaction ID:</span>
                <div className="font-mono">{purchase.transactionId}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Purchase Date:</span>
                <div>{purchase.purchaseDate}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Receipt sent to:</span>
                <div>{purchase.receiptEmail}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Format:</span>
                <div>Digital PDF</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Section */}
        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Your Book is Ready!</h3>
              <p className="text-muted-foreground">
                Download your book now and start reading immediately. 
                A download link has also been sent to your email.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90"
                  onClick={() => console.log("Download started")}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Book
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => console.log("Email sent")}
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Resend Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Prompt */}
        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Enjoying your book?</h3>
              <p className="text-muted-foreground">
                Help other readers by leaving a review after you've had a chance to read it.
              </p>
              <Button 
                variant="outline"
                onClick={() => navigate(`/book/1#reviews`)}
              >
                <Star className="h-4 w-4 mr-2" />
                Leave a Review Later
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline"
            onClick={() => navigate("/marketplace")}
          >
            Browse more books
          </Button>
          <Button 
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-primary hover:opacity-90"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* API Note */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            🔌 <strong>Note:</strong> Connect payment processing and file delivery APIs here
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseComplete;