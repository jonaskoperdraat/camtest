<template>
  <div>
    <div id="container" class="overlay" v-show="active">
      <div class="overlay-content" :class="{previewing: previewing}">
        <img v-show="previewing" v-bind:src="previewData" id="preview" alt="Camera capture preview"/>

        <video autoplay :src-object.prop.camel="stream"
               @loadedmetadata="loadedMetaData"
               ref="video"></video>
        <div class="controls">
          <button @click="close" class="close-btn">Close</button>
          <select v-model="videoDeviceId" @change="showFeed" v-if="!previewing">
            <option v-for="device in videoDevices" v-bind:value="device.deviceId" v-bind:key="device.deviceId">
              {{device.label}}
            </option>
          </select>
          <button @click="capturePreview" v-if="!previewing">Take picture</button>
          <button @click="dismissPreview" v-if="previewing">Dismiss</button>
          <button @click="acceptPreview" v-if="previewing">Accept</button>
        </div>
        <div class="stats">
          width: {{stats.width}}<br/>
          height: {{stats.height}}<br />
          previewing: {{!!previewData}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        active: false,
        stream: null,
        videoDevices: [],
        videoDeviceId: null,
        stats: {
          width: null,
          height: null
        },
        previewData: null
      };
    },
    computed: {
      previewing() {
        return !!this.previewData;
      }
    },
    methods: {
      startCapture() {
        this.active = true;
        const self = this;

        if (navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia) {
          console.log("UserMedia supported");
        } else {
          console.error("UserMedia NOT supported");
          return;
        }


        console.log("navigator.mediaDevices", navigator.mediaDevices);
        navigator.mediaDevices.enumerateDevices().then(info => {
          console.log('enumerate devices', info);
          self.videoDevices = info.filter(device => device.kind === 'videoinput');
          console.log('available video devices', self.videoDevices);
          self.videoDeviceId = this.videoDeviceId = window.localStorage.getItem('ImgCapture.videoDeviceId') ||
              self.videoDevices[0].deviceId;
          console.log('select default device', self.deviceId);
          self.showFeed();
        });
      },
      showFeed() {
        this.stop();
        window.localStorage.setItem('ImgCapture.videoDeviceId', this.videoDeviceId);
        navigator.mediaDevices
            .getUserMedia(this.getConstraints())
            .then(this.gotMedia)
            .catch((e) => {
              console.log("Error opening media stream", e.message, e.name, e)
            });
      },
      getConstraints() {
        const constraints = {
          // video: true,
          video: {
            height: 2160,
            aspectRatio: 1920/1080,
            deviceId: {exact: this.videoDeviceId}
          },
          audio: false,
        };
        console.log('constraints', constraints);
        return constraints;
      },
      gotMedia(stream) {
        console.log("Opened stream");
        this.stream = stream
        this.stream.getTracks().forEach(track => console.log(track, track.getCapabilities()));
      },
      capturePreview() {
        console.log('snap');
        const canvas = document.createElement('canvas');
        canvas.width = this.stats.width;
        canvas.height = this.stats.height;
        let context = canvas.getContext('2d');
        context.drawImage(this.$refs.video, 0, 0, this.stats.width, this.stats.height);
        this.previewData = canvas.toDataURL('image/png');
        this.$loadImage(this.previewData,
            function(img, data) {
              console.log('loadedImage', img, data);
            },
            {
              meta: true
            }
        )
      },
      acceptPreview() {
        this.$emit('photo', {
          src: this.previewData,
          width: this.stats.width,
          height: this.stats.height
        });
        this.previewData = null;
        this.stop();
        this.active = false;
      },
      dismissPreview() {
        this.previewData = null;
      },
      stop() {
        console.log('stop');
        if (this.stream) {
          console.log('Stopping current stream');
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }
      },
      close() {
        console.log('close');
        this.active = false;
        this.stop();
      },
      loadedMetaData(meta) {
        console.log('loadedMetaData', meta);
        this.stats.width = this.$refs.video.videoWidth;
        this.stats.height = this.$refs.video.videoHeight;
      },
    }

  };
</script>

<style scoped lang="scss">
  .overlay {
    height: 100%;
    width: 100%;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.9);

    .controls {
      background-color: rgb(255, 255, 255, .75);
      width: 15%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    .stats {
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: rgb(0, 0, 0, .75);
      color: lime;
      font-family: monospace;
      text-align: left;
    }


    video, #preview {
      object-fit: contain;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .preview {
      display: none
    }

  }

  .overlay-content.previewing {
    video {
      display: none
    }
  }

</style>
