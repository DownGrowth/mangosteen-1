import { defineComponent, PropType } from "vue";
import { RouteLocationRaw, Router, RouterLink } from "vue-router";
export const SkipFeatures = defineComponent({
  props: {
    to: {
      type: String as PropType<RouteLocationRaw>,
      required: true,
    },
  },
  setup: (props, context) => {
    return () => <RouterLink to={props.to}>跳过</RouterLink>;
  },
});
