'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PlusCircle, Trash, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteJournalPost } from '@/app/actions';
import type { JournalPost } from '@/lib/data';
import { JournalForm } from './journal-form';

export function JournalList({ posts }: { posts: JournalPost[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<JournalPost | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const { toast } = useToast();

  const handleOpenForm = (post: JournalPost | null = null) => {
    setSelectedPost(post);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedPost(null);
  };

  const handleOpenAlert = (id: string) => {
    setPostToDelete(id);
    setIsAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setPostToDelete(null);
    setIsAlertOpen(false);
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    const result = await deleteJournalPost(postToDelete);

    if (result.success) {
      toast({ title: 'Success!', description: result.message });
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh!',
        description: result.message,
      });
    }

    handleCloseAlert();
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button onClick={() => handleOpenForm()}>
          <PlusCircle className="mr-2" /> Add New Post
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenForm(post)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleOpenAlert(post.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <JournalForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        post={selectedPost}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this journal post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseAlert}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
