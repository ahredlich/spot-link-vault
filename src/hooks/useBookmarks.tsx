import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Bookmark {
  id: string;
  title: string | null;
  url: string;
  description: string | null;
  tags: string[] | null;
  is_favorite: boolean | null;
  is_read: boolean | null;
  collection_id: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBookmarks = async () => {
    if (!user) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching bookmarks",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    if (!user) {
      setCollections([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('name');

      if (error) throw error;
      setCollections(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching collections",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addBookmark = async (bookmark: Omit<Bookmark, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert([{ ...bookmark, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setBookmarks(prev => [data, ...prev]);
      toast({
        title: "Bookmark added",
        description: "Your bookmark has been saved successfully.",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error adding bookmark",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateBookmark = async (id: string, updates: Partial<Bookmark>) => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setBookmarks(prev => prev.map(b => b.id === id ? data : b));
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating bookmark",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteBookmark = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBookmarks(prev => prev.filter(b => b.id !== id));
      toast({
        title: "Bookmark deleted",
        description: "The bookmark has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting bookmark",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addCollection = async (collection: Omit<Collection, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('collections')
        .insert([{ ...collection, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setCollections(prev => [...prev, data]);
      toast({
        title: "Collection created",
        description: "Your new collection has been created.",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating collection",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookmarks();
      fetchCollections();
    } else {
      setBookmarks([]);
      setCollections([]);
      setLoading(false);
    }
  }, [user]);

  return {
    bookmarks,
    collections,
    loading,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    addCollection,
    refetch: () => {
      fetchBookmarks();
      fetchCollections();
    }
  };
};