<template>
  <div>
    <div class="VueLogo">
      <div class="Triangle Triangle--two"></div>
      <div class="Triangle Triangle--one"></div>
      <div class="Triangle Triangle--three"></div>
      <div class="Triangle Triangle--four"></div>
    </div>
    <span class="app-title">ue.tiful korea</span>
  </div>
</template>

<style>
.VueLogo {
  display: inline-block;
  transform: rotateX(180deg);
  position: relative;
  overflow: hidden;
  height: 180px;
  width: 245px;
  left: 13px;
}

.Triangle {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
}

.Triangle--one {
  border-left: 105px solid transparent;
  border-right: 105px solid transparent;
  border-bottom: 180px solid #41B883;
}

.Triangle--two {
  top: 30px;
  left: 35px;
  border-left: 87.5px solid transparent;
  border-right: 87.5px solid transparent;
  border-bottom: 150px solid #3B8070;
}

.Triangle--three {
  top: 60px;
  left: 35px;
  border-left: 70px solid transparent;
  border-right: 70px solid transparent;
  border-bottom: 120px solid #35495E;
}

.Triangle--four {
  top: 120px;
  left: 70px;
  border-left: 35px solid transparent;
  border-right: 35px solid transparent;
  border-bottom: 60px solid #fff;
}

.app-title {
  font-size: 4em;
}
</style>
