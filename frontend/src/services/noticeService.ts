
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

export type UserRole = 'developer' | 'principal' | 'teacher' | 'student' | 'parent';

export interface Notice {
  id: string;
  title: string;
  content: string;
  author_id: string;
  is_important: boolean;
  created_at: string;
  updated_at: string;
  target_audience: UserRole[];
  author?: {
    first_name: string;
    last_name: string;
  };
}

export interface CreateNoticeData {
  title: string;
  content: string;
  is_important: boolean;
  target_audience: UserRole[];
  target_classes?: string[];
  target_sections?: string[];
}

// Fetch all notices
export const fetchNotices = async () => {
  try {
    const { data, error } = await supabase
      .from('notices')
      .select(`
        id,
        title,
        content,
        author_id,
        is_important,
        created_at,
        updated_at,
        target_audience,
        author:profiles(first_name, last_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching notices:', error);
    toast.error('Failed to load notices');
    return [];
  }
};

// Fetch a single notice by ID
export const fetchNoticeById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('notices')
      .select(`
        id,
        title,
        content,
        author_id,
        is_important,
        created_at,
        updated_at,
        target_audience,
        author:profiles(first_name, last_name),
        notice_class(class_id),
        notice_section(section_id)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching notice:', error);
    toast.error('Failed to load notice details');
    return null;
  }
};

// Create a new notice
export const createNotice = async (noticeData: CreateNoticeData) => {
  try {
    // Insert the notice
    const { data: notice, error: noticeError } = await supabase
      .from('notices')
      .insert({
        title: noticeData.title,
        content: noticeData.content,
        is_important: noticeData.is_important,
        target_audience: noticeData.target_audience,
        author_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (noticeError) {
      throw noticeError;
    }

    // Insert class associations if any
    if (noticeData.target_classes && noticeData.target_classes.length > 0) {
      const classAssociations = noticeData.target_classes.map(classId => ({
        notice_id: notice.id,
        class_id: classId
      }));

      const { error: classError } = await supabase
        .from('notice_class')
        .insert(classAssociations);

      if (classError) {
        throw classError;
      }
    }

    // Insert section associations if any
    if (noticeData.target_sections && noticeData.target_sections.length > 0) {
      const sectionAssociations = noticeData.target_sections.map(sectionId => ({
        notice_id: notice.id,
        section_id: sectionId
      }));

      const { error: sectionError } = await supabase
        .from('notice_section')
        .insert(sectionAssociations);

      if (sectionError) {
        throw sectionError;
      }
    }

    toast.success('Notice created successfully');
    return notice;
  } catch (error) {
    console.error('Error creating notice:', error);
    toast.error('Failed to create notice');
    return null;
  }
};

// Update an existing notice
export const updateNotice = async (id: string, noticeData: Partial<CreateNoticeData>) => {
  try {
    // Update the notice
    const { data: notice, error: noticeError } = await supabase
      .from('notices')
      .update({
        title: noticeData.title,
        content: noticeData.content,
        is_important: noticeData.is_important,
        target_audience: noticeData.target_audience as UserRole[],
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (noticeError) {
      throw noticeError;
    }

    // Update class associations if provided
    if (noticeData.target_classes) {
      // Delete existing associations
      const { error: deleteClassError } = await supabase
        .from('notice_class')
        .delete()
        .eq('notice_id', id);

      if (deleteClassError) {
        throw deleteClassError;
      }

      // Add new associations if any
      if (noticeData.target_classes.length > 0) {
        const classAssociations = noticeData.target_classes.map(classId => ({
          notice_id: id,
          class_id: classId
        }));

        const { error: classError } = await supabase
          .from('notice_class')
          .insert(classAssociations);

        if (classError) {
          throw classError;
        }
      }
    }

    // Update section associations if provided
    if (noticeData.target_sections) {
      // Delete existing associations
      const { error: deleteSectionError } = await supabase
        .from('notice_section')
        .delete()
        .eq('notice_id', id);

      if (deleteSectionError) {
        throw deleteSectionError;
      }

      // Add new associations if any
      if (noticeData.target_sections.length > 0) {
        const sectionAssociations = noticeData.target_sections.map(sectionId => ({
          notice_id: id,
          section_id: sectionId
        }));

        const { error: sectionError } = await supabase
          .from('notice_section')
          .insert(sectionAssociations);

        if (sectionError) {
          throw sectionError;
        }
      }
    }

    toast.success('Notice updated successfully');
    return notice;
  } catch (error) {
    console.error('Error updating notice:', error);
    toast.error('Failed to update notice');
    return null;
  }
};

// Delete a notice
export const deleteNotice = async (id: string) => {
  try {
    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    toast.success('Notice deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting notice:', error);
    toast.error('Failed to delete notice');
    return false;
  }
};
