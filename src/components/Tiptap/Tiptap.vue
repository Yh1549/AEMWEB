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
      <div
        class="relative"
        @mouseenter="textColorMenu = true"
        @mouseleave="textColorMenu = false"
      >
        <menu-button
          icon-class="fa-solid fa-font border-b-4 border-black"
          :icon-style="editor.getAttributes('textStyle').color"
          @click="textColorMenu = true"
        />
        <div v-show="textColorMenu" class="tiptapMenu -left-16">
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
            :buttonFunction="
              () => editor.chain().focus().setColor('#DA100B').run()
            "
          />
          <menu-button
            textSm="BLUE"
            :class="
              !editor.isActive('textStyle', { color: '#0000CD' })
                ? 'text-[#0000CD]'
                : 'bg-[#0000CD] text-white'
            "
            :buttonFunction="
              () => editor.chain().focus().setColor('#0000CD').run()
            "
          />
          <menu-button
            class="hover:bg-black hover:text-white"
            textSm="清除"
            :buttonFunction="() => editor.chain().focus().unsetColor().run()"
          />
        </div>
      </div>
      <div
        class="relative"
        @mouseenter="highlightMenu = true"
        @mouseleave="highlightMenu = false"
      >
        <menu-button
          icon-class="fa-solid fa-highlighter border-b-4 border-black"
          :icon-style="highlightColor"
          :isActive="editor.isActive('highlight')"
          :buttonFunction="
            () =>
              editor
                .chain()
                .focus()
                .toggleHighlight({ color: highlightColor })
                .run()
          "
        />
        <div v-show="highlightMenu" class="tiptapMenu -left-6">
          <input
            class="flex justify-center self-center"
            type="color"
            v-model="highlightColor"
            @input="
              editor
                .chain()
                .focus()
                .toggleHighlight({ color: highlightColor })
                .run()
            "
          />
          <menu-button
            class="hover:bg-black hover:text-white"
            textSm="清除"
            :buttonFunction="
              () => editor.chain().focus().unsetHighlight().run()
            "
          />
        </div>
      </div>
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
        label="段落"
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
          :img="colAddImg"
          :buttonFunction="() => editor.chain().focus().addColumnAfter().run()"
        />
        <menu-button
          label="刪除欄"
          :img="colDelImg"
          :buttonFunction="() => editor.chain().focus().deleteColumn().run()"
        />
        <menu-button
          label="新增列"
          :img="rowAddImg"
          :buttonFunction="() => editor.chain().focus().addRowAfter().run()"
        />
        <menu-button
          label="刪除列"
          :img="rowDelImg"
          :buttonFunction="() => editor.chain().focus().deleteRow().run()"
        />
        <menu-button
          label="合併儲存格"
          :img="tableMergeImg"
          :buttonFunction="() => editor.chain().focus().mergeOrSplit().run()"
        />
        <div
          class="relative"
          @mouseenter="tableBgMenu = true"
          @mouseleave="tableBgMenu = false"
        >
          <menu-button
            icon-class="fa-solid fa-fill-drip  border-b-4 border-white"
            :icon-style="tableBg"
            :buttonFunction="
              () => editor.commands.setCellAttribute('backgroundColor', tableBg)
            "
          />
          <div v-show="tableBgMenu" class="tiptapMenu -left-6">
            <input
              class="flex justify-center self-center"
              type="color"
              v-model="tableBg"
              @input="
                editor.commands.setCellAttribute('backgroundColor', tableBg)
              "
            />
            <menu-button
              class="hover:bg-black hover:text-white"
              textSm="清除"
              :buttonFunction="
                () => editor.commands.setCellAttribute('backgroundColor', null)
              "
            />
          </div>
        </div>
        <menu-button
          label="刪除表格"
          :img="tableDelImg"
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
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script setup>
import { ref } from "vue";
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
import Highlight from "@tiptap/extension-highlight";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import menuButton from "./menuButton.vue";
import colAddImg from "../../assets/column-add.png";
import colDelImg from "../../assets/delete-column.png";
import rowAddImg from "../../assets/row-add.png";
import rowDelImg from "../../assets/row-del.png";
import tableMergeImg from "../../assets/merge.png";
import tableDelImg from "../../assets/table-del.png";
const textColorMenu = ref(false);
const highlightColor = ref("#ffff00");
const highlightMenu = ref(false);
const tableBgMenu = ref(false);
const tableBg = ref("#FFFFFF");
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});
const exTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {};
          }

          return {
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
        parseHTML: (element) => {
          return element.style.backgroundColor.replace(/['"]+/g, "");
        },
      },
    };
  },
});
const exTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {};
          }
          return { style: `background-color: ${attributes.backgroundColor}` };
        },
        parseHTML: (element) => {
          return element.style.backgroundColor.replace(/['"]+/g, "");
        },
      },
    };
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
    Highlight.configure({ multicolor: true }),
    exTableCell,
    exTableHeader,
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
<style scoped>
.line {
  @apply p-1 text-lg flex items-center text-primaryDark/50;
}
.tiptapMenu {
  @apply absolute -top-14 flex bg-white border border-gray-300 rounded p-2 z-10 flex-row;
}
input {
  @apply mr-1;
}
</style>
