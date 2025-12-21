"use client";

import { Skill, createOrGetSkill } from "../api";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

interface SkillSelectorProps {
  availableSkills: Skill[];
  selectedSkillIds: number[];
  onSkillsChange: (skillIds: number[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function SkillSelector({
  availableSkills,
  selectedSkillIds,
  onSkillsChange,
  disabled = false,
  isLoading = false,
}: SkillSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);
  const [newlyCreatedSkills, setNewlyCreatedSkills] = useState<Skill[]>([]);

  const allSkills = [...availableSkills, ...newlyCreatedSkills];
  const selectedSkills = allSkills.filter((skill) =>
    selectedSkillIds.includes(skill.id)
  );

  const filteredSkills = allSkills.filter(
    (skill) =>
      !selectedSkillIds.includes(skill.id) &&
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const skillExists = allSkills.some(
    (skill) => skill.name.toLowerCase() === searchTerm.toLowerCase()
  );

  const handleSelectSkill = (skillId: number) => {
    onSkillsChange([...selectedSkillIds, skillId]);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleRemoveSkill = (skillId: number) => {
    onSkillsChange(selectedSkillIds.filter((id) => id !== skillId));
  };

  const handleCreateSkill = async () => {
    if (!searchTerm.trim()) return;

    try {
      setIsCreatingSkill(true);
      const newSkill = await createOrGetSkill(searchTerm.trim());
      setNewlyCreatedSkills([...newlyCreatedSkills, newSkill]);
      onSkillsChange([...selectedSkillIds, newSkill.id]);
      toast.success(`Skill "${newSkill.name}" added successfully`);
      setSearchTerm("");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create skill:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create skill"
      );
    } finally {
      setIsCreatingSkill(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Skills
        </label>
        <div className="p-2 border border-border rounded-md text-sm text-muted-foreground">
          Loading skills...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">Skills</label>

      {/* Selected Skills Display */}
      <div className="flex flex-wrap gap-2 mb-2 min-h-[28px]">
        {selectedSkills.map((skill) => (
          <Badge
            key={skill.id}
            className="flex items-center gap-1 pr-1 bg-primary/10 text-primary hover:bg-primary/20"
          >
            {skill.name}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill.id)}
              disabled={disabled}
              className="ml-1 hover:bg-primary/30 rounded-full p-0.5 disabled:opacity-50"
              aria-label={`Remove ${skill.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Skill Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search and add skills..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          disabled={disabled || isCreatingSkill}
          className="w-full px-3 py-2 border rounded-md text-sm
                     border-input bg-background
                     focus:outline-none focus:ring-2 focus:ring-ring
                     disabled:opacity-50"
        />

        {/* Dropdown */}
        {isOpen &&
          (filteredSkills.length > 0 ||
            (searchTerm.trim() && !skillExists)) && (
            <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-48 overflow-y-auto">
              {filteredSkills.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => handleSelectSkill(skill.id)}
                  disabled={disabled}
                  className="w-full px-3 py-2 text-left text-sm
                             hover:bg-muted focus:bg-muted
                             disabled:opacity-50 border-b border-border last:border-b-0"
                >
                  {skill.name}
                </button>
              ))}

              {searchTerm.trim() && !skillExists && (
                <button
                  type="button"
                  onClick={handleCreateSkill}
                  disabled={disabled || isCreatingSkill}
                  className="w-full px-3 py-2 text-left text-sm
                             hover:bg-primary/10 disabled:opacity-50
                             border-t border-border flex items-center gap-2 font-medium text-primary"
                >
                  <Plus className="h-4 w-4" />
                  Create new skill: &quot;{searchTerm.trim()}&quot;
                </button>
              )}
            </div>
          )}

        {isOpen && searchTerm && filteredSkills.length === 0 && skillExists && (
          <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-md p-3">
            <p className="text-sm text-muted-foreground">Skill already selected</p>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Search for existing skills or type to create a new one. Click the X to
        remove a skill.
      </p>
    </div>
  );
}
