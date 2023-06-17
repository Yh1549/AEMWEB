<template>
  <div>
    <div
      v-if="editor"
      class="flex flex-wrap border-t-[2px] border-x-[2px] border-primaryDark rounded-t"
    >
      <menu-button
        label="粗體"
        icon-class="fa-solid fa-bold"
        :isActive="editor.isActive('bold')"
        :buttonFunction="() => editor.chain().focus().toggleBold().run()"
      />
      <menu-button
        label="斜體"
        icon-class="fa-solid fa-italic"
        :isActive="editor.isActive('italic')"
        :buttonFunction="() => editor.chain().focus().toggleItalic().run()"
      />
      <menu-button
        label="底線"
        icon-class="fa-solid fa-underline"
        :isActive="editor.isActive('underline')"
        :buttonFunction="() => editor.chain().focus().toggleUnderline().run()"
      />
      <span class="line">|</span>
      <menu-button
        label="標題1"
        text="H1"
        :isActive="editor.isActive('heading', { level: 1 })"
        :buttonFunction="
          () => editor.chain().focus().toggleHeading({ level: 1 }).run()
        "
      />
      <menu-button
        label="標題2"
        text="H2"
        :isActive="editor.isActive('heading', { level: 2 })"
        :buttonFunction="
          () => editor.chain().focus().toggleHeading({ level: 2 }).run()
        "
      />
      <menu-button
        label="標題3"
        text="H3"
        :isActive="editor.isActive('heading', { level: 3 })"
        :buttonFunction="
          () => editor.chain().focus().toggleHeading({ level: 3 }).run()
        "
      />
      <menu-button
        label="段落?"
        icon-class="fa-solid fa-paragraph"
        :isActive="editor.isActive('paragraph')"
        :buttonFunction="() => editor.chain().focus().setParagraph().run()"
      />
      <menu-button
        label="項目符號"
        icon-class="fa-solid fa-list-ul"
        :isActive="editor.isActive('bulletList')"
        :buttonFunction="() => editor.chain().focus().toggleBulletList().run()"
      />
      <menu-button
        label="編號"
        icon-class="fa-solid fa-list-ol"
        :isActive="editor.isActive('orderedList')"
        :buttonFunction="() => editor.chain().focus().toggleOrderedList().run()"
      />
      <menu-button
        label="縮排"
        icon-class="fa-solid fa-indent"
        :isActive="editor.isActive('blockquote')"
        :buttonFunction="() => editor.chain().focus().toggleBlockquote().run()"
      />
      <span class="line">|</span>
      <menu-button
        v-if="!editor.isActive('table')"
        label="表格"
        icon-class="fa-solid fa-table-cells-large"
        :isActive="editor.isActive('table')"
        :buttonFunction="
          () => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
        "
      />
      <div v-if="editor.isActive('table')" class="flex">
        <menu-button
          label="新增欄"
          :img="'/src/assets/column-add.png'"
          :buttonFunction="() => editor.chain().focus().addColumnAfter().run()"
        />
        <menu-button
          label="刪除欄"
          :img="'/src/assets/delete-column.png'"
          :buttonFunction="() => editor.chain().focus().deleteColumn().run()"
        />
        <menu-button
          label="新增列"
          :img="'/src/assets/row-add.png'"
          :buttonFunction="() => editor.chain().focus().addRowAfter().run()"
        />
        <menu-button
          label="刪除列"
          :img="'/src/assets/row-del.png'"
          :buttonFunction="() => editor.chain().focus().deleteRow().run()"
        />
        <menu-button
          label="合併儲存格"
          :img="'/src/assets/merge.png'"
          :buttonFunction="() => editor.chain().focus().mergeOrSplit().run()"
        />
        <menu-button
          label="刪除表格"
          :img="'/src/assets/table-del.png'"
          :buttonFunction="() => editor.chain().focus().deleteTable().run()"
        />
        <span class="line">|</span>
        <menu-button
          label="靠左對齊"
          icon-class="fa-solid fa-align-left"
          :isActive="editor.isActive({ textAlign: 'left' })"
          :buttonFunction="
            () => editor.chain().focus().setTextAlign('left').run()
          "
        /><menu-button
          label="置中對齊"
          icon-class="fa-solid fa-align-center"
          :isActive="editor.isActive({ textAlign: 'center' })"
          :buttonFunction="
            () => editor.chain().focus().setTextAlign('center').run()
          "
        /><menu-button
          label="靠右對齊"
          icon-class="fa-solid fa-align-right"
          :isActive="editor.isActive({ textAlign: 'right' })"
          :buttonFunction="
            () => editor.chain().focus().setTextAlign('right').run()
          "
        />
      </div>
      <span class="line">|</span>
      <menu-button
        label="超連結"
        icon-class="fa-solid fa-link"
        :isActive="editor.isActive('link')"
        :buttonFunction="setLink"
      />
      <input
        class="flex justify-center self-center"
        type="color"
        @input="editor.chain().focus().setColor($event.target.value).run()"
        :value="editor.getAttributes('textStyle').color"
      />
      <menu-button
        textSm="RED"
        :class="
          !editor.isActive('textStyle', {
            color: '#DA100B',
          })
            ? 'text-cancel'
            : 'bg-cancel text-white'
        "
        :buttonFunction="() => editor.chain().focus().setColor('#DA100B').run()"
      />
      <menu-button
        textSm="BLUE"
        :class="
          !editor.isActive('textStyle', { color: '#0000CD' })
            ? 'text-[#0000CD]'
            : 'bg-[#0000CD] text-white'
        "
        :buttonFunction="() => editor.chain().focus().setColor('#0000CD').run()"
      />
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
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import textStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import menuButton from "./menuButton.vue";
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:modelValue"]);
const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Color,
    textStyle,
    Link,
    Underline,
    ListItem,
    Table.configure({
      resizable: true,
    }),
    TableCell,
    TableHeader,
    TableRow,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    ,
  ],
  injectCSS: false,
  onUpdate: ({ editor }) => {
    let content = editor.getHTML();
    emit("update:modelValue", content);
  },
});

const setLink = () => {
  if (editor.value.isActive("link")) {
    editor.value.chain().focus().unsetLink().run();
  } else {
    const url = window.prompt("請輸入URL：");
    if (url) {
      editor.value
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  }
};
</script>
<style scope>
.ProseMirror {
  @apply min-h-[200px] rounded-b p-2 outline-none border-4 border-primaryDark;
}
button {
  @apply relative;
}
button .floatText {
  @apply absolute w-16 text-center font-bold -top-[90%] -left-[50%] opacity-0 lg:inline-block py-1 z-20 text-sm transition-all pointer-events-none bg-primaryDark rounded text-white  hidden;
}
button:hover .floatText {
  opacity: 1;
}
.line {
  @apply p-1 text-lg flex items-center text-primaryDark/50;
}
table {
  @apply overflow-hidden;
}
table th,
table td {
  @apply min-w-[3em] relative;
}
table th > *,
table td > * {
  @apply bottom-0;
}
table .selectedCell:after {
  @apply absolute z-10 left-0 right-0 top-0 bottom-0 bg-secondaryLight/50;
  content: "";
  pointer-events: none;
}
table .column-resize-handle {
  @apply absolute -right-0.5 top-0 h-screen w-1 bg-primaryLight/50 z-50 pointer-events-none;
}
table p {
  margin: 0;
}
.tableWrapper {
  @apply scrollbar overflow-x-auto py-2;
}
.resize-cursor {
  @apply cursor-col-resize;
}
table th {
  text-align: left;
}
</style>
