import Vue from 'vue'
import MeetupItem from '~/components/meetup-item'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

Vue.component('meetup-item', MeetupItem)
Vue.component('flatPickr', flatPickr)