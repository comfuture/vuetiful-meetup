<template>
  <div class="ql-container">
    <div ref="editor"></div>
  </div>
</template>
<script>
export default {
  name: 'quill-editor',
  props: {
    value: String
  },
  data() {
    return {
      _content: ''
    }
  },
  mounted() {
    Promise.all([
      import('quill'),
      import('quill/dist/quill.core.css'),
      import('quill/dist/quill.snow.css')
    ]).then(([Quill, _, __]) => {
      var quill = this.quill = new Quill(this.$refs.editor, {
        theme: 'snow',
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['blockquote', 'code-block'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              ['clean'],
              ['link', 'image', 'video']
            ]
          }
      })
      quill.pasteHTML(this.value)
      quill.on('text-change', (delta, oldDelta, source) => {
        let html = this.$refs.editor.children[0].innerHTML
        const text = quill.getText()
        if (html === '<p><br></p>') html = ''
        this._content = html
        this.$emit('input', this._content)
        this.$emit('change', { html, text, quill })
      })
      quill.focus()
    })
  },
  watch: {
    value(newVal, oldVal) {
      if (this.quill) {
        if (newVal && newVal !== this._content) {
          this._content = newVal
          this.quill.pasteHTML(newVal)
        } else if(!newVal) {
          this.quill.setText('')
        }
      }
    }
  }
}
</script>
<style>
.ql-container .ql-snow {
  border: 1px solid rgba(34,36,38,.15);
}
.ql-toolbar {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.ql-container {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.ql-editor {
  min-height: 200px;
}
</style>
