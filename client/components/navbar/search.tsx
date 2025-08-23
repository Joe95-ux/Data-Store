'use client';

import { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockResults = [
  'Dashboard',
  'Settings',
  'Billing',
  'Team',
  'Projects',
  'Profile',
  'Notifications',
];

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const close = useCallback(() => setOpen(false), []);
  const openSearch = useCallback(() => setOpen(true), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close, openSearch]);

  const filtered = mockResults.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-sm text-muted-foreground w-full justify-start"
        >
          <SearchIcon className="w-4 h-4 mr-2" />
          Search...
          <kbd className="ml-auto text-xs text-muted-foreground">Ctrl+K</kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <Command>
          <CommandInput
            placeholder="Search..."
            onValueChange={setSearch}
            className="h-12"
          />
          <ScrollArea className="max-h-60">
            <CommandList>
              {filtered.length ? (
                filtered.map((result, i) => (
                  <CommandItem key={i} onSelect={() => alert(`Selected: ${result}`)}>
                    {result}
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled>No results found</CommandItem>
              )}
            </CommandList>
          </ScrollArea>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
