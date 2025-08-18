
'use client';

import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { 
    Bold, 
    Italic, 
    Underline as UnderlineIcon, 
    List, 
    ListOrdered, 
    Heading1, 
    Heading2, 
    Heading3,
    Link as LinkIcon,
    Unlink
} from 'lucide-react';
import { useCallback } from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

const EditorToolbar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    return (
        <div className="border border-input rounded-md p-2 flex items-center gap-1 flex-wrap">
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
                <Bold className="h-4 w-4"/>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
                <Italic className="h-4 w-4"/>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'is-active' : ''}>
                <UnderlineIcon className="h-4 w-4"/>
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1"/>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>
                <Heading1 className="h-4 w-4"/>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>
                <Heading2 className="h-4 w-4"/>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>
                <Heading3 className="h-4 w-4"/>
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1"/>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>
                <List className="h-4 w-4"/>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>
                <ListOrdered className="h-4 w-4"/>
            </Button>
             <Separator orientation="vertical" className="h-6 mx-1"/>
            <Button variant="ghost" size="icon" onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''}>
                <LinkIcon className="h-4 w-4"/>
            </Button>
             <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')}>
                <Unlink className="h-4 w-4"/>
            </Button>
        </div>
    );
};

export function RichTextEditor({ value, onChange }: { value: string, onChange: (value: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
          openOnClick: false,
          autolink: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
        attributes: {
            class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[250px] border border-input rounded-md p-4',
        }
    }
  });
  
  return (
      <div className="space-y-2">
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} />
      </div>
  );
}
