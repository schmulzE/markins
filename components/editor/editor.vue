<template>
  <form @submit.prevent="submitComment">
    <div
    v-if="editor"
    class="editor"
    >
    <EditorMenubar 
      class="editor_header bg-base-100"
      :editor="editor"
    />

    <EditorContent
      class="editor_content outline-none text-left p-1 border-0 bg-base-100" 
      :editor="editor"
    />
    
  </div>
  <button 
  v-show="editor" 
  type="submit" 
  :disabled="!user && !editor?.getText().trim()" 
  class="bg-[#297D4E] hover:bg-[#1f5a37] btn text-white mt-4 flex justify-end self-end"
  >
    <span v-if="!loading" class="flex items-center">
      <i class="h-4 w-4 mr-2 i-lucide-send" />
      Comment
    </span>
    <span v-else class="loading loading-spinner text-white inline-block mx-14"/>
  </button>
</form>
</template>

<script setup lang="ts">
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Highlight from '@tiptap/extension-highlight';
import { useEditor, EditorContent } from '@tiptap/vue-3';

const emit = defineEmits(['submit-comment', 'post-content']);
const props = defineProps<{
  loading?: boolean,
  allowImageUpload?: boolean,
}>();

const user = useSupabaseUser();

const editor = useEditor({
  extensions: [
  StarterKit, 
  TaskList, 
  TaskItem, 
  Highlight,
  Link.configure({
    openOnClick: true, // Allow users to click on links
    HTMLAttributes: {
      target: '_blank', // Open links in a new tab
      rel: 'noopener noreferrer', // Security best practice
    },
  }),
  ...(props.allowImageUpload ? [Image] : []),
],
//   content: contents.value,
//   onUpdate({ editor }) {
//     contents.value = editor.getText();
//     emit('post-content', contents.value)
//   },
})

const submitComment = () => {
  // Access the Tiptap editor content
  const editorContent = editor.value?.getText();
  // Pass the editor content to the parent component's submitHandler
  emit('submit-comment', editorContent);
  // Clear the Tiptap editor content
  editor.value?.commands.setContent('') // Set it to an empty paragraph or any default value
};


onMounted(()=> {
  editor.value?.commands.focus()
})


onBeforeUnmount(()=> {
  editor.value?.destroy()
})

</script>

<style >
.editor{
  background-color: #fff;
  border: 1px solid lightgrey;
  color: #0d0d0d;
  display: flex;
  flex-direction: column;
  /* max-height: 18rem; */
}
[data-theme="dark"] .editor {
  border-color: #616161;
  color: white;
}
.editor_header {
  align-items: center;
  border-bottom: 1px solid lightgrey;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  padding: 0.25rem;
}

[data-theme="dark"] .editor_header {
  border-bottom-color: #616161;
}

.editor_content{
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0rem 1rem;
  -webkit-overflow-scrolling: touch;
  height: 8rem;
}

.editor_content::-webkit-scrollbar-track{
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3) !important;
  background: #f5f5f5 !important;
}

.editor_footer{
  align-items: center;
}
.editor_status {
  align-items: center;
  border-radius: 5px;
  display: flex;
}
.editor_status::before{
  background: rgba(#0d0d0d, 0.5);
  border-radius: 50%;
  content: "";
  display: inline-block;
  flex: 0 0 auto;
  height: 0.5rem;
}

.editor_status--connecting::before {
  background: #616161;
}
.editor_status--connected::before {
  background: #b9f18d;
}

.editor_name button{
  background: none;
  border: none;
  border-radius: 0.4rem;
  color: #0d0d0d;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
}

.editor_name button::hover {
  background-color: #0d0d0d;
  color: #fff;
}

.ProseMirror:focus{
  border: 0 !important;
  outline: none !important;
}

.ProseMirror > * + * {
  margin-top: 0.75rem;
}

.ProseMirror ul, ol {
  padding: 0 1rem !important;
}

.ProseMirror ul {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
}
.ProseMirror ol {
  display: block;
  list-style-type: decimal;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
}
.ProseMirror p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-size: 16px;
}
.ProseMirror h1 {
  display: block;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-size: 2em;
  font-weight: bold;
}
.ProseMirror h2 {
  display: block;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-size: 1.5em;
  font-weight: bold;
}
.ProseMirror h3 {
  display: block;
  margin-block-start: 0.75em;
  margin-block-end: 0.75em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-size: 1.5em;
  font-weight: bold;
}
.ProseMirror code {
  background-color: rgba(#616161, 0.1);
  color: #616161;
}
.ProseMirror pre {
  background-color: #0d0d0d;
  color: #fff;
  padding: 0.75rem 1rem;
  font-family: "JetBrainMono", monospace;
}
.ProseMirror h1, h2, h3, h4, h5, h6 {
  line-height: 1.1;
}
.ProseMirror img {
  max-width: 50%;
  height: auto;
}
</style>