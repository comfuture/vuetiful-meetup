import Vue from 'vue'
import moment from 'moment'
import DateInput from '~/components/date-input'
import MeetupItem from '~/components/meetup-item'
import FileUploader from '~/components/file-uploader'
import QuillEditor from '~/components/quill-editor'

Vue.filter('ago', v => moment(v).fromNow())
Vue.filter('date', (v, fmt = 'LLL') => moment(v).format(fmt))

Vue.component('date-input', DateInput)
Vue.component('meetup-item', MeetupItem)
Vue.component('file-uploader', FileUploader)
Vue.component('quill-editor', QuillEditor)
