import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search } from 'lucide-react';

export const BountyFilters = ({ 
  searchQuery, 
  setSearchQuery,
  category,
  setCategory
}: {
  searchQuery: string,
  setSearchQuery: (query: string) => void,
  category: string,
  setCategory: (category: string) => void
}) => {
  return (
    <div className="flex flex-col gap-4 sticky top-24">
      <div>
        <h3 className="font-semibold mb-3">Search</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bounties..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Frontend">Frontend</SelectItem>
            <SelectItem value="Backend">Backend</SelectItem>
            <SelectItem value="Smart Contracts">Smart Contracts</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Content">Content</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
