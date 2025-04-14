
import { Quote } from 'lucide-react';

interface TestimonialProps {
  text: string;
  author: string;
  position: string;
  company?: string;
}

const TestimonialCard = ({ text, author, position, company }: TestimonialProps) => {
  return (
    <div className="rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col">
      <Quote className="text-mustache mb-4" size={32} />
      <p className="text-gray-700 italic mb-6">{text}</p>
      <div className="mt-auto">
        <p className="font-semibold text-navy">{author}</p>
        <p className="text-gray-600 text-sm">
          {position}
          {company && `, ${company}`}
        </p>
      </div>
    </div>
  );
};

export default TestimonialCard;
