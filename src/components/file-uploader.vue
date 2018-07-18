<template>
  <div>
    <form class="ui dropzone segment" data-tooltip="xlsx 또는 csv 파일을 업로드하세요" data-position="bottom left">
      <!-- <input type="file"> -->
      <input type="file" @change="upload($event.target.files[0])" /> 또는 끌어다 놓기
      <div class="ui bottom attached orange progress">
        <div class="bar" :style="{width: `${this.progress}%`}"></div>
      </div>
    </form>
  </div>
</template>
<script>
import { storage } from '~/plugins/firebase-init'

export default {
  name: 'file-uploader',
  props: {
    path: {
      type: String,
      default: () => 'tmp'
    }
  },
  data() {
    return {
      // files: []
      progress: 0
    }
  },
  mounted() {
    let form = this.$el.querySelector('form');
    // cancel events
    ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].map(ev => {
      form.addEventListener(ev, e => {
        e.preventDefault()
        e.stopPropagation()
      }, false)
    })

    form.addEventListener('dragover', e => {
      if (e.dataTransfer.files > 1) {
        e.preventDefault()
        return
      }
      form.classList.add('over')
    })

    form.addEventListener('dragleave', e => {
      form.classList.remove('over')
    })

    form.addEventListener('drop', e => {
      form.classList.remove('over')
      for (let file of  e.dataTransfer.files) {
        // this.files.push(file)
        this.upload(file)
      }
    })
  },
  methods: {
    upload(file) {
      let uploadJob = storage.ref().child(`${this.path}/${file.name}`).put(file)
      uploadJob.on('state_changed', snapshot => {
        this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      })
      uploadJob.then(() => {
        // alert('upload done!')
      })
    }
  }
}
</script>
<style scoped>
.dropzone {
  padding: 1em;
  margin: 1em 0;
  background-color: #f3f3f3;
  border-style: dotted;
  border-width: 3px;
  border-color: #ccc;
}

.dropzone.over {
  background-color: #50B2AC;
}
</style>
