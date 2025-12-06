'use client';

import { X, MapPin, DollarSign, Code } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface JobFiltersProps {
  location: string;
  salaryMin: string;
  skill: string;
  onLocationChange: (value: string) => void;
  onSalaryMinChange: (value: string) => void;
  onSkillChange: (value: string) => void;
  onClearFilters: () => void;
}

export default function JobFilters({
  location,
  salaryMin,
  skill,
  onLocationChange,
  onSalaryMinChange,
  onSkillChange,
  onClearFilters,
}: JobFiltersProps) {
  const hasActiveFilters = location || salaryMin || skill;

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-5">
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </label>
          <Input
            type="text"
            placeholder="e.g., New York, Remote"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Salary Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Minimum Salary
          </label>
          <Input
            type="number"
            placeholder="e.g., 50000"
            value={salaryMin}
            onChange={(e) => onSalaryMinChange(e.target.value)}
            min="0"
            className="w-full"
          />
        </div>

        {/* Skill Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <Code className="w-4 h-4 inline mr-1" />
            Skill
          </label>
          <Input
            type="text"
            placeholder="e.g., React, Python"
            value={skill}
            onChange={(e) => onSkillChange(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
