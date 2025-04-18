
import { GraduationCap, Users, BookOpen } from 'lucide-react';
import type { LearningResource } from '../data/learning';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="text-mustache">
              {getIcon()}
            </div>
            <Badge variant={resource.status === 'available' ? 'default' : 'secondary'}>
              {resource.status === 'available' ? 'Available' : 'Coming Soon'}
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
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              Access Resource
            </a>
          </Button>
        ) : (
          <Button disabled={resource.status !== 'available'} className="w-full">
            {resource.status === 'available' ? 'Learn More' : 'Coming Soon'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LearningCard;
