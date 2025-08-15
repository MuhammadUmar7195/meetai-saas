"use client";

import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react';
import React, { useState } from 'react'
import NewAgentsDialog from './new-agents-dialog';

const ListHeader = () => {
  const [isDialog, setIsDialog] = useState(false);
  
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
      </div>
    </>
  )
}

export default ListHeader
