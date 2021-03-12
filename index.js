import VirtualScroll from "./index.vue";

VirtualScroll.install = function (Vue) {
  Vue.component(VirtualScroll.name, VirtualScroll);
};

export default VirtualScroll;
