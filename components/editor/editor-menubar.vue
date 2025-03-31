<template>
  <div class="py-0 flex bg-base-100">
    <template v-for="(item, index) in items">
      <div
      v-if="item.type === 'divider'"
      :key="`divider${index}`"
      class="divider"
      />
      <MenuItem
        v-else
        :key="index"
        :icon="item.icon!"
        :title="item.title!"
        :action="item.action!"
        :is-active="item.isActive"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import MenuItem from './menu-item.vue';
import type { Editor } from '@tiptap/vue-3';
import { useToast } from 'vue-toastification';

const toast = useToast();
const emit = defineEmits(["image-src"]);

const props = defineProps<{
  editor: Editor,
  image?: string,
  allowImageUpload?: boolean,
}>();

const isLinkActive = computed(() => {
  return props.editor?.isActive('link');
});

const url = ref<string>('');

if(props.image && props.editor){
  url.value = props.image
  props.editor.chain().focus().setImage({ src: url.value }).run()
}

const addImage =() => {

  if(!props.allowImageUpload){
    toast.info('Only external links to images or files are allowed in comments.')
    return;
  }

  const input = document.createElement('input');
  input.type="file";
  setTimeout(function(){
    input.click();
  },200);
  input.addEventListener('change', async (e) => {
    try {
      const file = (e.target as HTMLInputElement).files![0];
      input.setAttribute("disabled", '');
      
      if (!file) {
        throw new Error('You must select an image to upload.')
      }
      
      emit('image-src', file)
      const imageUrl = URL.createObjectURL(file);

      props.editor.chain().focus().setImage({ src: imageUrl }).run();

    } catch (error) {
      if(error instanceof Error){
        throw new Error(error.message)
      }
    } finally {
      input.removeAttribute('disabled');
    }
  })
};

// Toggle link function
const toggleLink = () => {
  if (isLinkActive.value) {
    // If a link is active, remove it
    props.editor?.chain().focus().unsetLink().run();
  } else {
    // If no link is active, prompt the user to add a link
    const url = window.prompt('Enter the URL');
    if (url) {
      props.editor?.chain().focus().setLink({ href: url }).run();
    }
  }
};

interface MenuItem {
  icon?: string;
  title?: string;
  action?: () => void;
  isActive?: () => boolean;
  type?: string;
}

const items: MenuItem[] = [
  {
    icon: 'i-ri-bold',
    title: 'Bold',
    action: () => props.editor.chain().focus().toggleBold().run(),
    isActive: () => props.editor.isActive('bold')
  },
  {
    icon: 'i-ri-italic',
    title: 'Italic',
    action: () => props.editor.chain().focus().toggleItalic().run(),
    isActive: () => props.editor.isActive('italic')
  },
  {
    icon: 'i-ri-strikethrough-2',
    title: 'Strike',
    action: () => props.editor.chain().focus().toggleStrike().run(),
    isActive: () => props.editor.isActive('strike')
  },
  {
    icon: 'i-ri-mark-pen-line',
    title: 'Highlight',
    action: () => props.editor.chain().focus().toggleHighlight().run(),
    isActive: () => props.editor.isActive('highlight')
  },
  {
    type: 'divider'
  },
  {
    icon: 'i-ri-paragraph',
    title: 'Paragraph',
    action: () => props.editor.chain().focus().setParagraph().run(),
    isActive: () => props.editor.isActive('paragraph')
  },
  {
    icon: 'i-ri-list-unordered',
    title: 'Bullet List',
    action: () => props.editor.chain().focus().toggleBulletList().run(),
    isActive: () => props.editor.isActive('bulletList')
  },
  {
    icon: 'i-ri-list-ordered',
    title: 'Ordered List',
    action: () => props.editor.chain().focus().toggleOrderedList().run(),
    isActive: () => props.editor.isActive('orderedList')
  },
  {
    icon: 'i-ri-link',
    title: 'Link',
    action: () => toggleLink(),
    isActive: () => props.editor.isActive('link')
  },
  {
    type: 'divider'
  },
  {
    icon: 'i-ri-double-quotes-l',
    title: 'Blockquote',
    action: () => props.editor.chain().focus().toggleBlockquote().run(),
    isActive: () => props.editor.isActive('blockquote')
  },
  {
    icon: 'i-ri-image-2-fill',
    title: 'Image',
    action: () => addImage(),
    isActive: () => props.editor.isActive('image')
  },
  {
    icon: 'i-ri-separator',
    title: 'Horizontal Rule',
    action: () => props.editor.chain().focus().setHorizontalRule().run(),
  },
  {
    type: 'divider'
  },
  {
    icon: 'i-ri-text-wrap',
    title: 'Hard Break',
    action: () => props.editor.chain().focus().setHardBreak().run(),
  },
  {
    icon: 'i-ri-format-clear',
    title: 'Clear Format',
    action: () =>  props.editor.chain().focus().clearNodes().unsetAllMarks().run(),
  },
  {
    type: 'divider'
  },
  {
    icon: 'i-ri-arrow-go-back-line',
    title: 'Undo',
    action: () =>  props.editor.chain().focus().undo().run(),
  },
  {
    icon: 'i-ri-arrow-go-forward-line',
    title: 'Redo',
    action: () =>  props.editor.chain().focus().redo().run(),
  },
]


</script>

<style scoped>
.divider{
  background-color: rgba(#000, 0.25);
  height: 1.25rem;
  margin-left: 0.5rem;
  margin-right: 0.75rem;
  width: 1px;
}
</style>