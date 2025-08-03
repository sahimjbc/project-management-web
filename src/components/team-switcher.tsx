"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Building2, Check, Plus } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";

type Team = {
  name: string;
  shortcut: string;
};

const teams: Team[] = [
  { name: "ALL TEAMS", shortcut: "⌘0" },
  { name: "Acme Inc", shortcut: "⌘1" },
  { name: "Beta LLC", shortcut: "⌘2" },
  { name: "Gamma Org", shortcut: "⌘3" },
];

export function TeamSwitcher() {
  const [selectedTeam, setSelectedTeam] = React.useState<Team>(teams[0]);

  const handleSelect = (team: Team) => {
    setSelectedTeam(team);
    // You can add state sync with global store or API call here
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded="true"
          aria-label="Select a team"
          className="w-full justify-between"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="truncate">{selectedTeam.name}</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60">
        {teams.map((team) => (
          <DropdownMenuItem
            key={team.name}
            onClick={() => handleSelect(team)}
            className="cursor-pointer"
          >
            <div className="flex justify-between items-center w-full">
              <span className="flex items-center gap-2">
                {team.name === selectedTeam.name && (
                  <Check className="h-4 w-4 text-primary" />
                )}
                {team.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {team.shortcut}
              </span>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => alert("Add team clicked")}
          className="cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Team
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
