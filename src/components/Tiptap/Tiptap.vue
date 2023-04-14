<template>
  <div class="">
    <div
      v-if="editor"
      class="flex flex-wrap border-t-[2px] border-x-[2px] border-primaryDark rounded-t"
    >
      <button
        class="w-8 h-8 flex justify-center items-center m-1 p-1 rounded"
        :class="{ 'text-white bg-black': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <span class="text-lg">
          <i class="fa-solid fa-bold"></i>
        </span>
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        class="w-8 h-8 flex justify-center items-center m-1 p-1 rounded"
        :class="{ 'text-white bg-black': editor.isActive('italic') }"
      >
        <span class="text-lg">
          <i class="fa-solid fa-italic"></i>
        </span>
      </button>
      <button
        @click="editor.chain().focus().setParagraph().run()"
        class="w-8 h-8 flex justify-center items-center m-1 p-1 rounded"
        :class="{ 'text-white bg-black': editor.isActive('paragraph') }"
      >
        <span class="text-lg">
          <i class="fa-solid fa-paragraph"></i>
        </span>
      </button>

      <button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        class="w-8 h-8 flex justify-center items-center m-1 p-1 rounded"
        :class="{
          'text-white bg-black': editor.isActive('heading', { level: 1 }),
        }"
      >
        <span class="text-lg font-bold"> H1 </span>
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        class="w-8 h-8 flex justify-center items-center m-1 p-1 rounded"
        :class="{
          'text-white bg-black': editor.isActive('heading', { level: 2 }),
        }"
      >
        <span class="text-lg font-bold"> H2 </span>
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        class="w-8 h-8 flex justify-center items-center m-1 p-1 rounded"
        :class="{
          'text-white bg-black': editor.isActive('heading', { level: 3 }),
        }"
      >
        <span class="text-lg font-bold"> H3 </span>
      </button>
      <input
        class="flex justify-center self-center"
        type="color"
        @input="editor.chain().focus().setColor($event.target.value).run()"
        :value="editor.getAttributes('textStyle').color"
      />
      <button
        @click="editor.chain().focus().setColor('#DA100B').run()"
        class="text-cancel w-8 h-8 flex justify-center items-center m-1 p-1 rounded"
        :class="{
          'bg-cancel text-white': editor.isActive('textStyle', {
            color: '#DA100B',
          }),
        }"
      >
        <span class="text-sm font-bold">RED </span>
      </button>
      <button
        @click="editor.chain().focus().setColor('#0000CD').run()"
        class="text-[#0000CD] w-8 h-8 flex justify-center items-center m-1 p-1 rounded"
        :class="{
          'bg-[#0000CD] text-white': editor.isActive('textStyle', {
            color: '#0000CD',
          }),
        }"
      >
        <span class="text-sm font-bold">BLUE </span>
      </button>
      <button
        @click="editor.chain().focus().unsetColor().run()"
        class="hover:bg-black hover:text-white rounded"
      >
        <span class="font-bold">取消顏色 </span>
      </button>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import textStyle from "@tiptap/extension-text-style";
import { postStore } from "../../store/store";
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:modelValue"]);
const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit, Color, textStyle],
  injectCSS: false,
  onUpdate: ({ editor }) => {
    let content = editor.getHTML();
    emit("update:modelValue", content);
  },
});
</script>
<style scope>
h1 {
  font-size: 2em;
}
h2 {
  font-size: 1.5em;
}
h3 {
  font-size: 1.17em;
}
.ProseMirror {
  @apply min-h-[100px] rounded-b;
  border: 4px solid theme(colors.primaryDark);
}
</style>
<!-- 
    -->
