<template>
  <div class="list-container" ref="listContainer" @scroll="throttleScroll">
    <div ref="scrollyItem" style="float:left"></div>
    <div class="list-wrap" ref="listWrapInstance">
      <slot :currentList="currentList"></slot>
    </div>
  </div>
</template>

<script>
function throttle(fn, ms) {
  let flag = true;

  return e => {
    if (!flag) return;
    flag = false;
    fn(e);
    setTimeout(() => {
      flag = true;
    }, ms);
  };
}

export default {
  name: "virtualScroll",
  props: {
    list: {
      type: Array,
      default: () => [],
      required: true
    },
    rowHeight: {
      type: [Number, String],
      default: 40,
      required: true
    },
    rowCount: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      currentList: []
    };
  },
  watch: {
    list(value) {
      this.$nextTick(() => {
        this.initComponentHeight();
        this.initCurrentList();
      });
    }
  },
  methods: {
    handleScroll(e) {
      const { scrollTop, scrollHeight } = e.target;
      const { length } = this.list;
      const rate = scrollTop / scrollHeight;
      const start = parseInt(rate * length);

      this.currentList = this.list.slice(start, start + this.rowCount);
      this.$refs.listWrapInstance.style.marginTop = scrollTop + "px";
    },
    initComponentHeight() {
      const scrollyItem = this.$refs.scrollyItem;
      const listContainer = this.$refs.listContainer;
      let height = +this.rowHeight;

      if (
        typeof this.rowHeight === "string" &&
        this.rowHeight.indexOf("px") !== -1
      ) {
        height = +this.rowHeight.replace(/px/g, "");
      }

      scrollyItem.style.height = this.list.length * height + "px";
      listContainer.style.height = this.rowCount * height + "px";
    },
    initCurrentList() {
      for (let i = 0; i < this.list.length; i++) {
        if (i < this.rowCount) {
          this.currentList.push(this.list[i]);
        } else {
          break;
        }
      }
    }
  },
  created() {
    this.throttleScroll = throttle(this.handleScroll, 6);
    this.initCurrentList();
  },
  mounted() {
    this.initComponentHeight();
  }
};
</script>

<style lang="less" scoped>
.list-container {
  border: 1px solid rgb(168, 168, 168);
  width: 300px;
  overflow: auto !important;
}
</style>
