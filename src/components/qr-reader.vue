<template>
  <div class="qr-reader">
    <video ref="video" autoplay></video>
    <button class="ui close icon button" @click="$emit('update:active', false)"><i class="close icon"></i></button>
    <button ref="flipButton" class="ui flip camera icon button" v-show="flipButtonVisible"><i class="camera icon"></i><i class="sync alternate icon"></i></button>
    <canvas ref="canvas" width="50" height="50"></canvas>
  </div>
</template>
<script>
export default {
  name: 'qr-reader',
  props: {
    active: Boolean
  },
  data() {
    return {
      flipButtonVisible: false
    }
  },
  beforeDestroy() {
    let video = this.$refs.video
    if (video.srcObject) {
      video.srcObject.getTracks()[0].stop()
    }
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  mounted() {
    let self = this
    let {document, navigator} = window
    let video = this.$refs.video
    let canvas = this.$refs.canvas
    let flipButton = this.$refs.flipButton
    let ctx = canvas.getContext('2d')
    let currentDeviceId

    const decoder = new Worker("qrdecoder.js");
    decoder.postMessage({cmd: 'init'})
    decoder.addEventListener('message', e => {
      if (e.data !== false) {
        this.$emit('result', e.data)
      }
    })

    let snapshotSquare
    const calculateSquare = function calculateSquare() {
      let snapshotSize = 500 // overlay.offsetWidth
      snapshotSquare = {
        'x': ~~((video.videoWidth - snapshotSize)/2),
        'y': ~~((video.videoHeight - snapshotSize)/2),
        'size': ~~(snapshotSize)
      }

      canvas.width = snapshotSquare.size
      canvas.height = snapshotSquare.size
    }

    const scanCode = function scanCode(wasSuccess) {
      self.interval = setInterval(function() {
        let {x, y, size} = snapshotSquare
        ctx.drawImage(video, x, y, size, size, 0, 0, size, size);
        const imageData = ctx.getImageData(0, 0, size, size);

        // scan for QRCode
        decoder.postMessage({
          cmd: 'process',
          width: snapshotSquare.size,
          height: snapshotSquare.size,
          imageData: imageData
        });
      }, 120);
    }

    const stopStream = function stopStream() {
      if (video.srcObject) {
        video.srcObject.getTracks()[0].stop()
      }
      if (self.interval) {
        clearInterval(self.interval)
      }
    }

    const initVideoStream = function initVideoStream() {
      stopStream()
      let config = {
        audio: false,
        video: currentDeviceId ? {deviceId: currentDeviceId} : {facingMode: 'environment'}
      }
      navigator.mediaDevices.getUserMedia(config).then(stream => {

        video.srcObject = stream
        video.oncanplay = () => {
          self.flipButtonVisible = true
          calculateSquare()
          scanCode()
        };
      }).catch(error => {
        console.log('error', error)
      })
    }
    initVideoStream()

    navigator.mediaDevices.enumerateDevices().then(devices => {
      devices = devices.filter(device => {
        return device.kind === 'videoinput'
      })
      // console.log('devices.length', devices.length)
      if (devices.length > 1) {
        
        this.flipButtonVisible = true

        currentDeviceId = devices[0].deviceId; // no way to know current MediaStream's device id so arbitrarily choose the first

        flipButton.addEventListener('click', event => {
          let targetDevice
          for (let i = 0; i < devices.length; i++) {
            if (devices[i].deviceId === currentDeviceId) {
              targetDevice = (i + 1 < devices.length) ? devices[i + 1] : devices[0]
              break
            }
          }
          currentDeviceId = targetDevice.deviceId
          initVideoStream()
        });
      }
    })
  }
}
</script>
<style scoped>
.qr-reader {
  width: 100%;
}
video {
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  /* z-index: 101; */
  transform: translateX(-50%) translateY(-50%);
  filter: brightness(50%)
}
canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 70vmin;
  height: 70vmin;
  transform: translateX(-50%) translateY(-50%);
  text-align: center;
}

canvas:after {
  content:'';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 0 999px rgba(0, 0, 0, 0.4);
}

.close.button {
  position: absolute;
  top: 15vmin;
  left: 5vmin;
  background: #e33;
  color: white;
}

.flip.camera.button {
  position: absolute;
  top: 15vmin;
  right: 5vmin;
  background: #eee;
}
</style>
