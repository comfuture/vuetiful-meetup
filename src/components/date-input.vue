<template>
  <input type="text" :value="stringify(parse(value))" @input="$emit('input', parse($event.target.value))" @focus="select">
</template>
<script>
import moment from 'moment'
import Flatpickr from 'flatpickr'

export default {
  name: 'date-input',
  props: {
    value: {
      type: Date,
      default: () => new Date()
    },
    format: {
      type: String,
      default: () => 'LLL'  // XXX
    },
    picker: Boolean,
    time: Boolean
  },
  mounted() {
    // "Y-m-d H:i"
    if (this.picker) {
      import('flatpickr/dist/flatpickr.css')
      import('flatpickr').then(() => {
        this.flatpickr = new Flatpickr(this.$el, {
          defaultDate: this.parse(this.value),
          enableTime: this.time
          // dateFormat: this.format
        })
        // roll back to format from props
        this.$nextTick(() => {
          this.$emit('input', this.parse(this.value))
          this.$forceUpdate()
        })
        
      })
    }
  },
  beforeDestroy() {
    if (this.flatpickr) {
      this.flatpickr.destroy()
      this.flatpickr = null
    }
  },
  methods: {
    parse(value) {
      if (value instanceof Date && !isNaN(value.valueOf())) {
        return value
      } else if (typeof value === 'number') {
        return new Date(+value)
      } else {
        try {
          return new Date(Date.parse(value))
        } catch (e) {
          return moment(value).toDate() // XXX http://momentjs.com/guides/#/warnings/js-date/
        }
      }
    },
    stringify(date) {
      if (!date) {
        return ''
      }
      return moment(date).format(this.format) // XXX
    },
    select(event) {
      setTimeout(() => {
        if (!this.picker) {
          event.target.select()
        }
      }, 0)
    }
  }
}
</script>
