
import { ExternalLink, Github } from 'lucide-react';

interface ProjectProps {
  title: string;
  description: string;
  imageUrl?: string;
  technologies?: string[];
  liveUrl?: string;
  repoUrl?: string;
  status?: string;
}

const ProjectCard = ({
  title,
  description,
  imageUrl,
  technologies = [],
  liveUrl,
  repoUrl,
  status = "Active"
}: ProjectProps) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white flex flex-col h-full">
      {imageUrl && (
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-navy">{title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${
            status === "Active" 
              ? "bg-green-100 text-green-800" 
              : status === "Planned" 
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {status}
          </span>
        </div>
        <p className="text-gray-700 mb-4 flex-grow">{description}</p>
        {technologies.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex mt-auto pt-4 space-x-4">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-mustache hover:text-mustache-light text-sm"
            >
              <ExternalLink size={16} className="mr-1" />
              View Project
            </a>
          )}
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-navy hover:text-navy-lighter text-sm"
            >
              <Github size={16} className="mr-1" />
              Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
