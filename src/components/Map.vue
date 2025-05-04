<template>
  <div style="height: 600px; width: 800px">
    <l-map ref="map" v-model:zoom="zoom" :center="[41.3, 69.2]">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      />
    </l-map>
  </div>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import { ref, onMounted } from "vue";
import L from "leaflet";
import "leaflet-control-geocoder";

// Marker icon yo‘llarini sozlash (avvalgi kabi)
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url)
    .href,
});

const zoom = ref(6);
const map = ref();

onMounted(() => {
  if (map.value?.leafletObject) {
    const leafletMap = map.value.leafletObject;

    (L.Control as any).geocoder().addTo(leafletMap);
  }
});
</script>

<style></style>
