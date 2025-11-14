"use client";

import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react';
import { useState } from 'react'
import NewAgentsDialog from './new-agents-dialog';
import { useAgentFilter } from '../../hooks/use-agents-filter';
import { AgentsSearchFilter } from './agents-search-filter';
import { DEFAULT_PAGE } from '@/constant';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const ListHeader = () => {
  const [filter, setFilter] = useAgentFilter();
  const [isDialog, setIsDialog] = useState(false);

  const isAnyFilterModified = !!filter.search;

  const onClearFilter = () => {
    setFilter({
      search: '',
      page: DEFAULT_PAGE
    })
  }

  return (
    <>
      <NewAgentsDialog open={isDialog} onOpenChange={setIsDialog} />
      <div className='py-4 px-4 md:px-8 flex flex-col gap-y-4'>
        <div className='flex items-center justify-between'>
          <h5 className='font-medium text-xl'>My Agents</h5>
          <Button onClick={() => setIsDialog(true)}>
            <PlusIcon />
            New Agent
          </Button>
        </div>
        <ScrollArea>
          <div className='flex items-center gap-x-2 p-1'>
            <AgentsSearchFilter />
            {isAnyFilterModified && (
              <Button variant="outline" size="sm" onClick={onClearFilter}>
                Clear Filter
              </Button>
            )}
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>
    </>
  )
}

export default ListHeader
