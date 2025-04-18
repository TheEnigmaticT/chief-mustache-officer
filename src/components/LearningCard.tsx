import { GraduationCap, Users, BookOpen, ExternalLink, Podcast } from 'lucide-react'; // Added Podcast icon
import type { LearningResource } from '../data/learning';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RobustImage from './RobustImage';

interface LearningCardProps {
  resource: LearningResource;
}

const LearningCard = ({ resource }: LearningCardProps) => {
  const getIcon = () => {
    switch (resource.type) {
      case 'course':
        return <GraduationCap className="w-6 h-6" />;
      case 'mentoring':
        return <Users className="w-6 h-6" />;
      case 'resource':
        return <BookOpen className="w-6 h-6" />;
      case 'podcast': // Added case for podcast
        return <Podcast className="w-6 h-6" />;
      default: // Optional: handle unknown types
        return null;
    }
  };

  // Helper function to determine badge text based on status
  const getStatusText = (status: LearningResource['status']): string => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'coming-soon':
        return 'Coming Soon';
      case 'closed':
        return 'Closed';
      default:
        return status; // Fallback to the raw status if unknown
    }
  };

  // Helper function to determine badge variant based on status
  const getStatusVariant = (status: LearningResource['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'available':
        return 'default'; // Or maybe 'success' if you have that variant
      case 'coming-soon':
        return 'secondary';
      case 'closed':
        return 'destructive'; // Using 'destructive' for closed status
      default:
        return 'outline'; // Fallback variant
    }
  };


  return (
    <Card className="flex flex-col h-full">
      {resource.imageUrl && (
        <div className="aspect-video overflow-hidden bg-gray-100">
          <RobustImage
            src={resource.imageUrl}
            alt={resource.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="text-mustache">
              {getIcon()}
            </div>
            {/* Use helper functions for variant and text */}
            <Badge variant={getStatusVariant(resource.status)}>
              {getStatusText(resource.status)}
            </Badge>
          </div>
          <Badge variant="outline">{resource.category}</Badge>
        </div>
        <CardTitle className="text-xl mt-2">{resource.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600">{resource.description}</p>
      </CardContent>
      <CardFooter>
        {resource.url ? (
          <Button asChild className="w-full">
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <ExternalLink size={16} />
              Access Resource
            </a>
          </Button>
        ) : (
           // Button logic when no direct URL is available
          <Button disabled={resource.status !== 'available'} className="w-full">
            {/* Update button text based on status */}
            {resource.status === 'available' ? 'Learn More'
              : resource.status === 'coming-soon' ? 'Coming Soon'
              : 'Closed'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LearningCard;