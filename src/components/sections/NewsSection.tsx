import { Card, CardContent, CardImage } from '../ui/Card';
import { Button } from '../ui/Button';
import { Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import imgImage from 'figma:asset/53ed6a3a2aa645e786b7a819c31dc6140194cd8a.png';

const newsArticles = [
  {
    id: 1,
    title: 'Why Tesla May Hit 200 USD (TSLA Stock Valuation)',
    excerpt: 'Comprehensive analysis of Tesla\'s stock performance and future potential in the automotive industry...',
    image: imgImage,
    author: 'God\'s Autos',
    date: 'December 10, 2024',
    category: 'Industry News',
  },
  {
    id: 2,
    title: 'The Future of Electric Vehicles in Nigeria',
    excerpt: 'Exploring the growing market for electric vehicles and charging infrastructure development...',
    image: imgImage,
    author: 'Huce Autos',
    date: 'December 8, 2024',
    category: 'Technology',
  },
  {
    id: 3,
    title: 'Top 10 Most Reliable Cars of 2024',
    excerpt: 'Our comprehensive guide to the most dependable vehicles you can buy this year...',
    image: imgImage,
    author: 'Huce Autos',
    date: 'December 5, 2024',
    category: 'Car Reviews',
  },
];

export function NewsSection() {
  return (
    <section className="px-4 md:px-8 lg:px-0 lg:mx-auto lg:max-w-[1375px] py-8 md:py-10">
      <div className="w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-brand-dark text-3xl md:text-4xl mb-2">Latest News</h2>
            <p className="text-gray-300">Stay updated with the latest automotive news and insights</p>
          </div>
          {/* Navigation Arrows */}
          <div className="hidden md:flex items-center gap-5">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ 
                width: '40px',
                height: '40px',
                background: '#005C32',
              }}
              aria-label="Previous news"
            >
              <ChevronLeft className="w-3 h-3" style={{ color: '#FFFFFF' }} />
            </button>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ 
                width: '40px',
                height: '40px',
                background: 'transparent',
                border: '1px solid #BC9C22',
              }}
              aria-label="Next news"
            >
              <ChevronRight className="w-3 h-3" style={{ color: '#BC9C22' }} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((article) => (
            <Card key={article.id} hover>
              <CardImage src={article.image} alt={article.title} className="h-48" />
              <CardContent>
                <div className="inline-block bg-brand-green/10 text-brand-green px-3 py-1 rounded-full text-sm mb-3">
                  {article.category}
                </div>
                <h3 className="text-gray-700 mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                
                <div className="flex items-center gap-4 text-gray-300 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{article.author}</span>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="text-brand-green">
                  Read More →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}